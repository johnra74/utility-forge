import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

export interface InfoItem {
  title: string;
  content: string | React.ReactNode;
}

interface ToolInfoProps {
  items: InfoItem[];
}

function ToolInfo({ items }: ToolInfoProps): React.JSX.Element {
  return (
    <Card className="mt-4 border-0 bg-light">
      <Card.Body>
        <h6 className="text-uppercase text-muted fw-semibold mb-3" style={{ letterSpacing: '0.08em', fontSize: '0.75rem' }}>
          How to use
        </h6>
        <Row xs={1} md={2} lg={items.length <= 2 ? 2 : 3} className="g-3">
          {items.map(({ title, content }) => (
            <Col key={title}>
              <p className="fw-semibold mb-1 small">{title}</p>
              <p className="text-muted mb-0 small" style={{ lineHeight: '1.5' }}>{content}</p>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
}

export default ToolInfo;
