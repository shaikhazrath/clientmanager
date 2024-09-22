'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, Video } from "lucide-react";
import { useRouter } from 'next/navigation';
import axios from 'axios';

export function VideoCatalog() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!uploadedFile) return; // Prevent submission if no file

    setLoading(true); // Start loading
    try {
      const video = uploadedFile;
      const formData = new FormData();
      formData.append('video', video);

      const response = await axios.post('http://localhost:9000/uploadvideo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      router.push(`/main/meeting/${response.data.savedUpload._id}`);
    } catch (error) {
      console.error('Error uploading video:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const meetings = [
    { id: 1, title: "Q2 Strategy Meeting", date: "2023-06-15" },
    { id: 2, title: "Product Launch Planning", date: "2023-06-18" },
    { id: 3, title: "Client Onboarding: XYZ Corp", date: "2023-06-20" },
    { id: 4, title: "Team Performance Review", date: "2023-06-22" },
    { id: 5, title: "Budget Review", date: "2023-06-25" },
    { id: 6, title: "Marketing Campaign Brainstorm", date: "2023-06-28" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-black dark:text-white">Meeting Videos</h1>
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">Upload New Meeting Video</h2>
        <Card className="bg-white dark:bg-black border-2 border-black dark:border-white">
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center mt-10 ${
                dragActive ? "border-gray-600 bg-gray-100 dark:bg-gray-800" : "border-gray-300 dark:border-gray-600"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}>
              <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Drag and drop your video file here, or
              </p>
              <Input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={handleChange}
                accept="video/*" />
              <Label htmlFor="file-upload">
                <Button className="mt-2" variant="outline" size="sm" asChild>
                  <span>Select a file</span>
                </Button>
              </Label>
              {uploadedFile && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  File uploaded: {uploadedFile.name}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleSubmit}
              className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
              {loading ? "Uploading..." : "Upload and Process"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">Previous Meetings</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {meetings.map((meeting) => (
            <Card
              key={meeting.id}
              className="bg-white dark:bg-black border-2 border-black dark:border-white">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-black dark:text-white">{meeting.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-200 dark:bg-gray-800 flex items-center justify-center mb-2">
                  <Video className="h-12 w-12 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{meeting.date}</p>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                  Watch Recording
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
