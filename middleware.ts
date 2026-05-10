export { default } from 'next-auth/middleware'

export const config = {
  matcher: ['/dashboard/:path*', '/matches/:path*', '/messages/:path*', '/profile/:path*'],
}
