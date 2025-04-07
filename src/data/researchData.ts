
import { OutputType } from '@/components/OutputTypeIcon';

// Example data for research outputs
export const researchOutputs = [
  {
    id: 1,
    title: "Deep Learning for Medical Image Segmentation",
    authors: ["John Smith", "Jane Doe"],
    type: 'paper' as OutputType,
    year: 2023,
    journal: "IEEE Transactions on Medical Imaging",
    abstract: "This paper presents a novel approach for medical image segmentation using deep learning...",
    keywords: ["deep learning", "medical imaging", "segmentation"],
    citations: 42
  },
  {
    id: 2,
    title: "A Novel Algorithm for Anomaly Detection in Time Series Data",
    authors: ["Alice Johnson", "Bob Williams"],
    type: 'code' as OutputType,
    year: 2022,
    journal: "Journal of Machine Learning Research",
    abstract: "We introduce a new algorithm for detecting anomalies in time series data with high accuracy and low computational cost...",
    keywords: ["anomaly detection", "time series", "machine learning"],
    citations: 28
  },
  {
    id: 3,
    title: "System and Method for Automated Patent Claim Generation",
    authors: ["Emily Brown", "David Garcia"],
    type: 'patent' as OutputType,
    year: 2021,
    abstract: "This patent describes a system and method for automatically generating patent claims based on a given invention disclosure...",
    keywords: ["patent claim generation", "automation", "intellectual property"],
    citations: 15
  },
  {
    id: 4,
    title: "Graph Neural Networks for Drug Discovery",
    authors: ["Sarah Lee", "Michael Chen"],
    type: 'paper' as OutputType,
    year: 2023,
    journal: "Bioinformatics",
    abstract: "We explore the use of graph neural networks for predicting drug-target interactions and identifying potential drug candidates...",
    keywords: ["graph neural networks", "drug discovery", "bioinformatics"],
    citations: 35
  },
  {
    id: 5,
    title: "Open Source Library for Data Visualization",
    authors: ["Kevin Rodriguez", "Linda Nguyen"],
    type: 'code' as OutputType,
    year: 2022,
    abstract: "An open-source library providing a wide range of data visualization tools and techniques for various data types and formats...",
    keywords: ["data visualization", "open source", "visualization tools"],
    citations: 20
  },
  {
    id: 6,
    title: "Method for Securing Wireless Communication Networks",
    authors: ["Brian Wilson", "Jessica Martinez"],
    type: 'patent' as OutputType,
    year: 2020,
    abstract: "A method for enhancing the security of wireless communication networks against various types of cyber attacks and intrusions...",
    keywords: ["wireless communication", "network security", "cybersecurity"],
    citations: 10
  }
];

// Publications by year data for chart
export const publicationsByYear = [
  { year: '2020', papers: 5, patents: 1, codes: 3 },
  { year: '2021', papers: 8, patents: 2, codes: 6 },
  { year: '2022', papers: 12, patents: 3, codes: 8 },
  { year: '2023', papers: 15, patents: 4, codes: 10 }
];
