import { getRouterManifest } from "@tanstack/start/router-manifest";
/// <reference types="vinxi/types/server" />
import {
	createStartHandler,
	defaultStreamHandler,
} from "@tanstack/start/server";
import { createRouter } from "./router.js";

export default createStartHandler({
	createRouter,
	getRouterManifest,
})(defaultStreamHandler);