import * as React from 'react';
import { ButtonGroup, Container } from 'react-bootstrap';

interface BigButtonProps {
  title?: string;
}

export const BigButton: React.FC<BigButtonProps> = (props) => (
  <ButtonGroup size='sm' vertical>
    <div style={{ width: '100%' }}>
      {props.children}
    </div>
    <div style={{ width: '100%' }}>
      <span className='Toolbar-big-button-label'>{props.title}</span>
    </div>
  </ButtonGroup>
);

