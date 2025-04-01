import './App.css';
import { RouterProvider } from 'react-router-dom';
import router from './router';

import { Provider } from 'react-redux';
import store from './store/store';
import { Helmet } from 'react-helmet';

export default function App() {
  const domain = window.location.origin;

  return (
    <>
      <Helmet>
        <title>이사모음.zip</title>
        <meta
          name="description"
          content="흩어져 있는 이사의 모든 것 | 막막한 이사, 이사모음.zip과 함께 해요!"
        />

        <meta property="og:title" content="이사모음.zip" />
        <meta
          property="og:description"
          content="흩어져 있는 이사의 모든 것 | 막막한 이사, 이사모음.zip과  함께 해요!"
        />
        <meta property="og:image" content={`${domain}/logo.png`} />
        <meta property="og:url" content={domain} />
        <meta property="og:type" content="website" />
      </Helmet>

      <Provider store={store}>
        <RouterProvider router={router}></RouterProvider>
      </Provider>
    </>
  );
}
