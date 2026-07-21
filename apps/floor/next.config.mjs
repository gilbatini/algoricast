/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@algoricast/canon",
    "@algoricast/ledger",
    "@algoricast/covenant",
    "@algoricast/split",
    "@algoricast/registry",
  ],
};
export default nextConfig;
