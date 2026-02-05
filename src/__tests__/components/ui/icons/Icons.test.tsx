/**
 * Tests for Icon components
 */
import { render } from '@testing-library/react';

import { BMBFIcon } from '@/components/ui/icons/BMBF';
import { RUBIcon } from '@/components/ui/icons/RUB';
import { UniDUEIcon } from '@/components/ui/icons/UniDUE';
import { UniKasselIcon } from '@/components/ui/icons/UniKassel';

describe('Icon Components', () => {
  describe('BMBFIcon', () => {
    it('should render SVG element', () => {
      const { container } = render(<BMBFIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<BMBFIcon className='custom-class' />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('custom-class');
    });

    it('should have correct viewBox', () => {
      const { container } = render(<BMBFIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 214.4 84');
    });
  });

  describe('RUBIcon', () => {
    it('should render SVG element', () => {
      const { container } = render(<RUBIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<RUBIcon className='test-class' />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('test-class');
    });

    it('should have correct viewBox', () => {
      const { container } = render(<RUBIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 150 29');
    });
  });

  describe('UniDUEIcon', () => {
    it('should render SVG element', () => {
      const { container } = render(<UniDUEIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<UniDUEIcon className='uni-due' />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('uni-due');
    });

    it('should have correct viewBox', () => {
      const { container } = render(<UniDUEIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 150 60');
    });
  });

  describe('UniKasselIcon', () => {
    it('should render SVG element', () => {
      const { container } = render(<UniKasselIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<UniKasselIcon className='kassel' />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('kassel');
    });

    it('should have correct viewBox', () => {
      const { container } = render(<UniKasselIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 150 31');
    });
  });
});
