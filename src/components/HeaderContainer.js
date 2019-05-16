import React from 'react';
import ReactDOM from 'react-dom';

export class HeaderContainer extends React.PureComponent {
  render() {
    return (
      <header>
        <nav role="navigation">{this.props.children}</nav>
      </header>
    );
  }
}

export class HeaderPortal extends React.PureComponent {
  render() {
    return ReactDOM.createPortal(this.props.children, global.document.body);
  }
}

export default ({children}) => (
  <HeaderPortal>
    <HeaderContainer>{children}</HeaderContainer>
  </HeaderPortal>
);
