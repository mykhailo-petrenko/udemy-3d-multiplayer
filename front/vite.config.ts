import type { UserConfig } from 'vite'

export default {
  server: {
    proxy: {
      // '/socket.io': {
      //   target: 'http://localhost:3000',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/socket.io/, ''),
      // },
      // Proxying websockets or socket.io: ws://localhost:5173/socket.io -> ws://localhost:5174/socket.io
      // Exercise caution using `rewriteWsOrigin` as it can leave the proxying open to CSRF attacks.
      '/socket.io': {
        target: 'ws://localhost:3000',
        ws: true,
        rewriteWsOrigin: true,
      },
    },
  },
} satisfies UserConfig;
