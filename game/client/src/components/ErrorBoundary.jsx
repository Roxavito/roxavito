import { Component } from "react";

// A malformed <STATE> block can, in principle, still slip an unexpected
// shape past the server's guardrails into a field a panel doesn't expect.
// Without this, that would blank the entire page (chat included) on a
// single render error, with no way back except an external page refresh.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("UI crashed:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="crash-screen">
          <p>مشکلی در نمایش این بخش از بازی پیش آمد.</p>
          <button type="button" onClick={() => window.location.reload()}>
            بارگذاری دوباره صفحه
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
