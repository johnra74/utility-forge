import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppNavbar from './components/layout/AppNavbar';
import Home from './components/tools/Home/Home';
import QRGenerator from './components/tools/QRGenerator/QRGenerator';
import Base64Tool from './components/tools/Base64Tool/Base64Tool';
import MarkdownPreviewer from './components/tools/MarkdownPreviewer/MarkdownPreviewer';
import JsonFormatter from './components/tools/JsonFormatter/JsonFormatter';
import UuidGenerator from './components/tools/UuidGenerator/UuidGenerator';
import UrlTool from './components/tools/UrlTool/UrlTool';
import CronGenerator from './components/tools/CronGenerator/CronGenerator';
import MillisecondConverter from './components/tools/MillisecondConverter/MillisecondConverter';

function App(): React.JSX.Element {
  return (
    <>
      <AppNavbar />
      <main className="tool-container">
        <div className="container-fluid px-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/qr" element={<QRGenerator />} />
            <Route path="/base64" element={<Base64Tool />} />
            <Route path="/markdown" element={<MarkdownPreviewer />} />
            <Route path="/json" element={<JsonFormatter />} />
            <Route path="/uuid" element={<UuidGenerator />} />
            <Route path="/url" element={<UrlTool />} />
            <Route path="/cron" element={<CronGenerator />} />
            <Route path="/milliseconds" element={<MillisecondConverter />} />
          </Routes>
        </div>
      </main>
    </>
  );
}

export default App;
