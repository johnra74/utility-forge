import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Col, Row } from 'react-bootstrap';

interface ToolCard {
  path: string;
  label: string;
  description: string;
}

const TOOLS: ToolCard[] = [
  { path: '/qr', label: 'QR Generator', description: 'Turn any URL or text into a scannable QR code. Rendered entirely in SVG — no image is uploaded anywhere.' },
  { path: '/base64', label: 'Base64 Encoder / Decoder', description: 'Encode or decode text, files, images, audio, video, and PDFs. Files are read locally and never leave the tab.' },
  { path: '/markdown', label: 'Markdown Previewer', description: 'Write and preview Markdown with live rendering. Your content stays in the browser.' },
  { path: '/json', label: 'JSON Formatter', description: 'Format, validate, and minify JSON. Useful for sanitising API payloads before sharing without leaking raw data.' },
  { path: '/uuid', label: 'UUID Generator', description: 'Generate RFC-compliant v1 and v4 UUIDs using the browser\'s built-in crypto API. No server randomness source.' },
  { path: '/url', label: 'URL Encoder / Decoder', description: 'Encode or decode URL components and query strings. Safe for URLs containing tokens or sensitive parameters.' },
  { path: '/cron', label: 'Cron Composer', description: 'Build and validate cron expressions with a plain-English preview. No scheduler credentials required.' },
  { path: '/milliseconds', label: 'DateTime ↔ Ms Converter', description: 'Convert between human-readable datetimes and epoch milliseconds. Useful for reading log timestamps without copying them to an external tool.' },
];

const BENEFITS = [
  {
    icon: '🔒',
    title: 'Nothing leaves your network',
    body: 'Every tool runs entirely inside your browser tab. No API calls are made, no data is posted to a server, and no telemetry is collected. What you type stays on your machine.',
  },
  {
    icon: '🏢',
    title: 'Enterprise and DLP safe',
    body: 'Data Loss Prevention policies flag uploads to unknown services. Because Utility Forge makes zero external requests, it generates no DLP alerts and requires no firewall exceptions.',
  },
  {
    icon: '📴',
    title: 'Works offline',
    body: 'Once the page is loaded the tools function without any internet connection. Suitable for air-gapped workstations, restricted VPN environments, and secure build machines.',
  },
  {
    icon: '🔍',
    title: 'Fully auditable',
    body: 'This is a static site with no backend. You can inspect every line of code in your browser\'s developer tools or review the source repository to verify the privacy guarantees.',
  },
];

function Home(): React.JSX.Element {
  return (
    <div>
      {/* Hero */}
      <div className="py-5 mb-5 border-bottom">
        <h1 className="display-5 fw-bold mb-3">Developer tools that stay in your browser</h1>
        <p className="lead text-muted mb-4" style={{ maxWidth: 680 }}>
          Utility Forge is a collection of everyday developer utilities built as a purely static site.
          There is no backend, no database, and no network requests.
          Every operation — encoding, formatting, generating, converting — happens locally in your browser tab.
        </p>
        <p className="text-muted mb-0" style={{ maxWidth: 680 }}>
          In security-sensitive or regulated environments, the standard concern with online tools is data egress:
          paste a secret, a token, or a customer record into a third-party website and you have no guarantee
          where it ends up. Utility Forge eliminates that risk by design. There is simply no server to send data to.
        </p>
      </div>

      {/* Why section */}
      <h2 className="h4 fw-semibold mb-4">Why it matters</h2>
      <Row xs={1} md={2} className="g-4 mb-5">
        {BENEFITS.map(({ icon, title, body }) => (
          <Col key={title}>
            <Card className="h-100 border-0 bg-light">
              <Card.Body>
                <div className="fs-3 mb-2">{icon}</div>
                <Card.Title className="h6 fw-bold">{title}</Card.Title>
                <Card.Text className="text-muted small">{body}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Tools section */}
      <h2 className="h4 fw-semibold mb-4">Available tools</h2>
      <Row xs={1} md={2} lg={3} className="g-3">
        {TOOLS.map(({ path, label, description }) => (
          <Col key={path}>
            <Card as={Link} to={path} className="h-100 text-decoration-none text-reset tool-home-card">
              <Card.Body>
                <Card.Title className="h6 fw-semibold mb-1">{label}</Card.Title>
                <Card.Text className="text-muted small mb-0">{description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Home;
