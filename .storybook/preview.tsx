import type { Preview } from '@storybook/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { getTheme } from '@/common/theme/theme.ts';
import { createStoryStore } from '@/storybook/storyStore.ts';
import '../src/index.css';

const viewportOptions = {
  mobile320x568: {
    name: 'iPhone SE 320x568',
    styles: { width: '320px', height: '568px' },
    type: 'mobile',
  },
  mobile375x812: {
    name: 'iPhone X 375x812',
    styles: { width: '375px', height: '812px' },
    type: 'mobile',
  },
  mobile390x844: {
    name: 'iPhone 12/13/14 390x844',
    styles: { width: '390px', height: '844px' },
    type: 'mobile',
  },
  mobile414x896: {
    name: 'iPhone Plus/Max 414x896',
    styles: { width: '414px', height: '896px' },
    type: 'mobile',
  },
  tablet768x1024: {
    name: 'iPad 768x1024',
    styles: { width: '768px', height: '1024px' },
    type: 'tablet',
  },
  tablet1024x768: {
    name: 'iPad landscape 1024x768',
    styles: { width: '1024px', height: '768px' },
    type: 'tablet',
  },
  desktop1280x720: {
    name: 'Laptop small 1280x720',
    styles: { width: '1280px', height: '720px' },
    type: 'desktop',
  },
  desktop1440x900: {
    name: 'Laptop 1440x900',
    styles: { width: '1440px', height: '900px' },
    type: 'desktop',
  },
  desktop1920x1080: {
    name: 'Full HD 1920x1080',
    styles: { width: '1920px', height: '1080px' },
    type: 'desktop',
  },
  qhd2560x1440: {
    name: 'QHD 2560x1440',
    styles: { width: '2560px', height: '1440px' },
    type: 'desktop',
  },
  uwqhd3440x1440: {
    name: 'UltraWide QHD 3440x1440',
    styles: { width: '3440px', height: '1440px' },
    type: 'desktop',
  },
  uhd3840x2160: {
    name: 'UHD 4K 3840x2160',
    styles: { width: '3840px', height: '2160px' },
    type: 'desktop',
  },
  uw5k2k5120x2160: {
    name: 'UltraWide 5K2K 5120x2160',
    styles: { width: '5120px', height: '2160px' },
    type: 'desktop',
  },
};

const preview: Preview = {
  parameters: {
    layout: 'padded',
    viewport: {
      options: viewportOptions,
      defaultViewport: 'mobile390x844',
    },
    controls: {
      expanded: true,
    },
  },
  decorators: [
    Story => {
      const store = createStoryStore();
      return (
        <MemoryRouter>
          <Provider store={store}>
            <ThemeProvider theme={getTheme('light')}>
              <CssBaseline />
              <div
                style={{
                  minHeight: '100vh',
                  background: 'var(--bg)',
                  padding: 'var(--space4)',
                }}
              >
                <Story />
              </div>
            </ThemeProvider>
          </Provider>
        </MemoryRouter>
      );
    },
  ],
};

export default preview;
