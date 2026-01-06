// This layout can be used to wrap the blog pages with a specific structure if needed in the future.
// For now, it just passes the children through, effectively using the main marketing layout.
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
