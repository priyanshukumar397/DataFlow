import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PipelineDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pipeline, setPipeline] = useState(null);

  useEffect(() => {
    axios.get(`/pipelines/${id}`)
      .then(response => {
        setPipeline(response.data);
      })
      .catch(error => console.error('Error fetching pipeline details:', error));
  }, [id]);

  const runPipeline = () => {
    axios.post(`/pipelines/run/${id}`)
      .then(() => alert('Pipeline is running!'))
      .catch(error => {
        console.error('Error running pipeline:', error);
        alert('Failed to run the pipeline. Please try again later.');
      });
  };

  const deletePipeline = () => {
    if (window.confirm('Are you sure you want to delete this pipeline?')) {
      axios.delete(`/pipelines/${id}`)
        .then(() => {
          alert('Pipeline deleted successfully!');
          navigate('/pipeline');
        })
        .catch(error => {
          console.error('Error deleting pipeline:', error);
          alert('Failed to delete the pipeline. Please try again later.');
        });
    }
  };

  if (!pipeline) return <p>Loading...</p>;

  return (
    <div>
      <nav className="flex justify-between p-4 bg-blue-500 text-white">
        <button onClick={() => navigate('/')}>Home</button>
        <button onClick={() => navigate('/pipeline')}>Pipelines</button>
      </nav>
      <h1 className="text-3xl font-bold mb-4">Pipeline Details</h1>
      <p><strong>Name:</strong> {pipeline.name}</p>
      <p><strong>Description:</strong> {pipeline.description}</p>
      <p><strong>Source:</strong> {pipeline.source}</p>
      <p><strong>Destination:</strong> {pipeline.destination}</p>
      <p><strong>Status:</strong> 
        <span className={`ml-2 px-2 py-1 rounded text-white ${
          pipeline.status === 'Running' ? 'bg-yellow-500' :
          pipeline.status === 'Completed' ? 'bg-green-500' :
          pipeline.status === 'Failed' ? 'bg-red-500' : 'bg-gray-500'
        }`}>
          {pipeline.status}
        </span>
      </p>
      <div className="mt-4">
        <button 
          onClick={runPipeline} 
          className="bg-green-500 text-white px-4 py-2 rounded mr-4">
          Run Pipeline
        </button>
        <button 
          onClick={() => navigate(`/edit/${pipeline.id}`)} 
          className="bg-blue-500 text-white px-4 py-2 rounded mr-4">
          Edit Pipeline
        </button>
        <button 
          onClick={deletePipeline} 
          className="bg-red-500 text-white px-4 py-2 rounded">
          Delete Pipeline
        </button>
      </div>
    </div>
  );
};

export default PipelineDetails;
