'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ClipboardList, MessageSquare } from 'lucide-react';
import axios from 'axios';
import 'video.js/dist/video-js.css';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const VideoAnalysisPage = () => {
  const params = useParams();
  const meetingId = params.id;
  
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(false);

  const parseKeyPoints = (meeting) => {
    if (!meeting || !meeting.keypoints) return [];
    
    const data = meeting.keypoints.trim().split('\n').map((line) => {
      const regex = /\*\*(\d{1,2}:\d{2})\*\* - \*\*(.*?)\*\*: (.*)/;
      const match = line.match(regex);
      return match ? {
        timestamp: match[1],   // Captures the timestamp (e.g., 0:30 or 3:05)
        statement: match[2],   // Captures the statement (e.g., Project Timeline Update)
        explanation: match[3], // Captures the explanation
      } : null;
    }).filter(Boolean);
  
    console.log("Parsed keypoints:", data);
    return data;
  };
  
  
  

  const keyPoints = parseKeyPoints(meeting);

  const moveToTime = (time) => {
    const videoElement = document.getElementById('videoPlayer');
    const timeParts = time.split(':');
    const minutes = parseFloat(timeParts[0]) || 0;
    const seconds = parseFloat(timeParts[1]) || 0;
    const targetTime = minutes * 60 + seconds;

    if (!isNaN(targetTime) && targetTime >= 0 && targetTime <= videoElement.duration) {
      videoElement.currentTime = targetTime;
    } else {
      alert('Please enter a valid time within the video duration.');
    }
  };

  useEffect(() => {
    const fetchMeeting = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:9000/meeting/${meetingId}`);
        setMeeting(response.data);
      } catch (error) {
        console.error('Error fetching meeting:', error);
        alert('An error occurred while fetching the meeting data.');
      } finally {
        setLoading(false);
      }
    };

    fetchMeeting();
  }, [meetingId]);
  const parseNotesWithRegex = (notes) => {
    const sectionRegex = /\*\*(.*?)\*\*\s(.*?)(?=(\*\*|$))/gs; // Match headers and their content
    const matches = [...notes.matchAll(sectionRegex)];
  
    return matches.map((match, index) => {
      const [_, header, content] = match;
      return (
        <div key={index} className="mb-4">
          <h3 className="font-bold">{header}</h3>
          <p>{content.trim()}</p>
        </div>
      );
    });
  };
  const sendMessage = useCallback((e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setChatMessages(prev => [...prev, { text: newMessage, sender: 'user' }]);
      setNewMessage('');
      setTimeout(() => {
        setChatMessages(prev => [...prev, { text: "Thanks for your message. How can I assist you further?", sender: 'ai' }]);
      }, 1000);
    }
  }, [newMessage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500"></div>
        <p className="ml-4">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className='flex justify-end'>        
        <Link href='/main/todo' className="text-lg font-bold mb-6 flex">Tasks <ClipboardList/></Link>
      </div>
 
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/3">
          <Card className="mb-4">
            <CardContent className="p-0">
              <div className="bg-gray-200 h-96 flex items-center justify-center">
                {meeting && 
                  <video id="videoPlayer" className='w-full h-full' controls>
                    <source src={meeting.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                }
              </div>
            </CardContent>
          </Card>
          {meeting && (
            <Card>
              <CardHeader>
                <CardTitle>Video Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="notes">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                    <TabsTrigger value="keypoints">Key Points</TabsTrigger>
                    <TabsTrigger value="transcript">Transcript</TabsTrigger>
                  </TabsList>
                  <TabsContent value="notes">
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                      {/* <h3 className="text-lg font-semibold mb-2">{meeting.notes.summary}</h3> */}
                      {parseNotesWithRegex(meeting.notes)}
                      {/* <p className="mt-4 font-semibold">{meeting.notes.conclusion}</p> */}
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent value="keypoints">
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                      <ul >
                      {keyPoints && keyPoints.length > 0 ? (
  keyPoints.map((point, index) => (
    <li key={index} className="mb-3" onClick={() => moveToTime(point.timestamp)}>
      <strong>[{point.timestamp}]</strong> - <strong>{point.statement}:</strong> {point.explanation}
    </li>
  ))
) : (
  <p>No key points available</p>
)}
                      </ul>
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent value="transcript">
                    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                      {meeting.transcription}
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
        
        <Card className="w-full h-max md:w-1/3">
          <CardHeader>
            <CardTitle>Chat <MessageSquare/></CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[320px] p-4 border rounded-md">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`mb-2 ${msg.sender === 'ai' ? 'text-left' : 'text-right'}`}>
                  <span className={`px-3 py-1 rounded-md ${msg.sender === 'ai' ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}>
                    {msg.text}
                  </span>
                </div>
              ))}
            </ScrollArea>
            <form onSubmit={sendMessage} className="mt-4 flex items-center space-x-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="border rounded-md p-2 w-full"
                placeholder="Enter your message"
              />
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                Send
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VideoAnalysisPage;
