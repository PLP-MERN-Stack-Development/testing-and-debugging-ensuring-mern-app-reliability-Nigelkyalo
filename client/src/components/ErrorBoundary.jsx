import { Component } from 'react';
import Button from './Button';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    if (this.props.onError) {
      this.props.onError({ error, info });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="panel" style={{ borderColor: '#fca5a5' }}>
          <h2>Something unexpected happened</h2>
          <p>{this.state.error?.message}</p>
          <Button variant="secondary" onClick={this.handleReset}>
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

