"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import type { ModelId } from "@/types/models";
import { markModelFailed } from "@/lib/model-registry";

type ModelErrorBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
  modelId: ModelId;
};

type ModelErrorBoundaryState = {
  hasError: boolean;
};

export class ModelErrorBoundary extends Component<ModelErrorBoundaryProps, ModelErrorBoundaryState> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, _errorInfo: ErrorInfo) {
    markModelFailed(this.props.modelId, error);
  }

  componentDidUpdate(previousProps: ModelErrorBoundaryProps) {
    if (previousProps.modelId !== this.props.modelId && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
