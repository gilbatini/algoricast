/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@algoricast/access",
    "@algoricast/canon",
    "@algoricast/ledger",
    "@algoricast/covenant",
    "@algoricast/split",
    "@algoricast/registry",
  ],
};
export default nextConfig;
