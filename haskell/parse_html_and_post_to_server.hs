{-# LANGUAGE QuasiQuotes #-}
{-# LANGUAGE DeriveGeneric #-}
{-# LANGUAGE OverloadedStrings #-}

import Text.HTML.TagSoup
import qualified Data.Text as T
import qualified Data.Text.Lazy as L
import qualified Data.Text.IO as T.IO
import qualified Data.ByteString.Lazy as BL
import qualified Data.ByteString.Char8 as S8
import qualified Data.Yaml as Yaml

import Text.RawString.QQ
import Data.Text.Template
import GHC.Generics
import Data.Aeson
import Data.Text.Encoding
import Network.HTTP.Client
import Network.HTTP.Simple


data Message =
  Message { messageType :: !(T.Text)
          , media :: !(T.Text)
          , content :: !(T.Text)
          , date :: !(T.Text)
           } deriving (Generic, Show)

instance ToJSON Message where
   toEncoding = genericToEncoding defaultOptions

isMessageTag :: Tag T.Text -> Bool
isMessageTag tag = (isTagOpen tag) && ((T.pack "message") `elem` (T.words (fromAttrib (T.pack "class") tag)))

getMessageType :: [Tag T.Text] -> T.Text
getMessageType = (!! 1) . T.words . fromAttrib (T.pack "class") . (!! 0) . filter isMessageTag

getMedia :: [Tag T.Text] -> T.Text
getMedia tagList = getMediaFromTag $ tagList !! 3
  where getMediaFromTag (TagText text) = T.pack "text"
        getMediaFromTag (TagOpen attribName attribList)
          | attribName == (T.pack "span") = T.pack "text"
          | attribName == (T.pack "img") = T.pack "img"
        getMediaFromTag _ = T.pack "text" -- no data available, e.g. voice message

changeNewLine = T.replace (T.pack "\r\n") (T.pack ['\n'])

getContent :: [Tag T.Text] -> T.Text
getContent tagList = getContentFromTag $ tagList !! 3
  where getContentFromTag (TagText text) = changeNewLine text
        getContentFromTag (TagOpen attribName attribList)
          | attribName == (T.pack "span") = T.pack ""
          | attribName == (T.pack "img") = snd (attribList !! 0)
        getContentFromTag _ = T.pack "" -- no data available, e.g. voice message

getDate :: [Tag T.Text] -> T.Text
getDate =  fromTagText . (!! 0) . dropWhile (not . isTagText) . dropWhile (not . isTimestampTag)
  where isTimestampTag tag = (isTagOpen tag) && (fromAttrib (T.pack "class") tag) == (T.pack "timestamp")


-- TagOpen "div" [("class","timestamp")],TagOpen "span" [],TagText "11/2/2015 - 16:28:58"

tagsToMessage :: [Tag T.Text] -> Message
tagsToMessage tags = Message messageType media content date
  where messageType = getMessageType tags
        media = getMedia tags
        content = getContent tags
        date = getDate tags

sendMessages :: [Message] -> IO ()
sendMessages messages = do
  let request = setRequestBodyJSON messages $ "POST http://localhost:8000/messages"
  response <- httpJSON request
  putStrLn $ "The status code was: " ++
             show (getResponseStatusCode response)
  print $ getResponseHeader "Content-Type" response
  S8.putStrLn $ Yaml.encode (getResponseBody response :: Value)

sendMessagesInChunks :: [Message] -> Int -> IO ()
sendMessagesInChunks [] _ = (print "All messages sent")
sendMessagesInChunks messages chunkSize = do
  sendMessages (take chunkSize messages)
  sendMessagesInChunks (drop chunkSize messages) chunkSize


main :: IO ()
main = do
  input <- T.IO.readFile "sample_messages.html"
  let tagListOfList = partitions isMessageTag $ parseTags input
  let messages = map tagsToMessage tagListOfList
  sendMessagesInChunks messages 100


  -- let fromJSONlib = listToJSONList $ map (decodeUtf8 . BL.toStrict . encode . tagsToMessage) tagListOfList
  -- T.IO.writeFile "output2.txt" fromJSONlib
  print "Done"
