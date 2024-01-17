import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [jobIds, setJobIds] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchJobIds = async () => {
    try {
      const response = await axios.get(
        "https://hacker-news.firebaseio.com/v0/jobstories.json"
      );
      setJobIds(response.data);
    } catch (error) {
      console.error("Error fetching job IDs:", error);
    }
  };

  const fetchJobDetails = async (id) => {
    try {
      const response = await axios.get(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching job details for ID ${id}:`, error);
    }
  };

  const fetchJobs = async () => {
    setIsLoading(true);
    const newJobs = [];

    for (let i = 0; i < 6 && jobIds.length > 0; i++) {
      const jobId = jobIds.shift();
      const jobDetails = await fetchJobDetails(jobId);
      newJobs.push(jobDetails);
    }

    setJobs((prevJobs) => [...prevJobs, ...newJobs]);
    setIsLoading(false);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const options = {
      hour12: true,
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    };
    const formattedTime = date.toLocaleTimeString("en-US", options);
    return formattedTime;
  };

  useEffect(() => {
    fetchJobIds();
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [jobIds]);

  return (
    <div className="jobs-container">
      <h2 className="title">Hacker News Job Board</h2>
      {jobs.map((job) => (
        <div key={job.id} className="job-details">
          <div className="job">
            <h3>
              {job.url ? (
                <a href={job.url} target="_blank" rel="noopener noreferrer">
                  {job.title}
                </a>
              ) : (
                job.title
              )}
            </h3>
            <p>
              By {job.by} | {formatDate(job.time)} | {formatTimestamp(job.time)}
            </p>
          </div>
        </div>
      ))}
      {isLoading ? (
        <svg class="pl" width="240" height="240" viewBox="0 0 240 240">
          <circle
            class="pl__ring pl__ring--a"
            cx="120"
            cy="120"
            r="105"
            fill="none"
            stroke="#000"
            stroke-width="20"
            stroke-dasharray="0 660"
            stroke-dashoffset="-330"
            stroke-linecap="round"
          ></circle>
          <circle
            class="pl__ring pl__ring--b"
            cx="120"
            cy="120"
            r="35"
            fill="none"
            stroke="#000"
            stroke-width="20"
            stroke-dasharray="0 220"
            stroke-dashoffset="-110"
            stroke-linecap="round"
          ></circle>
          <circle
            class="pl__ring pl__ring--c"
            cx="85"
            cy="120"
            r="70"
            fill="none"
            stroke="#000"
            stroke-width="20"
            stroke-dasharray="0 440"
            stroke-linecap="round"
          ></circle>
          <circle
            class="pl__ring pl__ring--d"
            cx="155"
            cy="120"
            r="70"
            fill="none"
            stroke="#000"
            stroke-width="20"
            stroke-dasharray="0 440"
            stroke-linecap="round"
          ></circle>
        </svg>
      ) : (
        <>
          {jobIds.length > 0 && (
            <button onClick={fetchJobs}>Load more jobs</button>
          )}
        </>
      )}
    </div>
  );
};

export default App;
