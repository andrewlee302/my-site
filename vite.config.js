import { defineConfig } from "vite";

export default defineConfig({
  // 如果你的 repo 是 https://github.com/you/my-site，Pages 地址是 /my-site/
  // 那这里要写 "/my-site/"；如果是 username.github.io 根域名站点，则写 "/"
  base: "/",
});

