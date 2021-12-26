import * as React from 'react';

interface BigButtonProps {
  title?: string;
}

export const BigButton: React.FC<BigButtonProps> = (props) => (
  <div className='Toolbar-big-button'>
    {props.children}
    <div>
      <span className='Toolbar-big-button-label'>{props.title}</span>
    </div>
  </div>
);

