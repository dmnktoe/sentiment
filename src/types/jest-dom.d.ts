// Extends Jest's expect matchers with @testing-library/jest-dom
// Required for TypeScript to recognize matchers like toBeInTheDocument,
// toHaveClass, toHaveAttribute, etc. after upgrading to jest-dom v6.
import '@testing-library/jest-dom';
