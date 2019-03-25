import React, { Component, Fragment } from 'react';
import qs from 'qs';
import styled from 'styled-components';
import {
  Anchor,
  Box,
  Button,
  Form,
  FormField,
  Grommet,
  Heading,
  Layer,
  Paragraph,
  Text,
} from 'grommet';

const theme = {
  global: {
    font: {
      family: 'Roboto',
      size: '14px',
      height: '20px',
    },
  },
};

const MessageList = styled.ul`
  padding-inline-start: 0;
  -webkit-padding-start: 0;
  list-style-type: none;
`;

const LoginButton = styled(Button)`
  width: 100%;
  max-width: 120px;
`;

class App extends Component {
  state = {
    isLoggedIn: false,
    messages: [],
    postMessageFormErrors: '',
    shouldShowLoginDialog: false,
    username: '',
  };

  async componentDidMount() {
    await this.fetchUsername();
    this.fetchMessages();
  }

  fetchUsername = async () => {
    const response = await fetch('/me');
    if (response.ok) {
      const { username } = await response.json();
      this.setState({ isLoggedIn: true, username });
    }
  };

  fetchMessages = async () => {
    const response = await fetch('/messages');
    const { messages } = await response.json();
    this.setState({ messages });
  };

  showLoginDialog = () => {
    this.setState({ shouldShowLoginDialog: true });
  };

  hideLoginDialog = () => {
    this.setState({ shouldShowLoginDialog: false });
  };

  logIn = async ({ value }) => {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: qs.stringify(value),
    });
    if (response.ok) {
      const { username } = await response.json();
      this.setState({
        isLoggedIn: true,
        shouldShowLoginDialog: false,
        username,
      });
    }
  };

  postMessage = async ({ value }) => {
    const response = await fetch('/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: qs.stringify(value),
    });
    if (response.ok) {
      const { messages } = await response.json();
      this.setState({ messages, postMessageFormErrors: '' });
    } else {
      const { errors } = await response.json();
      this.setState({ postMessageFormErrors: errors });
    }
  };

  renderLoginButton() {
    return (
      <LoginButton
        primary={true}
        label="Log in"
        margin="medium"
        onClick={this.showLoginDialog}
      />
    );
  }

  renderLoginDialog() {
    return (
      <Layer onEsc={this.hideLoginDialog} onClickOutside={this.hideLoginDialog}>
        <Box pad="medium">
          <Heading level="3">Log in</Heading>
          <Form onSubmit={this.logIn}>
            <FormField name="username" label="Username:" />
            <FormField name="password" type="password" label="Password:" />
            <Button type="submit" primary label="Submit" margin="medium" />
          </Form>
        </Box>
      </Layer>
    );
  }

  renderFormFieldBox(name, label, errorMessage) {
    return (
      <Box margin="medium">
        <FormField name={name} label={label} />
        {errorMessage && (
          <Fragment>
            <Text color="status-error">{errorMessage}</Text>
            <br />
          </Fragment>
        )}
      </Box>
    );
  }

  renderPostMessageForm() {
    const errors = this.state.postMessageFormErrors;

    return (
      <Form onSubmit={this.postMessage}>
        {this.renderFormFieldBox('content', 'Content:', errors.content)}
        {this.renderFormFieldBox(
          'personalWebsiteURL',
          'Your personal website URL:',
          errors.personalWebsiteURL
        )}
        <Button type="submit" primary label="Submit" margin="medium" />
      </Form>
    );
  }

  renderMessageList() {
    return (
      <MessageList>
        {this.state.messages.map(
          ({ id, username, content, personalWebsiteURL }) => (
            <li key={id}>
              <Box
                border={{ side: 'top', color: 'brand', size: 'medium' }}
                margin={{ top: 'medium' }}
              >
                <Paragraph size="large" margin={{ bottom: 'small' }}>
                  {content}
                </Paragraph>
                <Text weight="bold">{username}</Text>
                {personalWebsiteURL && (
                  <Anchor href={personalWebsiteURL}>Personal website</Anchor>
                )}
              </Box>
            </li>
          )
        )}
      </MessageList>
    );
  }

  renderPostMessageBox() {
    return (
      <Box
        border={{ color: 'brand', size: 'medium' }}
        round={true}
        pad="medium"
        margin={{ top: 'large' }}
      >
        <Heading level="3" margin={'medium'}>
          Post a message
        </Heading>
        {this.state.isLoggedIn
          ? this.renderPostMessageForm()
          : this.renderLoginButton()}
      </Box>
    );
  }

  render() {
    const { username, shouldShowLoginDialog } = this.state;

    return (
      <Grommet theme={theme} full>
        <Box pad="large">
          <Heading>Message Board</Heading>
          <Heading level="2">Hi, {username}!</Heading>
          {this.renderMessageList()}
          {this.renderPostMessageBox()}
        </Box>
        {shouldShowLoginDialog && this.renderLoginDialog()}
      </Grommet>
    );
  }
}

export default App;
