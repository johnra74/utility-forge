import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

interface NavItem {
  path: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { path: '/qr', label: 'QR Generator' },
  { path: '/base64', label: 'Base64' },
  { path: '/markdown', label: 'Markdown' },
  { path: '/json', label: 'JSON' },
  { path: '/uuid', label: 'UUID' },
  { path: '/url', label: 'URL Encoder' },
  { path: '/cron', label: 'Cron Composer' },
  { path: '/milliseconds', label: 'DateTime → Ms' },
];

function AppNavbar(): React.JSX.Element {
  const [expanded, setExpanded] = useState(false);

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      expanded={expanded}
      onToggle={setExpanded}
      sticky="top"
    >
      <Container fluid>
        <Navbar.Brand href="#/" className="fw-bold">
          ⚒ Utility Forge
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto flex-wrap">
            {NAV_ITEMS.map(({ path, label }) => (
              <Nav.Link
                key={path}
                as={NavLink}
                to={path}
                onClick={() => setExpanded(false)}
              >
                {label}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
