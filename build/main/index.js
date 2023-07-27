import { createRequire as __WEBPACK_EXTERNAL_createRequire } from "module";
/******/ var __webpack_modules__ = ({

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(2037));
const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(7351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(5278);
const os = __importStar(__nccwpck_require__(2037));
const path = __importStar(__nccwpck_require__(1017));
const oidc_utils_1 = __nccwpck_require__(8041);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('ENV', file_command_1.prepareKeyValueMessage(name, val));
    }
    command_1.issueCommand('set-env', { name }, convertedVal);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueFileCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    if (options && options.trimWhitespace === false) {
        return inputs;
    }
    return inputs.map(input => input.trim());
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    const filePath = process.env['GITHUB_OUTPUT'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('OUTPUT', file_command_1.prepareKeyValueMessage(name, value));
    }
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, utils_1.toCommandValue(value));
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    const filePath = process.env['GITHUB_STATE'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('STATE', file_command_1.prepareKeyValueMessage(name, value));
    }
    command_1.issueCommand('save-state', { name }, utils_1.toCommandValue(value));
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
/**
 * Summary exports
 */
var summary_1 = __nccwpck_require__(1327);
Object.defineProperty(exports, "summary", ({ enumerable: true, get: function () { return summary_1.summary; } }));
/**
 * @deprecated use core.summary
 */
var summary_2 = __nccwpck_require__(1327);
Object.defineProperty(exports, "markdownSummary", ({ enumerable: true, get: function () { return summary_2.markdownSummary; } }));
/**
 * Path exports
 */
var path_utils_1 = __nccwpck_require__(2981);
Object.defineProperty(exports, "toPosixPath", ({ enumerable: true, get: function () { return path_utils_1.toPosixPath; } }));
Object.defineProperty(exports, "toWin32Path", ({ enumerable: true, get: function () { return path_utils_1.toWin32Path; } }));
Object.defineProperty(exports, "toPlatformPath", ({ enumerable: true, get: function () { return path_utils_1.toPlatformPath; } }));
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prepareKeyValueMessage = exports.issueFileCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(7147));
const os = __importStar(__nccwpck_require__(2037));
const uuid_1 = __nccwpck_require__(5840);
const utils_1 = __nccwpck_require__(5278);
function issueFileCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueFileCommand = issueFileCommand;
function prepareKeyValueMessage(key, value) {
    const delimiter = `ghadelimiter_${uuid_1.v4()}`;
    const convertedValue = utils_1.toCommandValue(value);
    // These should realistically never happen, but just in case someone finds a
    // way to exploit uuid generation let's not allow keys or values that contain
    // the delimiter.
    if (key.includes(delimiter)) {
        throw new Error(`Unexpected input: name should not contain the delimiter "${delimiter}"`);
    }
    if (convertedValue.includes(delimiter)) {
        throw new Error(`Unexpected input: value should not contain the delimiter "${delimiter}"`);
    }
    return `${key}<<${delimiter}${os.EOL}${convertedValue}${os.EOL}${delimiter}`;
}
exports.prepareKeyValueMessage = prepareKeyValueMessage;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 8041:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClient = void 0;
const http_client_1 = __nccwpck_require__(6255);
const auth_1 = __nccwpck_require__(5526);
const core_1 = __nccwpck_require__(2186);
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.result.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),

/***/ 2981:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toPlatformPath = exports.toWin32Path = exports.toPosixPath = void 0;
const path = __importStar(__nccwpck_require__(1017));
/**
 * toPosixPath converts the given path to the posix form. On Windows, \\ will be
 * replaced with /.
 *
 * @param pth. Path to transform.
 * @return string Posix path.
 */
function toPosixPath(pth) {
    return pth.replace(/[\\]/g, '/');
}
exports.toPosixPath = toPosixPath;
/**
 * toWin32Path converts the given path to the win32 form. On Linux, / will be
 * replaced with \\.
 *
 * @param pth. Path to transform.
 * @return string Win32 path.
 */
function toWin32Path(pth) {
    return pth.replace(/[/]/g, '\\');
}
exports.toWin32Path = toWin32Path;
/**
 * toPlatformPath converts the given path to a platform-specific path. It does
 * this by replacing instances of / and \ with the platform-specific path
 * separator.
 *
 * @param pth The path to platformize.
 * @return string The platform-specific path.
 */
function toPlatformPath(pth) {
    return pth.replace(/[/\\]/g, path.sep);
}
exports.toPlatformPath = toPlatformPath;
//# sourceMappingURL=path-utils.js.map

/***/ }),

/***/ 1327:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.summary = exports.markdownSummary = exports.SUMMARY_DOCS_URL = exports.SUMMARY_ENV_VAR = void 0;
const os_1 = __nccwpck_require__(2037);
const fs_1 = __nccwpck_require__(7147);
const { access, appendFile, writeFile } = fs_1.promises;
exports.SUMMARY_ENV_VAR = 'GITHUB_STEP_SUMMARY';
exports.SUMMARY_DOCS_URL = 'https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary';
class Summary {
    constructor() {
        this._buffer = '';
    }
    /**
     * Finds the summary file path from the environment, rejects if env var is not found or file does not exist
     * Also checks r/w permissions.
     *
     * @returns step summary file path
     */
    filePath() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._filePath) {
                return this._filePath;
            }
            const pathFromEnv = process.env[exports.SUMMARY_ENV_VAR];
            if (!pathFromEnv) {
                throw new Error(`Unable to find environment variable for $${exports.SUMMARY_ENV_VAR}. Check if your runtime environment supports job summaries.`);
            }
            try {
                yield access(pathFromEnv, fs_1.constants.R_OK | fs_1.constants.W_OK);
            }
            catch (_a) {
                throw new Error(`Unable to access summary file: '${pathFromEnv}'. Check if the file has correct read/write permissions.`);
            }
            this._filePath = pathFromEnv;
            return this._filePath;
        });
    }
    /**
     * Wraps content in an HTML tag, adding any HTML attributes
     *
     * @param {string} tag HTML tag to wrap
     * @param {string | null} content content within the tag
     * @param {[attribute: string]: string} attrs key-value list of HTML attributes to add
     *
     * @returns {string} content wrapped in HTML element
     */
    wrap(tag, content, attrs = {}) {
        const htmlAttrs = Object.entries(attrs)
            .map(([key, value]) => ` ${key}="${value}"`)
            .join('');
        if (!content) {
            return `<${tag}${htmlAttrs}>`;
        }
        return `<${tag}${htmlAttrs}>${content}</${tag}>`;
    }
    /**
     * Writes text in the buffer to the summary buffer file and empties buffer. Will append by default.
     *
     * @param {SummaryWriteOptions} [options] (optional) options for write operation
     *
     * @returns {Promise<Summary>} summary instance
     */
    write(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const overwrite = !!(options === null || options === void 0 ? void 0 : options.overwrite);
            const filePath = yield this.filePath();
            const writeFunc = overwrite ? writeFile : appendFile;
            yield writeFunc(filePath, this._buffer, { encoding: 'utf8' });
            return this.emptyBuffer();
        });
    }
    /**
     * Clears the summary buffer and wipes the summary file
     *
     * @returns {Summary} summary instance
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.emptyBuffer().write({ overwrite: true });
        });
    }
    /**
     * Returns the current summary buffer as a string
     *
     * @returns {string} string of summary buffer
     */
    stringify() {
        return this._buffer;
    }
    /**
     * If the summary buffer is empty
     *
     * @returns {boolen} true if the buffer is empty
     */
    isEmptyBuffer() {
        return this._buffer.length === 0;
    }
    /**
     * Resets the summary buffer without writing to summary file
     *
     * @returns {Summary} summary instance
     */
    emptyBuffer() {
        this._buffer = '';
        return this;
    }
    /**
     * Adds raw text to the summary buffer
     *
     * @param {string} text content to add
     * @param {boolean} [addEOL=false] (optional) append an EOL to the raw text (default: false)
     *
     * @returns {Summary} summary instance
     */
    addRaw(text, addEOL = false) {
        this._buffer += text;
        return addEOL ? this.addEOL() : this;
    }
    /**
     * Adds the operating system-specific end-of-line marker to the buffer
     *
     * @returns {Summary} summary instance
     */
    addEOL() {
        return this.addRaw(os_1.EOL);
    }
    /**
     * Adds an HTML codeblock to the summary buffer
     *
     * @param {string} code content to render within fenced code block
     * @param {string} lang (optional) language to syntax highlight code
     *
     * @returns {Summary} summary instance
     */
    addCodeBlock(code, lang) {
        const attrs = Object.assign({}, (lang && { lang }));
        const element = this.wrap('pre', this.wrap('code', code), attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML list to the summary buffer
     *
     * @param {string[]} items list of items to render
     * @param {boolean} [ordered=false] (optional) if the rendered list should be ordered or not (default: false)
     *
     * @returns {Summary} summary instance
     */
    addList(items, ordered = false) {
        const tag = ordered ? 'ol' : 'ul';
        const listItems = items.map(item => this.wrap('li', item)).join('');
        const element = this.wrap(tag, listItems);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML table to the summary buffer
     *
     * @param {SummaryTableCell[]} rows table rows
     *
     * @returns {Summary} summary instance
     */
    addTable(rows) {
        const tableBody = rows
            .map(row => {
            const cells = row
                .map(cell => {
                if (typeof cell === 'string') {
                    return this.wrap('td', cell);
                }
                const { header, data, colspan, rowspan } = cell;
                const tag = header ? 'th' : 'td';
                const attrs = Object.assign(Object.assign({}, (colspan && { colspan })), (rowspan && { rowspan }));
                return this.wrap(tag, data, attrs);
            })
                .join('');
            return this.wrap('tr', cells);
        })
            .join('');
        const element = this.wrap('table', tableBody);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds a collapsable HTML details element to the summary buffer
     *
     * @param {string} label text for the closed state
     * @param {string} content collapsable content
     *
     * @returns {Summary} summary instance
     */
    addDetails(label, content) {
        const element = this.wrap('details', this.wrap('summary', label) + content);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML image tag to the summary buffer
     *
     * @param {string} src path to the image you to embed
     * @param {string} alt text description of the image
     * @param {SummaryImageOptions} options (optional) addition image attributes
     *
     * @returns {Summary} summary instance
     */
    addImage(src, alt, options) {
        const { width, height } = options || {};
        const attrs = Object.assign(Object.assign({}, (width && { width })), (height && { height }));
        const element = this.wrap('img', null, Object.assign({ src, alt }, attrs));
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML section heading element
     *
     * @param {string} text heading text
     * @param {number | string} [level=1] (optional) the heading level, default: 1
     *
     * @returns {Summary} summary instance
     */
    addHeading(text, level) {
        const tag = `h${level}`;
        const allowedTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)
            ? tag
            : 'h1';
        const element = this.wrap(allowedTag, text);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML thematic break (<hr>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addSeparator() {
        const element = this.wrap('hr', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML line break (<br>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addBreak() {
        const element = this.wrap('br', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML blockquote to the summary buffer
     *
     * @param {string} text quote text
     * @param {string} cite (optional) citation url
     *
     * @returns {Summary} summary instance
     */
    addQuote(text, cite) {
        const attrs = Object.assign({}, (cite && { cite }));
        const element = this.wrap('blockquote', text, attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML anchor tag to the summary buffer
     *
     * @param {string} text link text/content
     * @param {string} href hyperlink
     *
     * @returns {Summary} summary instance
     */
    addLink(text, href) {
        const element = this.wrap('a', text, { href });
        return this.addRaw(element).addEOL();
    }
}
const _summary = new Summary();
/**
 * @deprecated use `core.summary`
 */
exports.markdownSummary = _summary;
exports.summary = _summary;
//# sourceMappingURL=summary.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {


// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 5526:
/***/ (function(__unused_webpack_module, exports) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PersonalAccessTokenCredentialHandler = exports.BearerCredentialHandler = exports.BasicCredentialHandler = void 0;
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Bearer ${this.token}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`PAT:${this.token}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;
//# sourceMappingURL=auth.js.map

/***/ }),

/***/ 6255:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


/* eslint-disable @typescript-eslint/no-explicit-any */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpClient = exports.isHttps = exports.HttpClientResponse = exports.HttpClientError = exports.getProxyUrl = exports.MediaTypes = exports.Headers = exports.HttpCodes = void 0;
const http = __importStar(__nccwpck_require__(3685));
const https = __importStar(__nccwpck_require__(5687));
const pm = __importStar(__nccwpck_require__(9835));
const tunnel = __importStar(__nccwpck_require__(4294));
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    const proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                let output = Buffer.alloc(0);
                this.message.on('data', (chunk) => {
                    output = Buffer.concat([output, chunk]);
                });
                this.message.on('end', () => {
                    resolve(output.toString());
                });
            }));
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    const parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
        });
    }
    get(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('GET', requestUrl, null, additionalHeaders || {});
        });
    }
    del(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('DELETE', requestUrl, null, additionalHeaders || {});
        });
    }
    post(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('POST', requestUrl, data, additionalHeaders || {});
        });
    }
    patch(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PATCH', requestUrl, data, additionalHeaders || {});
        });
    }
    put(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PUT', requestUrl, data, additionalHeaders || {});
        });
    }
    head(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('HEAD', requestUrl, null, additionalHeaders || {});
        });
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(verb, requestUrl, stream, additionalHeaders);
        });
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    getJson(requestUrl, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            const res = yield this.get(requestUrl, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    postJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.post(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    putJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.put(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    patchJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.patch(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    request(verb, requestUrl, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._disposed) {
                throw new Error('Client has already been disposed.');
            }
            const parsedUrl = new URL(requestUrl);
            let info = this._prepareRequest(verb, parsedUrl, headers);
            // Only perform retries on reads since writes may not be idempotent.
            const maxTries = this._allowRetries && RetryableHttpVerbs.includes(verb)
                ? this._maxRetries + 1
                : 1;
            let numTries = 0;
            let response;
            do {
                response = yield this.requestRaw(info, data);
                // Check if it's an authentication challenge
                if (response &&
                    response.message &&
                    response.message.statusCode === HttpCodes.Unauthorized) {
                    let authenticationHandler;
                    for (const handler of this.handlers) {
                        if (handler.canHandleAuthentication(response)) {
                            authenticationHandler = handler;
                            break;
                        }
                    }
                    if (authenticationHandler) {
                        return authenticationHandler.handleAuthentication(this, info, data);
                    }
                    else {
                        // We have received an unauthorized response but have no handlers to handle it.
                        // Let the response return to the caller.
                        return response;
                    }
                }
                let redirectsRemaining = this._maxRedirects;
                while (response.message.statusCode &&
                    HttpRedirectCodes.includes(response.message.statusCode) &&
                    this._allowRedirects &&
                    redirectsRemaining > 0) {
                    const redirectUrl = response.message.headers['location'];
                    if (!redirectUrl) {
                        // if there's no location to redirect to, we won't
                        break;
                    }
                    const parsedRedirectUrl = new URL(redirectUrl);
                    if (parsedUrl.protocol === 'https:' &&
                        parsedUrl.protocol !== parsedRedirectUrl.protocol &&
                        !this._allowRedirectDowngrade) {
                        throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                    }
                    // we need to finish reading the response before reassigning response
                    // which will leak the open socket.
                    yield response.readBody();
                    // strip authorization header if redirected to a different hostname
                    if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                        for (const header in headers) {
                            // header names are case insensitive
                            if (header.toLowerCase() === 'authorization') {
                                delete headers[header];
                            }
                        }
                    }
                    // let's make the request with the new redirectUrl
                    info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                    response = yield this.requestRaw(info, data);
                    redirectsRemaining--;
                }
                if (!response.message.statusCode ||
                    !HttpResponseRetryCodes.includes(response.message.statusCode)) {
                    // If not a retry code, return immediately instead of retrying
                    return response;
                }
                numTries += 1;
                if (numTries < maxTries) {
                    yield response.readBody();
                    yield this._performExponentialBackoff(numTries);
                }
            } while (numTries < maxTries);
            return response;
        });
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                function callbackForResult(err, res) {
                    if (err) {
                        reject(err);
                    }
                    else if (!res) {
                        // If `err` is not passed, then `res` must be passed.
                        reject(new Error('Unknown error'));
                    }
                    else {
                        resolve(res);
                    }
                }
                this.requestRawWithCallback(info, data, callbackForResult);
            });
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        if (typeof data === 'string') {
            if (!info.options.headers) {
                info.options.headers = {};
            }
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        function handleResult(err, res) {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        }
        const req = info.httpModule.request(info.options, (msg) => {
            const res = new HttpClientResponse(msg);
            handleResult(undefined, res);
        });
        let socket;
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error(`Request timeout: ${info.options.path}`));
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        const parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            for (const handler of this.handlers) {
                handler.prepareRequest(info.options);
            }
        }
        return info;
    }
    _mergeHeaders(headers) {
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers || {}));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        const proxyUrl = pm.getProxyUrl(parsedUrl);
        const useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        // This is `useProxy` again, but we need to check `proxyURl` directly for TypeScripts's flow analysis.
        if (proxyUrl && proxyUrl.hostname) {
            const agentOptions = {
                maxSockets,
                keepAlive: this._keepAlive,
                proxy: Object.assign(Object.assign({}, ((proxyUrl.username || proxyUrl.password) && {
                    proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                })), { host: proxyUrl.hostname, port: proxyUrl.port })
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
            const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
            return new Promise(resolve => setTimeout(() => resolve(), ms));
        });
    }
    _processResponse(res, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const statusCode = res.message.statusCode || 0;
                const response = {
                    statusCode,
                    result: null,
                    headers: {}
                };
                // not found leads to null obj returned
                if (statusCode === HttpCodes.NotFound) {
                    resolve(response);
                }
                // get the result from the body
                function dateTimeDeserializer(key, value) {
                    if (typeof value === 'string') {
                        const a = new Date(value);
                        if (!isNaN(a.valueOf())) {
                            return a;
                        }
                    }
                    return value;
                }
                let obj;
                let contents;
                try {
                    contents = yield res.readBody();
                    if (contents && contents.length > 0) {
                        if (options && options.deserializeDates) {
                            obj = JSON.parse(contents, dateTimeDeserializer);
                        }
                        else {
                            obj = JSON.parse(contents);
                        }
                        response.result = obj;
                    }
                    response.headers = res.message.headers;
                }
                catch (err) {
                    // Invalid resource (contents not json);  leaving result obj null
                }
                // note that 3xx redirects are handled by the http layer.
                if (statusCode > 299) {
                    let msg;
                    // if exception/error in body, attempt to get better error
                    if (obj && obj.message) {
                        msg = obj.message;
                    }
                    else if (contents && contents.length > 0) {
                        // it may be the case that the exception is in the body message as string
                        msg = contents;
                    }
                    else {
                        msg = `Failed request: (${statusCode})`;
                    }
                    const err = new HttpClientError(msg, statusCode);
                    err.result = response.result;
                    reject(err);
                }
                else {
                    resolve(response);
                }
            }));
        });
    }
}
exports.HttpClient = HttpClient;
const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9835:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkBypass = exports.getProxyUrl = void 0;
function getProxyUrl(reqUrl) {
    const usingSsl = reqUrl.protocol === 'https:';
    if (checkBypass(reqUrl)) {
        return undefined;
    }
    const proxyVar = (() => {
        if (usingSsl) {
            return process.env['https_proxy'] || process.env['HTTPS_PROXY'];
        }
        else {
            return process.env['http_proxy'] || process.env['HTTP_PROXY'];
        }
    })();
    if (proxyVar) {
        return new URL(proxyVar);
    }
    else {
        return undefined;
    }
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    const reqHost = reqUrl.hostname;
    if (isLoopbackAddress(reqHost)) {
        return true;
    }
    const noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    const upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (const upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperNoProxyItem === '*' ||
            upperReqHosts.some(x => x === upperNoProxyItem ||
                x.endsWith(`.${upperNoProxyItem}`) ||
                (upperNoProxyItem.startsWith('.') &&
                    x.endsWith(`${upperNoProxyItem}`)))) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;
function isLoopbackAddress(host) {
    const hostLower = host.toLowerCase();
    return (hostLower === 'localhost' ||
        hostLower.startsWith('127.') ||
        hostLower.startsWith('[::1]') ||
        hostLower.startsWith('[0:0:0:0:0:0:0:1]'));
}
//# sourceMappingURL=proxy.js.map

/***/ }),

/***/ 9964:
/***/ ((module, exports, __nccwpck_require__) => {

/* module decorator */ module = __nccwpck_require__.nmd(module);
const { TraceMap, originalPositionFor, AnyMap } = __nccwpck_require__(4817);
var path = __nccwpck_require__(1017);
const { fileURLToPath, pathToFileURL } = __nccwpck_require__(7310);
var util = __nccwpck_require__(3837);

var fs;
try {
  fs = __nccwpck_require__(7147);
  if (!fs.existsSync || !fs.readFileSync) {
    // fs doesn't have all methods we need
    fs = null;
  }
} catch (err) {
  /* nop */
}

/**
 * Requires a module which is protected against bundler minification.
 *
 * @param {NodeModule} mod
 * @param {string} request
 */
function dynamicRequire(mod, request) {
  return mod.require(request);
}

/**
 * @typedef {{
 *   enabled: boolean;
 *   originalValue: any;
 *   installedValue: any;
 * }} HookState
 * Used for installing and uninstalling hooks
 */

// Increment this if the format of sharedData changes in a breaking way.
var sharedDataVersion = 1;

/**
 * @template T
 * @param {T} defaults
 * @returns {T}
 */
function initializeSharedData(defaults) {
  var sharedDataKey = 'source-map-support/sharedData';
  if (typeof Symbol !== 'undefined') {
    sharedDataKey = Symbol.for(sharedDataKey);
  }
  var sharedData = this[sharedDataKey];
  if (!sharedData) {
    sharedData = { version: sharedDataVersion };
    if (Object.defineProperty) {
      Object.defineProperty(this, sharedDataKey, { value: sharedData });
    } else {
      this[sharedDataKey] = sharedData;
    }
  }
  if (sharedDataVersion !== sharedData.version) {
    throw new Error("Multiple incompatible instances of source-map-support were loaded");
  }
  for (var key in defaults) {
    if (!(key in sharedData)) {
      sharedData[key] = defaults[key];
    }
  }
  return sharedData;
}

// If multiple instances of source-map-support are loaded into the same
// context, they shouldn't overwrite each other.  By storing handlers, caches,
// and other state on a shared object, different instances of
// source-map-support can work together in a limited way. This does require
// that future versions of source-map-support continue to support the fields on
// this object. If this internal contract ever needs to be broken, increment
// sharedDataVersion. (This version number is not the same as any of the
// package's version numbers, which should reflect the *external* API of
// source-map-support.)
var sharedData = initializeSharedData({

  // Only install once if called multiple times
  // Remember how the environment looked before installation so we can restore if able
  /** @type {HookState} */
  errorPrepareStackTraceHook: undefined,
  /** @type {HookState} */
  processEmitHook: undefined,
  /** @type {HookState} */
  moduleResolveFilenameHook: undefined,

  /** @type {Array<(request: string, parent: any, isMain: boolean, options: any, redirectedRequest: string) => void>} */
  onConflictingLibraryRedirectArr: [],

  // If true, the caches are reset before a stack trace formatting operation
  emptyCacheBetweenOperations: false,

  // Maps a file path to a string containing the file contents
  fileContentsCache: Object.create(null),

  // Maps a file path to a source map for that file
  /** @type {Record<string, {url: string, map: TraceMap}} */
  sourceMapCache: Object.create(null),

  // Priority list of retrieve handlers
  retrieveFileHandlers: [],
  retrieveMapHandlers: [],

  // Priority list of internally-implemented handlers.
  // When resetting state, we must keep these.
  internalRetrieveFileHandlers: [],
  internalRetrieveMapHandlers: [],

});

// Supports {browser, node, auto}
var environment = "auto";

// Regex for detecting source maps
var reSourceMap = /^data:application\/json[^,]+base64,/;

function isInBrowser() {
  if (environment === "browser")
    return true;
  if (environment === "node")
    return false;
  return ((typeof window !== 'undefined') && (typeof XMLHttpRequest === 'function') && !(window.require && window.module && window.process && window.process.type === "renderer"));
}

function hasGlobalProcessEventEmitter() {
  return ((typeof process === 'object') && (process !== null) && (typeof process.on === 'function'));
}

function tryFileURLToPath(v) {
  if(isFileUrl(v)) {
    return fileURLToPath(v);
  }
  return v;
}

// TODO un-copy these from resolve-uri; see if they can be exported from that lib
function isFileUrl(input) {
  return input.startsWith('file:');
}
function isAbsoluteUrl(input) {
  return schemeRegex.test(input);
}
// Matches the scheme of a URL, eg "http://"
const schemeRegex = /^[\w+.-]+:\/\//;
function isSchemeRelativeUrl(input) {
  return input.startsWith('//');
}

// #region Caches
/** @param {string} pathOrFileUrl */
function getCacheKey(pathOrFileUrl) {
  if(pathOrFileUrl.startsWith('node:')) return pathOrFileUrl;
  if(isFileUrl(pathOrFileUrl)) {
    // Must normalize spaces to %20, stuff like that
    return new URL(pathOrFileUrl).toString();
  } else {
    try {
      return pathToFileURL(pathOrFileUrl).toString();
    } catch {
      return pathOrFileUrl;
    }
  }
}
function getFileContentsCache(key) {
  return sharedData.fileContentsCache[getCacheKey(key)];
}
function hasFileContentsCacheFromKey(key) {
  return Object.prototype.hasOwnProperty.call(sharedData.fileContentsCache, key);
}
function getFileContentsCacheFromKey(key) {
  return sharedData.fileContentsCache[key];
}
function setFileContentsCache(key, value) {
  return sharedData.fileContentsCache[getCacheKey(key)] = value;
}
function getSourceMapCache(key) {
  return sharedData.sourceMapCache[getCacheKey(key)];
}
function setSourceMapCache(key, value) {
  return sharedData.sourceMapCache[getCacheKey(key)] = value;
}
function clearCaches() {
  sharedData.fileContentsCache = Object.create(null);
  sharedData.sourceMapCache = Object.create(null);
}
// #endregion Caches

function handlerExec(list, internalList) {
  return function(arg) {
    for (var i = 0; i < list.length; i++) {
      var ret = list[i](arg);
      if (ret) {
        return ret;
      }
    }
    for (var i = 0; i < internalList.length; i++) {
      var ret = internalList[i](arg);
      if (ret) {
        return ret;
      }
    }
    return null;
  };
}

var retrieveFile = handlerExec(sharedData.retrieveFileHandlers, sharedData.internalRetrieveFileHandlers);

sharedData.internalRetrieveFileHandlers.push(function(path) {
  // Trim the path to make sure there is no extra whitespace.
  path = path.trim();
  if (/^file:/.test(path)) {
    // existsSync/readFileSync can't handle file protocol, but once stripped, it works
    path = path.replace(/file:\/\/\/(\w:)?/, function(protocol, drive) {
      return drive ?
        '' : // file:///C:/dir/file -> C:/dir/file
        '/'; // file:///root-dir/file -> /root-dir/file
    });
  }
  const key = getCacheKey(path);
  if(hasFileContentsCacheFromKey(key)) {
    return getFileContentsCacheFromKey(key);
  }

  var contents = '';
  try {
    if (!fs) {
      // Use SJAX if we are in the browser
      var xhr = new XMLHttpRequest();
      xhr.open('GET', path, /** async */ false);
      xhr.send(null);
      if (xhr.readyState === 4 && xhr.status === 200) {
        contents = xhr.responseText;
      }
    } else if (fs.existsSync(path)) {
      // Otherwise, use the filesystem
      contents = fs.readFileSync(path, 'utf8');
    }
  } catch (er) {
    /* ignore any errors */
  }

  return setFileContentsCache(path, contents);
});

// Support URLs relative to a directory, but be careful about a protocol prefix
// in case we are in the browser (i.e. directories may start with "http://" or "file:///")
function supportRelativeURL(file, url) {
  if(!file) return url;
  // given that this happens within error formatting codepath, probably best to
  // fallback instead of throwing if anything goes wrong
  try {
    // if should output a URL
    if(isAbsoluteUrl(file) || isSchemeRelativeUrl(file)) {
        if(isAbsoluteUrl(url) || isSchemeRelativeUrl(url)) {
            return new URL(url, file).toString();
        }
        if(path.isAbsolute(url)) {
            return new URL(pathToFileURL(url), file).toString();
        }
        // url is relative path or URL
        return new URL(url.replace(/\\/g, '/'), file).toString();
    }
    // if should output a path (unless URL is something like https://)
    if(path.isAbsolute(file)) {
        if(isFileUrl(url)) {
            return fileURLToPath(url);
        }
        if(isSchemeRelativeUrl(url)) {
            return fileURLToPath(new URL(url, 'file://'));
        }
        if(isAbsoluteUrl(url)) {
            // url is a non-file URL
            // Go with the URL
            return url;
        }
        if(path.isAbsolute(url)) {
            // Normalize at all?  decodeURI or normalize slashes?
            return path.normalize(url);
        }
        // url is relative path or URL
        return path.join(file, '..', decodeURI(url));
    }
    // If we get here, file is relative.
    // Shouldn't happen since node identifies modules with absolute paths or URLs.
    // But we can take a stab at returning something meaningful anyway.
    if(isAbsoluteUrl(url) || isSchemeRelativeUrl(url)) {
        return url;
    }
    return path.join(file, '..', url);
  } catch(e) {
      return url;
  }
}

// Return pathOrUrl in the same style as matchStyleOf: either a file URL or a native path
function matchStyleOfPathOrUrl(matchStyleOf, pathOrUrl) {
  try {
    if(isAbsoluteUrl(matchStyleOf) || isSchemeRelativeUrl(matchStyleOf)) {
      if(isAbsoluteUrl(pathOrUrl) || isSchemeRelativeUrl(pathOrUrl)) return pathOrUrl;
      if(path.isAbsolute(pathOrUrl)) return pathToFileURL(pathOrUrl).toString();
    } else if(path.isAbsolute(matchStyleOf)) {
      if(isAbsoluteUrl(pathOrUrl) || isSchemeRelativeUrl(pathOrUrl)) {
        return fileURLToPath(new URL(pathOrUrl, 'file://'));
      }
    }
    return pathOrUrl;
  } catch(e) {
    return pathOrUrl;
  }
}

function retrieveSourceMapURL(source) {
  var fileData;

  if (isInBrowser()) {
     try {
       var xhr = new XMLHttpRequest();
       xhr.open('GET', source, false);
       xhr.send(null);
       fileData = xhr.readyState === 4 ? xhr.responseText : null;

       // Support providing a sourceMappingURL via the SourceMap header
       var sourceMapHeader = xhr.getResponseHeader("SourceMap") ||
                             xhr.getResponseHeader("X-SourceMap");
       if (sourceMapHeader) {
         return sourceMapHeader;
       }
     } catch (e) {
     }
  }

  // Get the URL of the source map
  fileData = retrieveFile(tryFileURLToPath(source));
  var re = /(?:\/\/[@#][\s]*sourceMappingURL=([^\s'"]+)[\s]*$)|(?:\/\*[@#][\s]*sourceMappingURL=([^\s*'"]+)[\s]*(?:\*\/)[\s]*$)/mg;
  // Keep executing the search to find the *last* sourceMappingURL to avoid
  // picking up sourceMappingURLs from comments, strings, etc.
  var lastMatch, match;
  while (match = re.exec(fileData)) lastMatch = match;
  if (!lastMatch) return null;
  return lastMatch[1];
};

// Can be overridden by the retrieveSourceMap option to install. Takes a
// generated source filename; returns a {map, optional url} object, or null if
// there is no source map.  The map field may be either a string or the parsed
// JSON object (ie, it must be a valid argument to the SourceMapConsumer
// constructor).
/** @type {(source: string) => import('./source-map-support').UrlAndMap | null} */
var retrieveSourceMap = handlerExec(sharedData.retrieveMapHandlers, sharedData.internalRetrieveMapHandlers);
sharedData.internalRetrieveMapHandlers.push(function(source) {
  var sourceMappingURL = retrieveSourceMapURL(source);
  if (!sourceMappingURL) return null;

  // Read the contents of the source map
  var sourceMapData;
  if (reSourceMap.test(sourceMappingURL)) {
    // Support source map URL as a data url
    var rawData = sourceMappingURL.slice(sourceMappingURL.indexOf(',') + 1);
    sourceMapData = Buffer.from(rawData, "base64").toString();
    sourceMappingURL = source;
  } else {
    // Support source map URLs relative to the source URL
    sourceMappingURL = supportRelativeURL(source, sourceMappingURL);
    sourceMapData = retrieveFile(tryFileURLToPath(sourceMappingURL));
  }

  if (!sourceMapData) {
    return null;
  }

  return {
    url: sourceMappingURL,
    map: sourceMapData
  };
});

function mapSourcePosition(position) {
  var sourceMap = getSourceMapCache(position.source);
  if (!sourceMap) {
    // Call the (overrideable) retrieveSourceMap function to get the source map.
    var urlAndMap = retrieveSourceMap(position.source);
    if (urlAndMap) {
      sourceMap = setSourceMapCache(position.source, {
        url: urlAndMap.url,
        map: new AnyMap(urlAndMap.map, urlAndMap.url)
      });

      // Overwrite trace-mapping's resolutions, because they do not handle
      // Windows paths the way we want.
      // TODO Remove now that windows path support was added to resolve-uri and thus trace-mapping?
      sourceMap.map.resolvedSources = sourceMap.map.sources.map(s => supportRelativeURL(sourceMap.url, s));

      // Load all sources stored inline with the source map into the file cache
      // to pretend like they are already loaded. They may not exist on disk.
      if (sourceMap.map.sourcesContent) {
        sourceMap.map.resolvedSources.forEach(function(resolvedSource, i) {
          var contents = sourceMap.map.sourcesContent[i];
          if (contents) {
            setFileContentsCache(resolvedSource, contents);
          }
        });
      }
    } else {
      sourceMap = setSourceMapCache(position.source, {
        url: null,
        map: null
      });
    }
  }

  // Resolve the source URL relative to the URL of the source map
  if (sourceMap && sourceMap.map) {
    var originalPosition = originalPositionFor(sourceMap.map, position);

    // Only return the original position if a matching line was found. If no
    // matching line is found then we return position instead, which will cause
    // the stack trace to print the path and line for the compiled file. It is
    // better to give a precise location in the compiled file than a vague
    // location in the original file.
    if (originalPosition.source !== null) {
      // originalPosition.source has *already* been resolved against sourceMap.url
      // so is *already* as absolute as possible.
      // However, we want to ensure we output in same format as input: URL or native path
      originalPosition.source = matchStyleOfPathOrUrl(
        position.source, originalPosition.source);
      return originalPosition;
    }
  }

  return position;
}

// Parses code generated by FormatEvalOrigin(), a function inside V8:
// https://code.google.com/p/v8/source/browse/trunk/src/messages.js
function mapEvalOrigin(origin) {
  // Most eval() calls are in this format
  var match = /^eval at ([^(]+) \((.+):(\d+):(\d+)\)$/.exec(origin);
  if (match) {
    var position = mapSourcePosition({
      source: match[2],
      line: +match[3],
      column: match[4] - 1
    });
    return 'eval at ' + match[1] + ' (' + position.source + ':' +
      position.line + ':' + (position.column + 1) + ')';
  }

  // Parse nested eval() calls using recursion
  match = /^eval at ([^(]+) \((.+)\)$/.exec(origin);
  if (match) {
    return 'eval at ' + match[1] + ' (' + mapEvalOrigin(match[2]) + ')';
  }

  // Make sure we still return useful information if we didn't find anything
  return origin;
}

// This is copied almost verbatim from the V8 source code at
// https://code.google.com/p/v8/source/browse/trunk/src/messages.js
// Update 2022-04-29:
//    https://github.com/v8/v8/blob/98f6f100c5ab8e390e51422747c4ef644d5ac6f2/src/builtins/builtins-callsite.cc#L175-L179
//    https://github.com/v8/v8/blob/98f6f100c5ab8e390e51422747c4ef644d5ac6f2/src/objects/call-site-info.cc#L795-L804
//    https://github.com/v8/v8/blob/98f6f100c5ab8e390e51422747c4ef644d5ac6f2/src/objects/call-site-info.cc#L717-L750
// The implementation of wrapCallSite() used to just forward to the actual source
// code of CallSite.prototype.toString but unfortunately a new release of V8
// did something to the prototype chain and broke the shim. The only fix I
// could find was copy/paste.
function CallSiteToString() {
  var fileName;
  var fileLocation = "";
  if (this.isNative()) {
    fileLocation = "native";
  } else {
    fileName = this.getScriptNameOrSourceURL();
    if (!fileName && this.isEval()) {
      fileLocation = this.getEvalOrigin();
      fileLocation += ", ";  // Expecting source position to follow.
    }

    if (fileName) {
      fileLocation += fileName;
    } else {
      // Source code does not originate from a file and is not native, but we
      // can still get the source position inside the source string, e.g. in
      // an eval string.
      fileLocation += "<anonymous>";
    }
    var lineNumber = this.getLineNumber();
    if (lineNumber != null) {
      fileLocation += ":" + lineNumber;
      var columnNumber = this.getColumnNumber();
      if (columnNumber) {
        fileLocation += ":" + columnNumber;
      }
    }
  }

  var line = "";
  var isAsync = this.isAsync ? this.isAsync() : false;
  if(isAsync) {
    line += 'async ';
    var isPromiseAll = this.isPromiseAll ? this.isPromiseAll() : false;
    var isPromiseAny = this.isPromiseAny ? this.isPromiseAny() : false;
    if(isPromiseAny || isPromiseAll) {
      line += isPromiseAll ? 'Promise.all (index ' : 'Promise.any (index ';
      var promiseIndex = this.getPromiseIndex();
      line += promiseIndex + ')';
    }
  }
  var functionName = this.getFunctionName();
  var addSuffix = true;
  var isConstructor = this.isConstructor();
  var isMethodCall = !(this.isToplevel() || isConstructor);
  if (isMethodCall) {
    var typeName = this.getTypeName();
    // Fixes shim to be backward compatable with Node v0 to v4
    if (typeName === "[object Object]") {
      typeName = "null";
    }
    var methodName = this.getMethodName();
    if (functionName) {
      if (typeName && functionName.indexOf(typeName) != 0) {
        line += typeName + ".";
      }
      line += functionName;
      if (methodName && functionName.indexOf("." + methodName) != functionName.length - methodName.length - 1) {
        line += " [as " + methodName + "]";
      }
    } else {
      line += typeName + "." + (methodName || "<anonymous>");
    }
  } else if (isConstructor) {
    line += "new " + (functionName || "<anonymous>");
  } else if (functionName) {
    line += functionName;
  } else {
    line += fileLocation;
    addSuffix = false;
  }
  if (addSuffix) {
    line += " (" + fileLocation + ")";
  }
  return line;
}

function cloneCallSite(frame) {
  var object = {};
  Object.getOwnPropertyNames(Object.getPrototypeOf(frame)).forEach(function(name) {
    object[name] = /^(?:is|get)/.test(name) ? function() { return frame[name].call(frame); } : frame[name];
  });
  object.toString = CallSiteToString;
  return object;
}

function wrapCallSite(frame, state) {
  // provides interface backward compatibility
  if (state === undefined) {
    state = { nextPosition: null, curPosition: null }
  }
  if(frame.isNative()) {
    state.curPosition = null;
    return frame;
  }

  // Most call sites will return the source file from getFileName(), but code
  // passed to eval() ending in "//# sourceURL=..." will return the source file
  // from getScriptNameOrSourceURL() instead
  var source = frame.getFileName() || frame.getScriptNameOrSourceURL();
  if (source) {
    // v8 does not expose its internal isWasm, etc methods, so we do this instead.
    if(source.startsWith('wasm://')) {
      state.curPosition = null;
      return frame;
    }

    var line = frame.getLineNumber();
    var column = frame.getColumnNumber() - 1;

    // Fix position in Node where some (internal) code is prepended.
    // See https://github.com/evanw/node-source-map-support/issues/36
    // Header removed in node at ^10.16 || >=11.11.0
    // v11 is not an LTS candidate, we can just test the one version with it.
    // Test node versions for: 10.16-19, 10.20+, 12-19, 20-99, 100+, or 11.11
    var noHeader = /^v(10\.1[6-9]|10\.[2-9][0-9]|10\.[0-9]{3,}|1[2-9]\d*|[2-9]\d|\d{3,}|11\.11)/;
    var headerLength = noHeader.test(process.version) ? 0 : 62;
    if (line === 1 && column > headerLength && !isInBrowser() && !frame.isEval()) {
      column -= headerLength;
    }

    var position = mapSourcePosition({
      source: source,
      line: line,
      column: column
    });
    state.curPosition = position;
    frame = cloneCallSite(frame);
    var originalFunctionName = frame.getFunctionName;
    frame.getFunctionName = function() {
      if (state.nextPosition == null) {
        return originalFunctionName();
      }
      return state.nextPosition.name || originalFunctionName();
    };
    frame.getFileName = function() { return position.source; };
    frame.getLineNumber = function() { return position.line; };
    frame.getColumnNumber = function() { return position.column + 1; };
    frame.getScriptNameOrSourceURL = function() { return position.source; };
    return frame;
  }

  // Code called using eval() needs special handling
  var origin = frame.isEval() && frame.getEvalOrigin();
  if (origin) {
    origin = mapEvalOrigin(origin);
    frame = cloneCallSite(frame);
    frame.getEvalOrigin = function() { return origin; };
    return frame;
  }

  // If we get here then we were unable to change the source position
  return frame;
}

var kIsNodeError = undefined;
try {
  // Get a deliberate ERR_INVALID_ARG_TYPE
  // TODO is there a better way to reliably get an instance of NodeError?
  path.resolve(123);
} catch(e) {
  const symbols = Object.getOwnPropertySymbols(e);
  const symbol = symbols.find(function (s) {return s.toString().indexOf('kIsNodeError') >= 0});
  if(symbol) kIsNodeError = symbol;
}

const ErrorPrototypeToString = (err) =>Error.prototype.toString.call(err);

/** @param {HookState} hookState */
function createPrepareStackTrace(hookState) {
  return prepareStackTrace;

  // This function is part of the V8 stack trace API, for more info see:
  // https://v8.dev/docs/stack-trace-api
  function prepareStackTrace(error, stack) {
    if(!hookState.enabled) return hookState.originalValue.apply(this, arguments);

    if (sharedData.emptyCacheBetweenOperations) {
      clearCaches();
    }

    // node gives its own errors special treatment.  Mimic that behavior
    // https://github.com/nodejs/node/blob/3cbaabc4622df1b4009b9d026a1a970bdbae6e89/lib/internal/errors.js#L118-L128
    // https://github.com/nodejs/node/pull/39182
    var errorString;
    if (kIsNodeError) {
      if(kIsNodeError in error) {
        errorString = `${error.name} [${error.code}]: ${error.message}`;
      } else {
        errorString = ErrorPrototypeToString(error);
      }
    } else {
      var name = error.name || 'Error';
      var message = error.message || '';
      errorString = message ? name + ": " + message : name;
    }

    var state = { nextPosition: null, curPosition: null };
    var processedStack = [];
    for (var i = stack.length - 1; i >= 0; i--) {
      processedStack.push('\n    at ' + wrapCallSite(stack[i], state));
      state.nextPosition = state.curPosition;
    }
    state.curPosition = state.nextPosition = null;
    return errorString + processedStack.reverse().join('');
  }
}

// Generate position and snippet of original source with pointer
function getErrorSource(error) {
  var match = /\n    at [^(]+ \((.*):(\d+):(\d+)\)/.exec(error.stack);
  if (match) {
    var source = match[1];
    var line = +match[2];
    var column = +match[3];

    // Support the inline sourceContents inside the source map
    var contents = getFileContentsCache(source);

    const sourceAsPath = tryFileURLToPath(source);

    // Support files on disk
    if (!contents && fs && fs.existsSync(sourceAsPath)) {
      try {
        contents = fs.readFileSync(sourceAsPath, 'utf8');
      } catch (er) {
        contents = '';
      }
    }

    // Format the line from the original source code like node does
    if (contents) {
      var code = contents.split(/(?:\r\n|\r|\n)/)[line - 1];
      if (code) {
        return source + ':' + line + '\n' + code + '\n' +
          new Array(column).join(' ') + '^';
      }
    }
  }
  return null;
}

function printFatalErrorUponExit (error) {
  var source = getErrorSource(error);

  // Ensure error is printed synchronously and not truncated
  if (process.stderr._handle && process.stderr._handle.setBlocking) {
    process.stderr._handle.setBlocking(true);
  }

  if (source) {
    console.error(source);
  }

  // Matches node's behavior for colorized output
  console.error(
    util.inspect(error, {
      customInspect: false,
      colors: process.stderr.isTTY
    })
  );
}

function shimEmitUncaughtException () {
  const originalValue = process.emit;
  var hook = sharedData.processEmitHook = {
    enabled: true,
    originalValue,
    installedValue: undefined
  };
  var isTerminatingDueToFatalException = false;
  var fatalException;

  process.emit = sharedData.processEmitHook.installedValue = function (type) {
    const hadListeners = originalValue.apply(this, arguments);
    if(hook.enabled) {
      if (type === 'uncaughtException' && !hadListeners) {
        isTerminatingDueToFatalException = true;
        fatalException = arguments[1];
        process.exit(1);
      }
      if (type === 'exit' && isTerminatingDueToFatalException) {
        printFatalErrorUponExit(fatalException);
      }
    }
    return hadListeners;
  };
}

var originalRetrieveFileHandlers = sharedData.retrieveFileHandlers.slice(0);
var originalRetrieveMapHandlers = sharedData.retrieveMapHandlers.slice(0);

exports.wrapCallSite = wrapCallSite;
exports.getErrorSource = getErrorSource;
exports.mapSourcePosition = mapSourcePosition;
exports.retrieveSourceMap = retrieveSourceMap;

exports.install = function(options) {
  options = options || {};

  if (options.environment) {
    environment = options.environment;
    if (["node", "browser", "auto"].indexOf(environment) === -1) {
      throw new Error("environment " + environment + " was unknown. Available options are {auto, browser, node}")
    }
  }

  // Use dynamicRequire to avoid including in browser bundles
  var Module = dynamicRequire(module, 'module');

  // Redirect subsequent imports of "source-map-support"
  // to this package
  const {redirectConflictingLibrary = true, onConflictingLibraryRedirect} = options;
  if(redirectConflictingLibrary) {
    if (!sharedData.moduleResolveFilenameHook) {
      const originalValue = Module._resolveFilename;
      const moduleResolveFilenameHook = sharedData.moduleResolveFilenameHook = {
        enabled: true,
        originalValue,
        installedValue: undefined,
      }
      Module._resolveFilename = sharedData.moduleResolveFilenameHook.installedValue = function (request, parent, isMain, options) {
        if (moduleResolveFilenameHook.enabled) {
          // Match all source-map-support entrypoints: source-map-support, source-map-support/register
          let requestRedirect;
          if (request === 'source-map-support') {
            requestRedirect = './';
          } else if (request === 'source-map-support/register') {
            requestRedirect = './register';
          }

          if (requestRedirect !== undefined) {
              const newRequest = __nccwpck_require__.ab + "register.js";
              for (const cb of sharedData.onConflictingLibraryRedirectArr) {
                cb(request, parent, isMain, options, __nccwpck_require__.ab + "register.js");
              }
              request = __nccwpck_require__.ab + "register.js";
          }
        }
        
        return originalValue.call(this, __nccwpck_require__.ab + "register.js", parent, isMain, options);
      }
    } 
    if (onConflictingLibraryRedirect) {
      sharedData.onConflictingLibraryRedirectArr.push(onConflictingLibraryRedirect);
    }
  }

  // Allow sources to be found by methods other than reading the files
  // directly from disk.
  if (options.retrieveFile) {
    if (options.overrideRetrieveFile) {
      sharedData.retrieveFileHandlers.length = 0;
    }

    sharedData.retrieveFileHandlers.unshift(options.retrieveFile);
  }

  // Allow source maps to be found by methods other than reading the files
  // directly from disk.
  if (options.retrieveSourceMap) {
    if (options.overrideRetrieveSourceMap) {
      sharedData.retrieveMapHandlers.length = 0;
    }

    sharedData.retrieveMapHandlers.unshift(options.retrieveSourceMap);
  }

  // Support runtime transpilers that include inline source maps
  if (options.hookRequire && !isInBrowser()) {
    var $compile = Module.prototype._compile;

    if (!$compile.__sourceMapSupport) {
      Module.prototype._compile = function(content, filename) {
        setFileContentsCache(filename, content);
        setSourceMapCache(filename, undefined);
        return $compile.call(this, content, filename);
      };

      Module.prototype._compile.__sourceMapSupport = true;
    }
  }

  // Configure options
  if (!sharedData.emptyCacheBetweenOperations) {
    sharedData.emptyCacheBetweenOperations = 'emptyCacheBetweenOperations' in options ?
      options.emptyCacheBetweenOperations : false;
  }


  // Install the error reformatter
  if (!sharedData.errorPrepareStackTraceHook) {
    const originalValue = Error.prepareStackTrace;
    sharedData.errorPrepareStackTraceHook = {
      enabled: true,
      originalValue,
      installedValue: undefined
    };
    Error.prepareStackTrace = sharedData.errorPrepareStackTraceHook.installedValue = createPrepareStackTrace(sharedData.errorPrepareStackTraceHook);
  }

  if (!sharedData.processEmitHook) {
    var installHandler = 'handleUncaughtExceptions' in options ?
      options.handleUncaughtExceptions : true;

    // Do not override 'uncaughtException' with our own handler in Node.js
    // Worker threads. Workers pass the error to the main thread as an event,
    // rather than printing something to stderr and exiting.
    try {
      // We need to use `dynamicRequire` because `require` on it's own will be optimized by WebPack/Browserify.
      var worker_threads = dynamicRequire(module, 'worker_threads');
      if (worker_threads.isMainThread === false) {
        installHandler = false;
      }
    } catch(e) {}

    // Provide the option to not install the uncaught exception handler. This is
    // to support other uncaught exception handlers (in test frameworks, for
    // example). If this handler is not installed and there are no other uncaught
    // exception handlers, uncaught exceptions will be caught by node's built-in
    // exception handler and the process will still be terminated. However, the
    // generated JavaScript code will be shown above the stack trace instead of
    // the original source code.
    if (installHandler && hasGlobalProcessEventEmitter()) {
      shimEmitUncaughtException();
    }
  }
};

exports.uninstall = function() {
  if(sharedData.processEmitHook) {
    // Disable behavior
    sharedData.processEmitHook.enabled = false;
    // If possible, remove our hook function.  May not be possible if subsequent third-party hooks have wrapped around us.
    if(process.emit === sharedData.processEmitHook.installedValue) {
      process.emit = sharedData.processEmitHook.originalValue;
    }
    sharedData.processEmitHook = undefined;
  }
  if(sharedData.errorPrepareStackTraceHook) {
    // Disable behavior
    sharedData.errorPrepareStackTraceHook.enabled = false;
    // If possible or necessary, remove our hook function.
    // In vanilla environments, prepareStackTrace is `undefined`.
    // We cannot delegate to `undefined` the way we can to a function w/`.apply()`; our only option is to remove the function.
    // If we are the *first* hook installed, and another was installed on top of us, we have no choice but to remove both.
    if(Error.prepareStackTrace === sharedData.errorPrepareStackTraceHook.installedValue || typeof sharedData.errorPrepareStackTraceHook.originalValue !== 'function') {
      Error.prepareStackTrace = sharedData.errorPrepareStackTraceHook.originalValue;
    }
    sharedData.errorPrepareStackTraceHook = undefined;
  }
  if (sharedData.moduleResolveFilenameHook) {
    // Disable behavior
    sharedData.moduleResolveFilenameHook.enabled = false;
    // If possible, remove our hook function.  May not be possible if subsequent third-party hooks have wrapped around us.
    var Module = dynamicRequire(module, 'module');
    if(Module._resolveFilename === sharedData.moduleResolveFilenameHook.installedValue) {
      Module._resolveFilename = sharedData.moduleResolveFilenameHook.originalValue;
    }
    sharedData.moduleResolveFilenameHook = undefined;
  }
  sharedData.onConflictingLibraryRedirectArr.length = 0;
}

exports.resetRetrieveHandlers = function() {
  sharedData.retrieveFileHandlers.length = 0;
  sharedData.retrieveMapHandlers.length = 0;
}


/***/ }),

/***/ 6898:
/***/ (function(module) {

(function (global, factory) {
     true ? module.exports = factory() :
    0;
})(this, (function () { 'use strict';

    // Matches the scheme of a URL, eg "http://"
    const schemeRegex = /^[\w+.-]+:\/\//;
    /**
     * Matches the parts of a URL:
     * 1. Scheme, including ":", guaranteed.
     * 2. User/password, including "@", optional.
     * 3. Host, guaranteed.
     * 4. Port, including ":", optional.
     * 5. Path, including "/", optional.
     * 6. Query, including "?", optional.
     * 7. Hash, including "#", optional.
     */
    const urlRegex = /^([\w+.-]+:)\/\/([^@/#?]*@)?([^:/#?]*)(:\d+)?(\/[^#?]*)?(\?[^#]*)?(#.*)?/;
    /**
     * File URLs are weird. They dont' need the regular `//` in the scheme, they may or may not start
     * with a leading `/`, they can have a domain (but only if they don't start with a Windows drive).
     *
     * 1. Host, optional.
     * 2. Path, which may include "/", guaranteed.
     * 3. Query, including "?", optional.
     * 4. Hash, including "#", optional.
     */
    const fileRegex = /^file:(?:\/\/((?![a-z]:)[^/#?]*)?)?(\/?[^#?]*)(\?[^#]*)?(#.*)?/i;
    var UrlType;
    (function (UrlType) {
        UrlType[UrlType["Empty"] = 1] = "Empty";
        UrlType[UrlType["Hash"] = 2] = "Hash";
        UrlType[UrlType["Query"] = 3] = "Query";
        UrlType[UrlType["RelativePath"] = 4] = "RelativePath";
        UrlType[UrlType["AbsolutePath"] = 5] = "AbsolutePath";
        UrlType[UrlType["SchemeRelative"] = 6] = "SchemeRelative";
        UrlType[UrlType["Absolute"] = 7] = "Absolute";
    })(UrlType || (UrlType = {}));
    function isAbsoluteUrl(input) {
        return schemeRegex.test(input);
    }
    function isSchemeRelativeUrl(input) {
        return input.startsWith('//');
    }
    function isAbsolutePath(input) {
        return input.startsWith('/');
    }
    function isFileUrl(input) {
        return input.startsWith('file:');
    }
    function isRelative(input) {
        return /^[.?#]/.test(input);
    }
    function parseAbsoluteUrl(input) {
        const match = urlRegex.exec(input);
        return makeUrl(match[1], match[2] || '', match[3], match[4] || '', match[5] || '/', match[6] || '', match[7] || '');
    }
    function parseFileUrl(input) {
        const match = fileRegex.exec(input);
        const path = match[2];
        return makeUrl('file:', '', match[1] || '', '', isAbsolutePath(path) ? path : '/' + path, match[3] || '', match[4] || '');
    }
    function makeUrl(scheme, user, host, port, path, query, hash) {
        return {
            scheme,
            user,
            host,
            port,
            path,
            query,
            hash,
            type: UrlType.Absolute,
        };
    }
    function parseUrl(input) {
        if (isSchemeRelativeUrl(input)) {
            const url = parseAbsoluteUrl('http:' + input);
            url.scheme = '';
            url.type = UrlType.SchemeRelative;
            return url;
        }
        if (isAbsolutePath(input)) {
            const url = parseAbsoluteUrl('http://foo.com' + input);
            url.scheme = '';
            url.host = '';
            url.type = UrlType.AbsolutePath;
            return url;
        }
        if (isFileUrl(input))
            return parseFileUrl(input);
        if (isAbsoluteUrl(input))
            return parseAbsoluteUrl(input);
        const url = parseAbsoluteUrl('http://foo.com/' + input);
        url.scheme = '';
        url.host = '';
        url.type = input
            ? input.startsWith('?')
                ? UrlType.Query
                : input.startsWith('#')
                    ? UrlType.Hash
                    : UrlType.RelativePath
            : UrlType.Empty;
        return url;
    }
    function stripPathFilename(path) {
        // If a path ends with a parent directory "..", then it's a relative path with excess parent
        // paths. It's not a file, so we can't strip it.
        if (path.endsWith('/..'))
            return path;
        const index = path.lastIndexOf('/');
        return path.slice(0, index + 1);
    }
    function mergePaths(url, base) {
        normalizePath(base, base.type);
        // If the path is just a "/", then it was an empty path to begin with (remember, we're a relative
        // path).
        if (url.path === '/') {
            url.path = base.path;
        }
        else {
            // Resolution happens relative to the base path's directory, not the file.
            url.path = stripPathFilename(base.path) + url.path;
        }
    }
    /**
     * The path can have empty directories "//", unneeded parents "foo/..", or current directory
     * "foo/.". We need to normalize to a standard representation.
     */
    function normalizePath(url, type) {
        const rel = type <= UrlType.RelativePath;
        const pieces = url.path.split('/');
        // We need to preserve the first piece always, so that we output a leading slash. The item at
        // pieces[0] is an empty string.
        let pointer = 1;
        // Positive is the number of real directories we've output, used for popping a parent directory.
        // Eg, "foo/bar/.." will have a positive 2, and we can decrement to be left with just "foo".
        let positive = 0;
        // We need to keep a trailing slash if we encounter an empty directory (eg, splitting "foo/" will
        // generate `["foo", ""]` pieces). And, if we pop a parent directory. But once we encounter a
        // real directory, we won't need to append, unless the other conditions happen again.
        let addTrailingSlash = false;
        for (let i = 1; i < pieces.length; i++) {
            const piece = pieces[i];
            // An empty directory, could be a trailing slash, or just a double "//" in the path.
            if (!piece) {
                addTrailingSlash = true;
                continue;
            }
            // If we encounter a real directory, then we don't need to append anymore.
            addTrailingSlash = false;
            // A current directory, which we can always drop.
            if (piece === '.')
                continue;
            // A parent directory, we need to see if there are any real directories we can pop. Else, we
            // have an excess of parents, and we'll need to keep the "..".
            if (piece === '..') {
                if (positive) {
                    addTrailingSlash = true;
                    positive--;
                    pointer--;
                }
                else if (rel) {
                    // If we're in a relativePath, then we need to keep the excess parents. Else, in an absolute
                    // URL, protocol relative URL, or an absolute path, we don't need to keep excess.
                    pieces[pointer++] = piece;
                }
                continue;
            }
            // We've encountered a real directory. Move it to the next insertion pointer, which accounts for
            // any popped or dropped directories.
            pieces[pointer++] = piece;
            positive++;
        }
        let path = '';
        for (let i = 1; i < pointer; i++) {
            path += '/' + pieces[i];
        }
        if (!path || (addTrailingSlash && !path.endsWith('/..'))) {
            path += '/';
        }
        url.path = path;
    }
    /**
     * Attempts to resolve `input` URL/path relative to `base`.
     */
    function resolve(input, base) {
        if (!input && !base)
            return '';
        const url = parseUrl(input);
        let inputType = url.type;
        if (base && inputType !== UrlType.Absolute) {
            const baseUrl = parseUrl(base);
            const baseType = baseUrl.type;
            switch (inputType) {
                case UrlType.Empty:
                    url.hash = baseUrl.hash;
                // fall through
                case UrlType.Hash:
                    url.query = baseUrl.query;
                // fall through
                case UrlType.Query:
                case UrlType.RelativePath:
                    mergePaths(url, baseUrl);
                // fall through
                case UrlType.AbsolutePath:
                    // The host, user, and port are joined, you can't copy one without the others.
                    url.user = baseUrl.user;
                    url.host = baseUrl.host;
                    url.port = baseUrl.port;
                // fall through
                case UrlType.SchemeRelative:
                    // The input doesn't have a schema at least, so we need to copy at least that over.
                    url.scheme = baseUrl.scheme;
            }
            if (baseType > inputType)
                inputType = baseType;
        }
        normalizePath(url, inputType);
        const queryHash = url.query + url.hash;
        switch (inputType) {
            // This is impossible, because of the empty checks at the start of the function.
            // case UrlType.Empty:
            case UrlType.Hash:
            case UrlType.Query:
                return queryHash;
            case UrlType.RelativePath: {
                // The first char is always a "/", and we need it to be relative.
                const path = url.path.slice(1);
                if (!path)
                    return queryHash || '.';
                if (isRelative(base || input) && !isRelative(path)) {
                    // If base started with a leading ".", or there is no base and input started with a ".",
                    // then we need to ensure that the relative path starts with a ".". We don't know if
                    // relative starts with a "..", though, so check before prepending.
                    return './' + path + queryHash;
                }
                return path + queryHash;
            }
            case UrlType.AbsolutePath:
                return url.path + queryHash;
            default:
                return url.scheme + '//' + url.user + url.host + url.port + url.path + queryHash;
        }
    }

    return resolve;

}));
//# sourceMappingURL=resolve-uri.umd.js.map


/***/ }),

/***/ 7225:
/***/ (function(__unused_webpack_module, exports) {

(function (global, factory) {
     true ? factory(exports) :
    0;
})(this, (function (exports) { 'use strict';

    const comma = ','.charCodeAt(0);
    const semicolon = ';'.charCodeAt(0);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const intToChar = new Uint8Array(64); // 64 possible chars.
    const charToInt = new Uint8Array(128); // z is 122 in ASCII
    for (let i = 0; i < chars.length; i++) {
        const c = chars.charCodeAt(i);
        intToChar[i] = c;
        charToInt[c] = i;
    }
    // Provide a fallback for older environments.
    const td = typeof TextDecoder !== 'undefined'
        ? /* #__PURE__ */ new TextDecoder()
        : typeof Buffer !== 'undefined'
            ? {
                decode(buf) {
                    const out = Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength);
                    return out.toString();
                },
            }
            : {
                decode(buf) {
                    let out = '';
                    for (let i = 0; i < buf.length; i++) {
                        out += String.fromCharCode(buf[i]);
                    }
                    return out;
                },
            };
    function decode(mappings) {
        const state = new Int32Array(5);
        const decoded = [];
        let index = 0;
        do {
            const semi = indexOf(mappings, index);
            const line = [];
            let sorted = true;
            let lastCol = 0;
            state[0] = 0;
            for (let i = index; i < semi; i++) {
                let seg;
                i = decodeInteger(mappings, i, state, 0); // genColumn
                const col = state[0];
                if (col < lastCol)
                    sorted = false;
                lastCol = col;
                if (hasMoreVlq(mappings, i, semi)) {
                    i = decodeInteger(mappings, i, state, 1); // sourcesIndex
                    i = decodeInteger(mappings, i, state, 2); // sourceLine
                    i = decodeInteger(mappings, i, state, 3); // sourceColumn
                    if (hasMoreVlq(mappings, i, semi)) {
                        i = decodeInteger(mappings, i, state, 4); // namesIndex
                        seg = [col, state[1], state[2], state[3], state[4]];
                    }
                    else {
                        seg = [col, state[1], state[2], state[3]];
                    }
                }
                else {
                    seg = [col];
                }
                line.push(seg);
            }
            if (!sorted)
                sort(line);
            decoded.push(line);
            index = semi + 1;
        } while (index <= mappings.length);
        return decoded;
    }
    function indexOf(mappings, index) {
        const idx = mappings.indexOf(';', index);
        return idx === -1 ? mappings.length : idx;
    }
    function decodeInteger(mappings, pos, state, j) {
        let value = 0;
        let shift = 0;
        let integer = 0;
        do {
            const c = mappings.charCodeAt(pos++);
            integer = charToInt[c];
            value |= (integer & 31) << shift;
            shift += 5;
        } while (integer & 32);
        const shouldNegate = value & 1;
        value >>>= 1;
        if (shouldNegate) {
            value = -0x80000000 | -value;
        }
        state[j] += value;
        return pos;
    }
    function hasMoreVlq(mappings, i, length) {
        if (i >= length)
            return false;
        return mappings.charCodeAt(i) !== comma;
    }
    function sort(line) {
        line.sort(sortComparator);
    }
    function sortComparator(a, b) {
        return a[0] - b[0];
    }
    function encode(decoded) {
        const state = new Int32Array(5);
        const bufLength = 1024 * 16;
        const subLength = bufLength - 36;
        const buf = new Uint8Array(bufLength);
        const sub = buf.subarray(0, subLength);
        let pos = 0;
        let out = '';
        for (let i = 0; i < decoded.length; i++) {
            const line = decoded[i];
            if (i > 0) {
                if (pos === bufLength) {
                    out += td.decode(buf);
                    pos = 0;
                }
                buf[pos++] = semicolon;
            }
            if (line.length === 0)
                continue;
            state[0] = 0;
            for (let j = 0; j < line.length; j++) {
                const segment = line[j];
                // We can push up to 5 ints, each int can take at most 7 chars, and we
                // may push a comma.
                if (pos > subLength) {
                    out += td.decode(sub);
                    buf.copyWithin(0, subLength, pos);
                    pos -= subLength;
                }
                if (j > 0)
                    buf[pos++] = comma;
                pos = encodeInteger(buf, pos, state, segment, 0); // genColumn
                if (segment.length === 1)
                    continue;
                pos = encodeInteger(buf, pos, state, segment, 1); // sourcesIndex
                pos = encodeInteger(buf, pos, state, segment, 2); // sourceLine
                pos = encodeInteger(buf, pos, state, segment, 3); // sourceColumn
                if (segment.length === 4)
                    continue;
                pos = encodeInteger(buf, pos, state, segment, 4); // namesIndex
            }
        }
        return out + td.decode(buf.subarray(0, pos));
    }
    function encodeInteger(buf, pos, state, segment, j) {
        const next = segment[j];
        let num = next - state[j];
        state[j] = next;
        num = num < 0 ? (-num << 1) | 1 : num << 1;
        do {
            let clamped = num & 0b011111;
            num >>>= 5;
            if (num > 0)
                clamped |= 0b100000;
            buf[pos++] = intToChar[clamped];
        } while (num > 0);
        return pos;
    }

    exports.decode = decode;
    exports.encode = encode;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=sourcemap-codec.umd.js.map


/***/ }),

/***/ 4817:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

(function (global, factory) {
     true ? factory(exports, __nccwpck_require__(7225), __nccwpck_require__(6898)) :
    0;
})(this, (function (exports, sourcemapCodec, resolveUri) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var resolveUri__default = /*#__PURE__*/_interopDefaultLegacy(resolveUri);

    function resolve(input, base) {
        // The base is always treated as a directory, if it's not empty.
        // https://github.com/mozilla/source-map/blob/8cb3ee57/lib/util.js#L327
        // https://github.com/chromium/chromium/blob/da4adbb3/third_party/blink/renderer/devtools/front_end/sdk/SourceMap.js#L400-L401
        if (base && !base.endsWith('/'))
            base += '/';
        return resolveUri__default["default"](input, base);
    }

    /**
     * Removes everything after the last "/", but leaves the slash.
     */
    function stripFilename(path) {
        if (!path)
            return '';
        const index = path.lastIndexOf('/');
        return path.slice(0, index + 1);
    }

    const COLUMN = 0;
    const SOURCES_INDEX = 1;
    const SOURCE_LINE = 2;
    const SOURCE_COLUMN = 3;
    const NAMES_INDEX = 4;
    const REV_GENERATED_LINE = 1;
    const REV_GENERATED_COLUMN = 2;

    function maybeSort(mappings, owned) {
        const unsortedIndex = nextUnsortedSegmentLine(mappings, 0);
        if (unsortedIndex === mappings.length)
            return mappings;
        // If we own the array (meaning we parsed it from JSON), then we're free to directly mutate it. If
        // not, we do not want to modify the consumer's input array.
        if (!owned)
            mappings = mappings.slice();
        for (let i = unsortedIndex; i < mappings.length; i = nextUnsortedSegmentLine(mappings, i + 1)) {
            mappings[i] = sortSegments(mappings[i], owned);
        }
        return mappings;
    }
    function nextUnsortedSegmentLine(mappings, start) {
        for (let i = start; i < mappings.length; i++) {
            if (!isSorted(mappings[i]))
                return i;
        }
        return mappings.length;
    }
    function isSorted(line) {
        for (let j = 1; j < line.length; j++) {
            if (line[j][COLUMN] < line[j - 1][COLUMN]) {
                return false;
            }
        }
        return true;
    }
    function sortSegments(line, owned) {
        if (!owned)
            line = line.slice();
        return line.sort(sortComparator);
    }
    function sortComparator(a, b) {
        return a[COLUMN] - b[COLUMN];
    }

    let found = false;
    /**
     * A binary search implementation that returns the index if a match is found.
     * If no match is found, then the left-index (the index associated with the item that comes just
     * before the desired index) is returned. To maintain proper sort order, a splice would happen at
     * the next index:
     *
     * ```js
     * const array = [1, 3];
     * const needle = 2;
     * const index = binarySearch(array, needle, (item, needle) => item - needle);
     *
     * assert.equal(index, 0);
     * array.splice(index + 1, 0, needle);
     * assert.deepEqual(array, [1, 2, 3]);
     * ```
     */
    function binarySearch(haystack, needle, low, high) {
        while (low <= high) {
            const mid = low + ((high - low) >> 1);
            const cmp = haystack[mid][COLUMN] - needle;
            if (cmp === 0) {
                found = true;
                return mid;
            }
            if (cmp < 0) {
                low = mid + 1;
            }
            else {
                high = mid - 1;
            }
        }
        found = false;
        return low - 1;
    }
    function upperBound(haystack, needle, index) {
        for (let i = index + 1; i < haystack.length; i++, index++) {
            if (haystack[i][COLUMN] !== needle)
                break;
        }
        return index;
    }
    function lowerBound(haystack, needle, index) {
        for (let i = index - 1; i >= 0; i--, index--) {
            if (haystack[i][COLUMN] !== needle)
                break;
        }
        return index;
    }
    function memoizedState() {
        return {
            lastKey: -1,
            lastNeedle: -1,
            lastIndex: -1,
        };
    }
    /**
     * This overly complicated beast is just to record the last tested line/column and the resulting
     * index, allowing us to skip a few tests if mappings are monotonically increasing.
     */
    function memoizedBinarySearch(haystack, needle, state, key) {
        const { lastKey, lastNeedle, lastIndex } = state;
        let low = 0;
        let high = haystack.length - 1;
        if (key === lastKey) {
            if (needle === lastNeedle) {
                found = lastIndex !== -1 && haystack[lastIndex][COLUMN] === needle;
                return lastIndex;
            }
            if (needle >= lastNeedle) {
                // lastIndex may be -1 if the previous needle was not found.
                low = lastIndex === -1 ? 0 : lastIndex;
            }
            else {
                high = lastIndex;
            }
        }
        state.lastKey = key;
        state.lastNeedle = needle;
        return (state.lastIndex = binarySearch(haystack, needle, low, high));
    }

    // Rebuilds the original source files, with mappings that are ordered by source line/column instead
    // of generated line/column.
    function buildBySources(decoded, memos) {
        const sources = memos.map(buildNullArray);
        for (let i = 0; i < decoded.length; i++) {
            const line = decoded[i];
            for (let j = 0; j < line.length; j++) {
                const seg = line[j];
                if (seg.length === 1)
                    continue;
                const sourceIndex = seg[SOURCES_INDEX];
                const sourceLine = seg[SOURCE_LINE];
                const sourceColumn = seg[SOURCE_COLUMN];
                const originalSource = sources[sourceIndex];
                const originalLine = (originalSource[sourceLine] || (originalSource[sourceLine] = []));
                const memo = memos[sourceIndex];
                // The binary search either found a match, or it found the left-index just before where the
                // segment should go. Either way, we want to insert after that. And there may be multiple
                // generated segments associated with an original location, so there may need to move several
                // indexes before we find where we need to insert.
                const index = upperBound(originalLine, sourceColumn, memoizedBinarySearch(originalLine, sourceColumn, memo, sourceLine));
                insert(originalLine, (memo.lastIndex = index + 1), [sourceColumn, i, seg[COLUMN]]);
            }
        }
        return sources;
    }
    function insert(array, index, value) {
        for (let i = array.length; i > index; i--) {
            array[i] = array[i - 1];
        }
        array[index] = value;
    }
    // Null arrays allow us to use ordered index keys without actually allocating contiguous memory like
    // a real array. We use a null-prototype object to avoid prototype pollution and deoptimizations.
    // Numeric properties on objects are magically sorted in ascending order by the engine regardless of
    // the insertion order. So, by setting any numeric keys, even out of order, we'll get ascending
    // order when iterating with for-in.
    function buildNullArray() {
        return { __proto__: null };
    }

    const AnyMap = function (map, mapUrl) {
        const parsed = typeof map === 'string' ? JSON.parse(map) : map;
        if (!('sections' in parsed))
            return new TraceMap(parsed, mapUrl);
        const mappings = [];
        const sources = [];
        const sourcesContent = [];
        const names = [];
        const { sections } = parsed;
        let i = 0;
        for (; i < sections.length - 1; i++) {
            const no = sections[i + 1].offset;
            addSection(sections[i], mapUrl, mappings, sources, sourcesContent, names, no.line, no.column);
        }
        if (sections.length > 0) {
            addSection(sections[i], mapUrl, mappings, sources, sourcesContent, names, Infinity, Infinity);
        }
        const joined = {
            version: 3,
            file: parsed.file,
            names,
            sources,
            sourcesContent,
            mappings,
        };
        return exports.presortedDecodedMap(joined);
    };
    function addSection(section, mapUrl, mappings, sources, sourcesContent, names, stopLine, stopColumn) {
        const map = AnyMap(section.map, mapUrl);
        const { line: lineOffset, column: columnOffset } = section.offset;
        const sourcesOffset = sources.length;
        const namesOffset = names.length;
        const decoded = exports.decodedMappings(map);
        const { resolvedSources } = map;
        append(sources, resolvedSources);
        append(sourcesContent, map.sourcesContent || fillSourcesContent(resolvedSources.length));
        append(names, map.names);
        // If this section jumps forwards several lines, we need to add lines to the output mappings catch up.
        for (let i = mappings.length; i <= lineOffset; i++)
            mappings.push([]);
        // We can only add so many lines before we step into the range that the next section's map
        // controls. When we get to the last line, then we'll start checking the segments to see if
        // they've crossed into the column range.
        const stopI = stopLine - lineOffset;
        const len = Math.min(decoded.length, stopI + 1);
        for (let i = 0; i < len; i++) {
            const line = decoded[i];
            // On the 0th loop, the line will already exist due to a previous section, or the line catch up
            // loop above.
            const out = i === 0 ? mappings[lineOffset] : (mappings[lineOffset + i] = []);
            // On the 0th loop, the section's column offset shifts us forward. On all other lines (since the
            // map can be multiple lines), it doesn't.
            const cOffset = i === 0 ? columnOffset : 0;
            for (let j = 0; j < line.length; j++) {
                const seg = line[j];
                const column = cOffset + seg[COLUMN];
                // If this segment steps into the column range that the next section's map controls, we need
                // to stop early.
                if (i === stopI && column >= stopColumn)
                    break;
                if (seg.length === 1) {
                    out.push([column]);
                    continue;
                }
                const sourcesIndex = sourcesOffset + seg[SOURCES_INDEX];
                const sourceLine = seg[SOURCE_LINE];
                const sourceColumn = seg[SOURCE_COLUMN];
                if (seg.length === 4) {
                    out.push([column, sourcesIndex, sourceLine, sourceColumn]);
                    continue;
                }
                out.push([column, sourcesIndex, sourceLine, sourceColumn, namesOffset + seg[NAMES_INDEX]]);
            }
        }
    }
    function append(arr, other) {
        for (let i = 0; i < other.length; i++)
            arr.push(other[i]);
    }
    // Sourcemaps don't need to have sourcesContent, and if they don't, we need to create an array of
    // equal length to the sources. This is because the sources and sourcesContent are paired arrays,
    // where `sourcesContent[i]` is the content of the `sources[i]` file. If we didn't, then joined
    // sourcemap would desynchronize the sources/contents.
    function fillSourcesContent(len) {
        const sourcesContent = [];
        for (let i = 0; i < len; i++)
            sourcesContent[i] = null;
        return sourcesContent;
    }

    const INVALID_ORIGINAL_MAPPING = Object.freeze({
        source: null,
        line: null,
        column: null,
        name: null,
    });
    const INVALID_GENERATED_MAPPING = Object.freeze({
        line: null,
        column: null,
    });
    const LINE_GTR_ZERO = '`line` must be greater than 0 (lines start at line 1)';
    const COL_GTR_EQ_ZERO = '`column` must be greater than or equal to 0 (columns start at column 0)';
    const LEAST_UPPER_BOUND = -1;
    const GREATEST_LOWER_BOUND = 1;
    /**
     * Returns the encoded (VLQ string) form of the SourceMap's mappings field.
     */
    exports.encodedMappings = void 0;
    /**
     * Returns the decoded (array of lines of segments) form of the SourceMap's mappings field.
     */
    exports.decodedMappings = void 0;
    /**
     * A low-level API to find the segment associated with a generated line/column (think, from a
     * stack trace). Line and column here are 0-based, unlike `originalPositionFor`.
     */
    exports.traceSegment = void 0;
    /**
     * A higher-level API to find the source/line/column associated with a generated line/column
     * (think, from a stack trace). Line is 1-based, but column is 0-based, due to legacy behavior in
     * `source-map` library.
     */
    exports.originalPositionFor = void 0;
    /**
     * Finds the source/line/column directly after the mapping returned by originalPositionFor, provided
     * the found mapping is from the same source and line as the originalPositionFor mapping.
     *
     * Eg, in the code `let id = 1`, `originalPositionAfter` could find the mapping associated with `1`
     * using the same needle that would return `id` when calling `originalPositionFor`.
     */
    exports.generatedPositionFor = void 0;
    /**
     * Iterates each mapping in generated position order.
     */
    exports.eachMapping = void 0;
    /**
     * A helper that skips sorting of the input map's mappings array, which can be expensive for larger
     * maps.
     */
    exports.presortedDecodedMap = void 0;
    /**
     * Returns a sourcemap object (with decoded mappings) suitable for passing to a library that expects
     * a sourcemap, or to JSON.stringify.
     */
    exports.decodedMap = void 0;
    /**
     * Returns a sourcemap object (with encoded mappings) suitable for passing to a library that expects
     * a sourcemap, or to JSON.stringify.
     */
    exports.encodedMap = void 0;
    class TraceMap {
        constructor(map, mapUrl) {
            this._decodedMemo = memoizedState();
            this._bySources = undefined;
            this._bySourceMemos = undefined;
            const isString = typeof map === 'string';
            if (!isString && map.constructor === TraceMap)
                return map;
            const parsed = (isString ? JSON.parse(map) : map);
            const { version, file, names, sourceRoot, sources, sourcesContent } = parsed;
            this.version = version;
            this.file = file;
            this.names = names;
            this.sourceRoot = sourceRoot;
            this.sources = sources;
            this.sourcesContent = sourcesContent;
            if (sourceRoot || mapUrl) {
                const from = resolve(sourceRoot || '', stripFilename(mapUrl));
                this.resolvedSources = sources.map((s) => resolve(s || '', from));
            }
            else {
                this.resolvedSources = sources.map((s) => s || '');
            }
            const { mappings } = parsed;
            if (typeof mappings === 'string') {
                this._encoded = mappings;
                this._decoded = undefined;
            }
            else {
                this._encoded = undefined;
                this._decoded = maybeSort(mappings, isString);
            }
        }
    }
    (() => {
        exports.encodedMappings = (map) => {
            var _a;
            return ((_a = map._encoded) !== null && _a !== void 0 ? _a : (map._encoded = sourcemapCodec.encode(map._decoded)));
        };
        exports.decodedMappings = (map) => {
            return (map._decoded || (map._decoded = sourcemapCodec.decode(map._encoded)));
        };
        exports.traceSegment = (map, line, column) => {
            const decoded = exports.decodedMappings(map);
            // It's common for parent source maps to have pointers to lines that have no
            // mapping (like a "//# sourceMappingURL=") at the end of the child file.
            if (line >= decoded.length)
                return null;
            return traceSegmentInternal(decoded[line], map._decodedMemo, line, column, GREATEST_LOWER_BOUND);
        };
        exports.originalPositionFor = (map, { line, column, bias }) => {
            line--;
            if (line < 0)
                throw new Error(LINE_GTR_ZERO);
            if (column < 0)
                throw new Error(COL_GTR_EQ_ZERO);
            const decoded = exports.decodedMappings(map);
            // It's common for parent source maps to have pointers to lines that have no
            // mapping (like a "//# sourceMappingURL=") at the end of the child file.
            if (line >= decoded.length)
                return INVALID_ORIGINAL_MAPPING;
            const segment = traceSegmentInternal(decoded[line], map._decodedMemo, line, column, bias || GREATEST_LOWER_BOUND);
            if (segment == null)
                return INVALID_ORIGINAL_MAPPING;
            if (segment.length == 1)
                return INVALID_ORIGINAL_MAPPING;
            const { names, resolvedSources } = map;
            return {
                source: resolvedSources[segment[SOURCES_INDEX]],
                line: segment[SOURCE_LINE] + 1,
                column: segment[SOURCE_COLUMN],
                name: segment.length === 5 ? names[segment[NAMES_INDEX]] : null,
            };
        };
        exports.generatedPositionFor = (map, { source, line, column, bias }) => {
            line--;
            if (line < 0)
                throw new Error(LINE_GTR_ZERO);
            if (column < 0)
                throw new Error(COL_GTR_EQ_ZERO);
            const { sources, resolvedSources } = map;
            let sourceIndex = sources.indexOf(source);
            if (sourceIndex === -1)
                sourceIndex = resolvedSources.indexOf(source);
            if (sourceIndex === -1)
                return INVALID_GENERATED_MAPPING;
            const generated = (map._bySources || (map._bySources = buildBySources(exports.decodedMappings(map), (map._bySourceMemos = sources.map(memoizedState)))));
            const memos = map._bySourceMemos;
            const segments = generated[sourceIndex][line];
            if (segments == null)
                return INVALID_GENERATED_MAPPING;
            const segment = traceSegmentInternal(segments, memos[sourceIndex], line, column, bias || GREATEST_LOWER_BOUND);
            if (segment == null)
                return INVALID_GENERATED_MAPPING;
            return {
                line: segment[REV_GENERATED_LINE] + 1,
                column: segment[REV_GENERATED_COLUMN],
            };
        };
        exports.eachMapping = (map, cb) => {
            const decoded = exports.decodedMappings(map);
            const { names, resolvedSources } = map;
            for (let i = 0; i < decoded.length; i++) {
                const line = decoded[i];
                for (let j = 0; j < line.length; j++) {
                    const seg = line[j];
                    const generatedLine = i + 1;
                    const generatedColumn = seg[0];
                    let source = null;
                    let originalLine = null;
                    let originalColumn = null;
                    let name = null;
                    if (seg.length !== 1) {
                        source = resolvedSources[seg[1]];
                        originalLine = seg[2] + 1;
                        originalColumn = seg[3];
                    }
                    if (seg.length === 5)
                        name = names[seg[4]];
                    cb({
                        generatedLine,
                        generatedColumn,
                        source,
                        originalLine,
                        originalColumn,
                        name,
                    });
                }
            }
        };
        exports.presortedDecodedMap = (map, mapUrl) => {
            const clone = Object.assign({}, map);
            clone.mappings = [];
            const tracer = new TraceMap(clone, mapUrl);
            tracer._decoded = map.mappings;
            return tracer;
        };
        exports.decodedMap = (map) => {
            return {
                version: 3,
                file: map.file,
                names: map.names,
                sourceRoot: map.sourceRoot,
                sources: map.sources,
                sourcesContent: map.sourcesContent,
                mappings: exports.decodedMappings(map),
            };
        };
        exports.encodedMap = (map) => {
            return {
                version: 3,
                file: map.file,
                names: map.names,
                sourceRoot: map.sourceRoot,
                sources: map.sources,
                sourcesContent: map.sourcesContent,
                mappings: exports.encodedMappings(map),
            };
        };
    })();
    function traceSegmentInternal(segments, memo, line, column, bias) {
        let index = memoizedBinarySearch(segments, column, memo, line);
        if (found) {
            index = (bias === LEAST_UPPER_BOUND ? upperBound : lowerBound)(segments, column, index);
        }
        else if (bias === LEAST_UPPER_BOUND)
            index++;
        if (index === -1 || index === segments.length)
            return null;
        return segments[index];
    }

    exports.AnyMap = AnyMap;
    exports.GREATEST_LOWER_BOUND = GREATEST_LOWER_BOUND;
    exports.LEAST_UPPER_BOUND = LEAST_UPPER_BOUND;
    exports.TraceMap = TraceMap;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=trace-mapping.umd.js.map


/***/ }),

/***/ 8390:
/***/ (function(__unused_webpack_module, exports) {

(function (global, factory) {
   true ? factory(exports) :
  0;
}(this, (function (exports) { 'use strict';

  // AST walker module for Mozilla Parser API compatible trees

  // A simple walk is one where you simply specify callbacks to be
  // called on specific nodes. The last two arguments are optional. A
  // simple use would be
  //
  //     walk.simple(myTree, {
  //         Expression: function(node) { ... }
  //     });
  //
  // to do something with all expressions. All Parser API node types
  // can be used to identify node types, as well as Expression and
  // Statement, which denote categories of nodes.
  //
  // The base argument can be used to pass a custom (recursive)
  // walker, and state can be used to give this walked an initial
  // state.

  function simple(node, visitors, baseVisitor, state, override) {
    if (!baseVisitor) { baseVisitor = base
    ; }(function c(node, st, override) {
      var type = override || node.type, found = visitors[type];
      baseVisitor[type](node, st, c);
      if (found) { found(node, st); }
    })(node, state, override);
  }

  // An ancestor walk keeps an array of ancestor nodes (including the
  // current node) and passes them to the callback as third parameter
  // (and also as state parameter when no other state is present).
  function ancestor(node, visitors, baseVisitor, state, override) {
    var ancestors = [];
    if (!baseVisitor) { baseVisitor = base
    ; }(function c(node, st, override) {
      var type = override || node.type, found = visitors[type];
      var isNew = node !== ancestors[ancestors.length - 1];
      if (isNew) { ancestors.push(node); }
      baseVisitor[type](node, st, c);
      if (found) { found(node, st || ancestors, ancestors); }
      if (isNew) { ancestors.pop(); }
    })(node, state, override);
  }

  // A recursive walk is one where your functions override the default
  // walkers. They can modify and replace the state parameter that's
  // threaded through the walk, and can opt how and whether to walk
  // their child nodes (by calling their third argument on these
  // nodes).
  function recursive(node, state, funcs, baseVisitor, override) {
    var visitor = funcs ? make(funcs, baseVisitor || undefined) : baseVisitor
    ;(function c(node, st, override) {
      visitor[override || node.type](node, st, c);
    })(node, state, override);
  }

  function makeTest(test) {
    if (typeof test === "string")
      { return function (type) { return type === test; } }
    else if (!test)
      { return function () { return true; } }
    else
      { return test }
  }

  var Found = function Found(node, state) { this.node = node; this.state = state; };

  // A full walk triggers the callback on each node
  function full(node, callback, baseVisitor, state, override) {
    if (!baseVisitor) { baseVisitor = base; }
    var last
    ;(function c(node, st, override) {
      var type = override || node.type;
      baseVisitor[type](node, st, c);
      if (last !== node) {
        callback(node, st, type);
        last = node;
      }
    })(node, state, override);
  }

  // An fullAncestor walk is like an ancestor walk, but triggers
  // the callback on each node
  function fullAncestor(node, callback, baseVisitor, state) {
    if (!baseVisitor) { baseVisitor = base; }
    var ancestors = [], last
    ;(function c(node, st, override) {
      var type = override || node.type;
      var isNew = node !== ancestors[ancestors.length - 1];
      if (isNew) { ancestors.push(node); }
      baseVisitor[type](node, st, c);
      if (last !== node) {
        callback(node, st || ancestors, ancestors, type);
        last = node;
      }
      if (isNew) { ancestors.pop(); }
    })(node, state);
  }

  // Find a node with a given start, end, and type (all are optional,
  // null can be used as wildcard). Returns a {node, state} object, or
  // undefined when it doesn't find a matching node.
  function findNodeAt(node, start, end, test, baseVisitor, state) {
    if (!baseVisitor) { baseVisitor = base; }
    test = makeTest(test);
    try {
      (function c(node, st, override) {
        var type = override || node.type;
        if ((start == null || node.start <= start) &&
            (end == null || node.end >= end))
          { baseVisitor[type](node, st, c); }
        if ((start == null || node.start === start) &&
            (end == null || node.end === end) &&
            test(type, node))
          { throw new Found(node, st) }
      })(node, state);
    } catch (e) {
      if (e instanceof Found) { return e }
      throw e
    }
  }

  // Find the innermost node of a given type that contains the given
  // position. Interface similar to findNodeAt.
  function findNodeAround(node, pos, test, baseVisitor, state) {
    test = makeTest(test);
    if (!baseVisitor) { baseVisitor = base; }
    try {
      (function c(node, st, override) {
        var type = override || node.type;
        if (node.start > pos || node.end < pos) { return }
        baseVisitor[type](node, st, c);
        if (test(type, node)) { throw new Found(node, st) }
      })(node, state);
    } catch (e) {
      if (e instanceof Found) { return e }
      throw e
    }
  }

  // Find the outermost matching node after a given position.
  function findNodeAfter(node, pos, test, baseVisitor, state) {
    test = makeTest(test);
    if (!baseVisitor) { baseVisitor = base; }
    try {
      (function c(node, st, override) {
        if (node.end < pos) { return }
        var type = override || node.type;
        if (node.start >= pos && test(type, node)) { throw new Found(node, st) }
        baseVisitor[type](node, st, c);
      })(node, state);
    } catch (e) {
      if (e instanceof Found) { return e }
      throw e
    }
  }

  // Find the outermost matching node before a given position.
  function findNodeBefore(node, pos, test, baseVisitor, state) {
    test = makeTest(test);
    if (!baseVisitor) { baseVisitor = base; }
    var max
    ;(function c(node, st, override) {
      if (node.start > pos) { return }
      var type = override || node.type;
      if (node.end <= pos && (!max || max.node.end < node.end) && test(type, node))
        { max = new Found(node, st); }
      baseVisitor[type](node, st, c);
    })(node, state);
    return max
  }

  // Used to create a custom walker. Will fill in all missing node
  // type properties with the defaults.
  function make(funcs, baseVisitor) {
    var visitor = Object.create(baseVisitor || base);
    for (var type in funcs) { visitor[type] = funcs[type]; }
    return visitor
  }

  function skipThrough(node, st, c) { c(node, st); }
  function ignore(_node, _st, _c) {}

  // Node walkers.

  var base = {};

  base.Program = base.BlockStatement = base.StaticBlock = function (node, st, c) {
    for (var i = 0, list = node.body; i < list.length; i += 1)
      {
      var stmt = list[i];

      c(stmt, st, "Statement");
    }
  };
  base.Statement = skipThrough;
  base.EmptyStatement = ignore;
  base.ExpressionStatement = base.ParenthesizedExpression = base.ChainExpression =
    function (node, st, c) { return c(node.expression, st, "Expression"); };
  base.IfStatement = function (node, st, c) {
    c(node.test, st, "Expression");
    c(node.consequent, st, "Statement");
    if (node.alternate) { c(node.alternate, st, "Statement"); }
  };
  base.LabeledStatement = function (node, st, c) { return c(node.body, st, "Statement"); };
  base.BreakStatement = base.ContinueStatement = ignore;
  base.WithStatement = function (node, st, c) {
    c(node.object, st, "Expression");
    c(node.body, st, "Statement");
  };
  base.SwitchStatement = function (node, st, c) {
    c(node.discriminant, st, "Expression");
    for (var i$1 = 0, list$1 = node.cases; i$1 < list$1.length; i$1 += 1) {
      var cs = list$1[i$1];

      if (cs.test) { c(cs.test, st, "Expression"); }
      for (var i = 0, list = cs.consequent; i < list.length; i += 1)
        {
        var cons = list[i];

        c(cons, st, "Statement");
      }
    }
  };
  base.SwitchCase = function (node, st, c) {
    if (node.test) { c(node.test, st, "Expression"); }
    for (var i = 0, list = node.consequent; i < list.length; i += 1)
      {
      var cons = list[i];

      c(cons, st, "Statement");
    }
  };
  base.ReturnStatement = base.YieldExpression = base.AwaitExpression = function (node, st, c) {
    if (node.argument) { c(node.argument, st, "Expression"); }
  };
  base.ThrowStatement = base.SpreadElement =
    function (node, st, c) { return c(node.argument, st, "Expression"); };
  base.TryStatement = function (node, st, c) {
    c(node.block, st, "Statement");
    if (node.handler) { c(node.handler, st); }
    if (node.finalizer) { c(node.finalizer, st, "Statement"); }
  };
  base.CatchClause = function (node, st, c) {
    if (node.param) { c(node.param, st, "Pattern"); }
    c(node.body, st, "Statement");
  };
  base.WhileStatement = base.DoWhileStatement = function (node, st, c) {
    c(node.test, st, "Expression");
    c(node.body, st, "Statement");
  };
  base.ForStatement = function (node, st, c) {
    if (node.init) { c(node.init, st, "ForInit"); }
    if (node.test) { c(node.test, st, "Expression"); }
    if (node.update) { c(node.update, st, "Expression"); }
    c(node.body, st, "Statement");
  };
  base.ForInStatement = base.ForOfStatement = function (node, st, c) {
    c(node.left, st, "ForInit");
    c(node.right, st, "Expression");
    c(node.body, st, "Statement");
  };
  base.ForInit = function (node, st, c) {
    if (node.type === "VariableDeclaration") { c(node, st); }
    else { c(node, st, "Expression"); }
  };
  base.DebuggerStatement = ignore;

  base.FunctionDeclaration = function (node, st, c) { return c(node, st, "Function"); };
  base.VariableDeclaration = function (node, st, c) {
    for (var i = 0, list = node.declarations; i < list.length; i += 1)
      {
      var decl = list[i];

      c(decl, st);
    }
  };
  base.VariableDeclarator = function (node, st, c) {
    c(node.id, st, "Pattern");
    if (node.init) { c(node.init, st, "Expression"); }
  };

  base.Function = function (node, st, c) {
    if (node.id) { c(node.id, st, "Pattern"); }
    for (var i = 0, list = node.params; i < list.length; i += 1)
      {
      var param = list[i];

      c(param, st, "Pattern");
    }
    c(node.body, st, node.expression ? "Expression" : "Statement");
  };

  base.Pattern = function (node, st, c) {
    if (node.type === "Identifier")
      { c(node, st, "VariablePattern"); }
    else if (node.type === "MemberExpression")
      { c(node, st, "MemberPattern"); }
    else
      { c(node, st); }
  };
  base.VariablePattern = ignore;
  base.MemberPattern = skipThrough;
  base.RestElement = function (node, st, c) { return c(node.argument, st, "Pattern"); };
  base.ArrayPattern = function (node, st, c) {
    for (var i = 0, list = node.elements; i < list.length; i += 1) {
      var elt = list[i];

      if (elt) { c(elt, st, "Pattern"); }
    }
  };
  base.ObjectPattern = function (node, st, c) {
    for (var i = 0, list = node.properties; i < list.length; i += 1) {
      var prop = list[i];

      if (prop.type === "Property") {
        if (prop.computed) { c(prop.key, st, "Expression"); }
        c(prop.value, st, "Pattern");
      } else if (prop.type === "RestElement") {
        c(prop.argument, st, "Pattern");
      }
    }
  };

  base.Expression = skipThrough;
  base.ThisExpression = base.Super = base.MetaProperty = ignore;
  base.ArrayExpression = function (node, st, c) {
    for (var i = 0, list = node.elements; i < list.length; i += 1) {
      var elt = list[i];

      if (elt) { c(elt, st, "Expression"); }
    }
  };
  base.ObjectExpression = function (node, st, c) {
    for (var i = 0, list = node.properties; i < list.length; i += 1)
      {
      var prop = list[i];

      c(prop, st);
    }
  };
  base.FunctionExpression = base.ArrowFunctionExpression = base.FunctionDeclaration;
  base.SequenceExpression = function (node, st, c) {
    for (var i = 0, list = node.expressions; i < list.length; i += 1)
      {
      var expr = list[i];

      c(expr, st, "Expression");
    }
  };
  base.TemplateLiteral = function (node, st, c) {
    for (var i = 0, list = node.quasis; i < list.length; i += 1)
      {
      var quasi = list[i];

      c(quasi, st);
    }

    for (var i$1 = 0, list$1 = node.expressions; i$1 < list$1.length; i$1 += 1)
      {
      var expr = list$1[i$1];

      c(expr, st, "Expression");
    }
  };
  base.TemplateElement = ignore;
  base.UnaryExpression = base.UpdateExpression = function (node, st, c) {
    c(node.argument, st, "Expression");
  };
  base.BinaryExpression = base.LogicalExpression = function (node, st, c) {
    c(node.left, st, "Expression");
    c(node.right, st, "Expression");
  };
  base.AssignmentExpression = base.AssignmentPattern = function (node, st, c) {
    c(node.left, st, "Pattern");
    c(node.right, st, "Expression");
  };
  base.ConditionalExpression = function (node, st, c) {
    c(node.test, st, "Expression");
    c(node.consequent, st, "Expression");
    c(node.alternate, st, "Expression");
  };
  base.NewExpression = base.CallExpression = function (node, st, c) {
    c(node.callee, st, "Expression");
    if (node.arguments)
      { for (var i = 0, list = node.arguments; i < list.length; i += 1)
        {
          var arg = list[i];

          c(arg, st, "Expression");
        } }
  };
  base.MemberExpression = function (node, st, c) {
    c(node.object, st, "Expression");
    if (node.computed) { c(node.property, st, "Expression"); }
  };
  base.ExportNamedDeclaration = base.ExportDefaultDeclaration = function (node, st, c) {
    if (node.declaration)
      { c(node.declaration, st, node.type === "ExportNamedDeclaration" || node.declaration.id ? "Statement" : "Expression"); }
    if (node.source) { c(node.source, st, "Expression"); }
  };
  base.ExportAllDeclaration = function (node, st, c) {
    if (node.exported)
      { c(node.exported, st); }
    c(node.source, st, "Expression");
  };
  base.ImportDeclaration = function (node, st, c) {
    for (var i = 0, list = node.specifiers; i < list.length; i += 1)
      {
      var spec = list[i];

      c(spec, st);
    }
    c(node.source, st, "Expression");
  };
  base.ImportExpression = function (node, st, c) {
    c(node.source, st, "Expression");
  };
  base.ImportSpecifier = base.ImportDefaultSpecifier = base.ImportNamespaceSpecifier = base.Identifier = base.PrivateIdentifier = base.Literal = ignore;

  base.TaggedTemplateExpression = function (node, st, c) {
    c(node.tag, st, "Expression");
    c(node.quasi, st, "Expression");
  };
  base.ClassDeclaration = base.ClassExpression = function (node, st, c) { return c(node, st, "Class"); };
  base.Class = function (node, st, c) {
    if (node.id) { c(node.id, st, "Pattern"); }
    if (node.superClass) { c(node.superClass, st, "Expression"); }
    c(node.body, st);
  };
  base.ClassBody = function (node, st, c) {
    for (var i = 0, list = node.body; i < list.length; i += 1)
      {
      var elt = list[i];

      c(elt, st);
    }
  };
  base.MethodDefinition = base.PropertyDefinition = base.Property = function (node, st, c) {
    if (node.computed) { c(node.key, st, "Expression"); }
    if (node.value) { c(node.value, st, "Expression"); }
  };

  exports.ancestor = ancestor;
  exports.base = base;
  exports.findNodeAfter = findNodeAfter;
  exports.findNodeAround = findNodeAround;
  exports.findNodeAt = findNodeAt;
  exports.findNodeBefore = findNodeBefore;
  exports.full = full;
  exports.fullAncestor = fullAncestor;
  exports.make = make;
  exports.recursive = recursive;
  exports.simple = simple;

  Object.defineProperty(exports, '__esModule', { value: true });

})));


/***/ }),

/***/ 390:
/***/ (function(__unused_webpack_module, exports) {

(function (global, factory) {
   true ? factory(exports) :
  0;
})(this, (function (exports) { 'use strict';

  // This file was generated. Do not modify manually!
  var astralIdentifierCodes = [509, 0, 227, 0, 150, 4, 294, 9, 1368, 2, 2, 1, 6, 3, 41, 2, 5, 0, 166, 1, 574, 3, 9, 9, 370, 1, 81, 2, 71, 10, 50, 3, 123, 2, 54, 14, 32, 10, 3, 1, 11, 3, 46, 10, 8, 0, 46, 9, 7, 2, 37, 13, 2, 9, 6, 1, 45, 0, 13, 2, 49, 13, 9, 3, 2, 11, 83, 11, 7, 0, 3, 0, 158, 11, 6, 9, 7, 3, 56, 1, 2, 6, 3, 1, 3, 2, 10, 0, 11, 1, 3, 6, 4, 4, 193, 17, 10, 9, 5, 0, 82, 19, 13, 9, 214, 6, 3, 8, 28, 1, 83, 16, 16, 9, 82, 12, 9, 9, 84, 14, 5, 9, 243, 14, 166, 9, 71, 5, 2, 1, 3, 3, 2, 0, 2, 1, 13, 9, 120, 6, 3, 6, 4, 0, 29, 9, 41, 6, 2, 3, 9, 0, 10, 10, 47, 15, 406, 7, 2, 7, 17, 9, 57, 21, 2, 13, 123, 5, 4, 0, 2, 1, 2, 6, 2, 0, 9, 9, 49, 4, 2, 1, 2, 4, 9, 9, 330, 3, 10, 1, 2, 0, 49, 6, 4, 4, 14, 9, 5351, 0, 7, 14, 13835, 9, 87, 9, 39, 4, 60, 6, 26, 9, 1014, 0, 2, 54, 8, 3, 82, 0, 12, 1, 19628, 1, 4706, 45, 3, 22, 543, 4, 4, 5, 9, 7, 3, 6, 31, 3, 149, 2, 1418, 49, 513, 54, 5, 49, 9, 0, 15, 0, 23, 4, 2, 14, 1361, 6, 2, 16, 3, 6, 2, 1, 2, 4, 101, 0, 161, 6, 10, 9, 357, 0, 62, 13, 499, 13, 983, 6, 110, 6, 6, 9, 4759, 9, 787719, 239];

  // This file was generated. Do not modify manually!
  var astralIdentifierStartCodes = [0, 11, 2, 25, 2, 18, 2, 1, 2, 14, 3, 13, 35, 122, 70, 52, 268, 28, 4, 48, 48, 31, 14, 29, 6, 37, 11, 29, 3, 35, 5, 7, 2, 4, 43, 157, 19, 35, 5, 35, 5, 39, 9, 51, 13, 10, 2, 14, 2, 6, 2, 1, 2, 10, 2, 14, 2, 6, 2, 1, 68, 310, 10, 21, 11, 7, 25, 5, 2, 41, 2, 8, 70, 5, 3, 0, 2, 43, 2, 1, 4, 0, 3, 22, 11, 22, 10, 30, 66, 18, 2, 1, 11, 21, 11, 25, 71, 55, 7, 1, 65, 0, 16, 3, 2, 2, 2, 28, 43, 28, 4, 28, 36, 7, 2, 27, 28, 53, 11, 21, 11, 18, 14, 17, 111, 72, 56, 50, 14, 50, 14, 35, 349, 41, 7, 1, 79, 28, 11, 0, 9, 21, 43, 17, 47, 20, 28, 22, 13, 52, 58, 1, 3, 0, 14, 44, 33, 24, 27, 35, 30, 0, 3, 0, 9, 34, 4, 0, 13, 47, 15, 3, 22, 0, 2, 0, 36, 17, 2, 24, 20, 1, 64, 6, 2, 0, 2, 3, 2, 14, 2, 9, 8, 46, 39, 7, 3, 1, 3, 21, 2, 6, 2, 1, 2, 4, 4, 0, 19, 0, 13, 4, 159, 52, 19, 3, 21, 2, 31, 47, 21, 1, 2, 0, 185, 46, 42, 3, 37, 47, 21, 0, 60, 42, 14, 0, 72, 26, 38, 6, 186, 43, 117, 63, 32, 7, 3, 0, 3, 7, 2, 1, 2, 23, 16, 0, 2, 0, 95, 7, 3, 38, 17, 0, 2, 0, 29, 0, 11, 39, 8, 0, 22, 0, 12, 45, 20, 0, 19, 72, 264, 8, 2, 36, 18, 0, 50, 29, 113, 6, 2, 1, 2, 37, 22, 0, 26, 5, 2, 1, 2, 31, 15, 0, 328, 18, 16, 0, 2, 12, 2, 33, 125, 0, 80, 921, 103, 110, 18, 195, 2637, 96, 16, 1071, 18, 5, 4026, 582, 8634, 568, 8, 30, 18, 78, 18, 29, 19, 47, 17, 3, 32, 20, 6, 18, 689, 63, 129, 74, 6, 0, 67, 12, 65, 1, 2, 0, 29, 6135, 9, 1237, 43, 8, 8936, 3, 2, 6, 2, 1, 2, 290, 16, 0, 30, 2, 3, 0, 15, 3, 9, 395, 2309, 106, 6, 12, 4, 8, 8, 9, 5991, 84, 2, 70, 2, 1, 3, 0, 3, 1, 3, 3, 2, 11, 2, 0, 2, 6, 2, 64, 2, 3, 3, 7, 2, 6, 2, 27, 2, 3, 2, 4, 2, 0, 4, 6, 2, 339, 3, 24, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 7, 1845, 30, 7, 5, 262, 61, 147, 44, 11, 6, 17, 0, 322, 29, 19, 43, 485, 27, 757, 6, 2, 3, 2, 1, 2, 14, 2, 196, 60, 67, 8, 0, 1205, 3, 2, 26, 2, 1, 2, 0, 3, 0, 2, 9, 2, 3, 2, 0, 2, 0, 7, 0, 5, 0, 2, 0, 2, 0, 2, 2, 2, 1, 2, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 3, 3, 2, 6, 2, 3, 2, 3, 2, 0, 2, 9, 2, 16, 6, 2, 2, 4, 2, 16, 4421, 42719, 33, 4153, 7, 221, 3, 5761, 15, 7472, 3104, 541, 1507, 4938, 6, 4191];

  // This file was generated. Do not modify manually!
  var nonASCIIidentifierChars = "\u200c\u200d\xb7\u0300-\u036f\u0387\u0483-\u0487\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u0669\u0670\u06d6-\u06dc\u06df-\u06e4\u06e7\u06e8\u06ea-\u06ed\u06f0-\u06f9\u0711\u0730-\u074a\u07a6-\u07b0\u07c0-\u07c9\u07eb-\u07f3\u07fd\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0859-\u085b\u0898-\u089f\u08ca-\u08e1\u08e3-\u0903\u093a-\u093c\u093e-\u094f\u0951-\u0957\u0962\u0963\u0966-\u096f\u0981-\u0983\u09bc\u09be-\u09c4\u09c7\u09c8\u09cb-\u09cd\u09d7\u09e2\u09e3\u09e6-\u09ef\u09fe\u0a01-\u0a03\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a66-\u0a71\u0a75\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ae2\u0ae3\u0ae6-\u0aef\u0afa-\u0aff\u0b01-\u0b03\u0b3c\u0b3e-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b55-\u0b57\u0b62\u0b63\u0b66-\u0b6f\u0b82\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0be6-\u0bef\u0c00-\u0c04\u0c3c\u0c3e-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0c66-\u0c6f\u0c81-\u0c83\u0cbc\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0ce6-\u0cef\u0cf3\u0d00-\u0d03\u0d3b\u0d3c\u0d3e-\u0d44\u0d46-\u0d48\u0d4a-\u0d4d\u0d57\u0d62\u0d63\u0d66-\u0d6f\u0d81-\u0d83\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0de6-\u0def\u0df2\u0df3\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0e50-\u0e59\u0eb1\u0eb4-\u0ebc\u0ec8-\u0ece\u0ed0-\u0ed9\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f3e\u0f3f\u0f71-\u0f84\u0f86\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u102b-\u103e\u1040-\u1049\u1056-\u1059\u105e-\u1060\u1062-\u1064\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f-\u109d\u135d-\u135f\u1369-\u1371\u1712-\u1715\u1732-\u1734\u1752\u1753\u1772\u1773\u17b4-\u17d3\u17dd\u17e0-\u17e9\u180b-\u180d\u180f-\u1819\u18a9\u1920-\u192b\u1930-\u193b\u1946-\u194f\u19d0-\u19da\u1a17-\u1a1b\u1a55-\u1a5e\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1ab0-\u1abd\u1abf-\u1ace\u1b00-\u1b04\u1b34-\u1b44\u1b50-\u1b59\u1b6b-\u1b73\u1b80-\u1b82\u1ba1-\u1bad\u1bb0-\u1bb9\u1be6-\u1bf3\u1c24-\u1c37\u1c40-\u1c49\u1c50-\u1c59\u1cd0-\u1cd2\u1cd4-\u1ce8\u1ced\u1cf4\u1cf7-\u1cf9\u1dc0-\u1dff\u203f\u2040\u2054\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2cef-\u2cf1\u2d7f\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua620-\ua629\ua66f\ua674-\ua67d\ua69e\ua69f\ua6f0\ua6f1\ua802\ua806\ua80b\ua823-\ua827\ua82c\ua880\ua881\ua8b4-\ua8c5\ua8d0-\ua8d9\ua8e0-\ua8f1\ua8ff-\ua909\ua926-\ua92d\ua947-\ua953\ua980-\ua983\ua9b3-\ua9c0\ua9d0-\ua9d9\ua9e5\ua9f0-\ua9f9\uaa29-\uaa36\uaa43\uaa4c\uaa4d\uaa50-\uaa59\uaa7b-\uaa7d\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uaaeb-\uaaef\uaaf5\uaaf6\uabe3-\uabea\uabec\uabed\uabf0-\uabf9\ufb1e\ufe00-\ufe0f\ufe20-\ufe2f\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff3f";

  // This file was generated. Do not modify manually!
  var nonASCIIidentifierStartChars = "\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u037f\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u052f\u0531-\u0556\u0559\u0560-\u0588\u05d0-\u05ea\u05ef-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u0860-\u086a\u0870-\u0887\u0889-\u088e\u08a0-\u08c9\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u09fc\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0af9\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c39\u0c3d\u0c58-\u0c5a\u0c5d\u0c60\u0c61\u0c80\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cdd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d04-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d54-\u0d56\u0d5f-\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e86-\u0e8a\u0e8c-\u0ea3\u0ea5\u0ea7-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f5\u13f8-\u13fd\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f8\u1700-\u1711\u171f-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1878\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191e\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19b0-\u19c9\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4c\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1c80-\u1c88\u1c90-\u1cba\u1cbd-\u1cbf\u1ce9-\u1cec\u1cee-\u1cf3\u1cf5\u1cf6\u1cfa\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2118-\u211d\u2124\u2126\u2128\u212a-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309b-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312f\u3131-\u318e\u31a0-\u31bf\u31f0-\u31ff\u3400-\u4dbf\u4e00-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua69d\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua7ca\ua7d0\ua7d1\ua7d3\ua7d5-\ua7d9\ua7f2-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua8fd\ua8fe\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\ua9e0-\ua9e4\ua9e6-\ua9ef\ua9fa-\ua9fe\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa7e-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uab30-\uab5a\uab5c-\uab69\uab70-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc";

  // These are a run-length and offset encoded representation of the
  // >0xffff code points that are a valid part of identifiers. The
  // offset starts at 0x10000, and each pair of numbers represents an
  // offset to the next range, and then a size of the range.

  // Reserved word lists for various dialects of the language

  var reservedWords = {
    3: "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile",
    5: "class enum extends super const export import",
    6: "enum",
    strict: "implements interface let package private protected public static yield",
    strictBind: "eval arguments"
  };

  // And the keywords

  var ecma5AndLessKeywords = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this";

  var keywords$1 = {
    5: ecma5AndLessKeywords,
    "5module": ecma5AndLessKeywords + " export import",
    6: ecma5AndLessKeywords + " const class extends export import super"
  };

  var keywordRelationalOperator = /^in(stanceof)?$/;

  // ## Character categories

  var nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
  var nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");

  // This has a complexity linear to the value of the code. The
  // assumption is that looking up astral identifier characters is
  // rare.
  function isInAstralSet(code, set) {
    var pos = 0x10000;
    for (var i = 0; i < set.length; i += 2) {
      pos += set[i];
      if (pos > code) { return false }
      pos += set[i + 1];
      if (pos >= code) { return true }
    }
    return false
  }

  // Test whether a given character code starts an identifier.

  function isIdentifierStart(code, astral) {
    if (code < 65) { return code === 36 }
    if (code < 91) { return true }
    if (code < 97) { return code === 95 }
    if (code < 123) { return true }
    if (code <= 0xffff) { return code >= 0xaa && nonASCIIidentifierStart.test(String.fromCharCode(code)) }
    if (astral === false) { return false }
    return isInAstralSet(code, astralIdentifierStartCodes)
  }

  // Test whether a given character is part of an identifier.

  function isIdentifierChar(code, astral) {
    if (code < 48) { return code === 36 }
    if (code < 58) { return true }
    if (code < 65) { return false }
    if (code < 91) { return true }
    if (code < 97) { return code === 95 }
    if (code < 123) { return true }
    if (code <= 0xffff) { return code >= 0xaa && nonASCIIidentifier.test(String.fromCharCode(code)) }
    if (astral === false) { return false }
    return isInAstralSet(code, astralIdentifierStartCodes) || isInAstralSet(code, astralIdentifierCodes)
  }

  // ## Token types

  // The assignment of fine-grained, information-carrying type objects
  // allows the tokenizer to store the information it has about a
  // token in a way that is very cheap for the parser to look up.

  // All token type variables start with an underscore, to make them
  // easy to recognize.

  // The `beforeExpr` property is used to disambiguate between regular
  // expressions and divisions. It is set on all token types that can
  // be followed by an expression (thus, a slash after them would be a
  // regular expression).
  //
  // The `startsExpr` property is used to check if the token ends a
  // `yield` expression. It is set on all token types that either can
  // directly start an expression (like a quotation mark) or can
  // continue an expression (like the body of a string).
  //
  // `isLoop` marks a keyword as starting a loop, which is important
  // to know when parsing a label, in order to allow or disallow
  // continue jumps to that label.

  var TokenType = function TokenType(label, conf) {
    if ( conf === void 0 ) conf = {};

    this.label = label;
    this.keyword = conf.keyword;
    this.beforeExpr = !!conf.beforeExpr;
    this.startsExpr = !!conf.startsExpr;
    this.isLoop = !!conf.isLoop;
    this.isAssign = !!conf.isAssign;
    this.prefix = !!conf.prefix;
    this.postfix = !!conf.postfix;
    this.binop = conf.binop || null;
    this.updateContext = null;
  };

  function binop(name, prec) {
    return new TokenType(name, {beforeExpr: true, binop: prec})
  }
  var beforeExpr = {beforeExpr: true}, startsExpr = {startsExpr: true};

  // Map keyword names to token types.

  var keywords = {};

  // Succinct definitions of keyword token types
  function kw(name, options) {
    if ( options === void 0 ) options = {};

    options.keyword = name;
    return keywords[name] = new TokenType(name, options)
  }

  var types$1 = {
    num: new TokenType("num", startsExpr),
    regexp: new TokenType("regexp", startsExpr),
    string: new TokenType("string", startsExpr),
    name: new TokenType("name", startsExpr),
    privateId: new TokenType("privateId", startsExpr),
    eof: new TokenType("eof"),

    // Punctuation token types.
    bracketL: new TokenType("[", {beforeExpr: true, startsExpr: true}),
    bracketR: new TokenType("]"),
    braceL: new TokenType("{", {beforeExpr: true, startsExpr: true}),
    braceR: new TokenType("}"),
    parenL: new TokenType("(", {beforeExpr: true, startsExpr: true}),
    parenR: new TokenType(")"),
    comma: new TokenType(",", beforeExpr),
    semi: new TokenType(";", beforeExpr),
    colon: new TokenType(":", beforeExpr),
    dot: new TokenType("."),
    question: new TokenType("?", beforeExpr),
    questionDot: new TokenType("?."),
    arrow: new TokenType("=>", beforeExpr),
    template: new TokenType("template"),
    invalidTemplate: new TokenType("invalidTemplate"),
    ellipsis: new TokenType("...", beforeExpr),
    backQuote: new TokenType("`", startsExpr),
    dollarBraceL: new TokenType("${", {beforeExpr: true, startsExpr: true}),

    // Operators. These carry several kinds of properties to help the
    // parser use them properly (the presence of these properties is
    // what categorizes them as operators).
    //
    // `binop`, when present, specifies that this operator is a binary
    // operator, and will refer to its precedence.
    //
    // `prefix` and `postfix` mark the operator as a prefix or postfix
    // unary operator.
    //
    // `isAssign` marks all of `=`, `+=`, `-=` etcetera, which act as
    // binary operators with a very low precedence, that should result
    // in AssignmentExpression nodes.

    eq: new TokenType("=", {beforeExpr: true, isAssign: true}),
    assign: new TokenType("_=", {beforeExpr: true, isAssign: true}),
    incDec: new TokenType("++/--", {prefix: true, postfix: true, startsExpr: true}),
    prefix: new TokenType("!/~", {beforeExpr: true, prefix: true, startsExpr: true}),
    logicalOR: binop("||", 1),
    logicalAND: binop("&&", 2),
    bitwiseOR: binop("|", 3),
    bitwiseXOR: binop("^", 4),
    bitwiseAND: binop("&", 5),
    equality: binop("==/!=/===/!==", 6),
    relational: binop("</>/<=/>=", 7),
    bitShift: binop("<</>>/>>>", 8),
    plusMin: new TokenType("+/-", {beforeExpr: true, binop: 9, prefix: true, startsExpr: true}),
    modulo: binop("%", 10),
    star: binop("*", 10),
    slash: binop("/", 10),
    starstar: new TokenType("**", {beforeExpr: true}),
    coalesce: binop("??", 1),

    // Keyword token types.
    _break: kw("break"),
    _case: kw("case", beforeExpr),
    _catch: kw("catch"),
    _continue: kw("continue"),
    _debugger: kw("debugger"),
    _default: kw("default", beforeExpr),
    _do: kw("do", {isLoop: true, beforeExpr: true}),
    _else: kw("else", beforeExpr),
    _finally: kw("finally"),
    _for: kw("for", {isLoop: true}),
    _function: kw("function", startsExpr),
    _if: kw("if"),
    _return: kw("return", beforeExpr),
    _switch: kw("switch"),
    _throw: kw("throw", beforeExpr),
    _try: kw("try"),
    _var: kw("var"),
    _const: kw("const"),
    _while: kw("while", {isLoop: true}),
    _with: kw("with"),
    _new: kw("new", {beforeExpr: true, startsExpr: true}),
    _this: kw("this", startsExpr),
    _super: kw("super", startsExpr),
    _class: kw("class", startsExpr),
    _extends: kw("extends", beforeExpr),
    _export: kw("export"),
    _import: kw("import", startsExpr),
    _null: kw("null", startsExpr),
    _true: kw("true", startsExpr),
    _false: kw("false", startsExpr),
    _in: kw("in", {beforeExpr: true, binop: 7}),
    _instanceof: kw("instanceof", {beforeExpr: true, binop: 7}),
    _typeof: kw("typeof", {beforeExpr: true, prefix: true, startsExpr: true}),
    _void: kw("void", {beforeExpr: true, prefix: true, startsExpr: true}),
    _delete: kw("delete", {beforeExpr: true, prefix: true, startsExpr: true})
  };

  // Matches a whole line break (where CRLF is considered a single
  // line break). Used to count lines.

  var lineBreak = /\r\n?|\n|\u2028|\u2029/;
  var lineBreakG = new RegExp(lineBreak.source, "g");

  function isNewLine(code) {
    return code === 10 || code === 13 || code === 0x2028 || code === 0x2029
  }

  function nextLineBreak(code, from, end) {
    if ( end === void 0 ) end = code.length;

    for (var i = from; i < end; i++) {
      var next = code.charCodeAt(i);
      if (isNewLine(next))
        { return i < end - 1 && next === 13 && code.charCodeAt(i + 1) === 10 ? i + 2 : i + 1 }
    }
    return -1
  }

  var nonASCIIwhitespace = /[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/;

  var skipWhiteSpace = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g;

  var ref = Object.prototype;
  var hasOwnProperty = ref.hasOwnProperty;
  var toString = ref.toString;

  var hasOwn = Object.hasOwn || (function (obj, propName) { return (
    hasOwnProperty.call(obj, propName)
  ); });

  var isArray = Array.isArray || (function (obj) { return (
    toString.call(obj) === "[object Array]"
  ); });

  function wordsRegexp(words) {
    return new RegExp("^(?:" + words.replace(/ /g, "|") + ")$")
  }

  function codePointToString(code) {
    // UTF-16 Decoding
    if (code <= 0xFFFF) { return String.fromCharCode(code) }
    code -= 0x10000;
    return String.fromCharCode((code >> 10) + 0xD800, (code & 1023) + 0xDC00)
  }

  var loneSurrogate = /(?:[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/;

  // These are used when `options.locations` is on, for the
  // `startLoc` and `endLoc` properties.

  var Position = function Position(line, col) {
    this.line = line;
    this.column = col;
  };

  Position.prototype.offset = function offset (n) {
    return new Position(this.line, this.column + n)
  };

  var SourceLocation = function SourceLocation(p, start, end) {
    this.start = start;
    this.end = end;
    if (p.sourceFile !== null) { this.source = p.sourceFile; }
  };

  // The `getLineInfo` function is mostly useful when the
  // `locations` option is off (for performance reasons) and you
  // want to find the line/column position for a given character
  // offset. `input` should be the code string that the offset refers
  // into.

  function getLineInfo(input, offset) {
    for (var line = 1, cur = 0;;) {
      var nextBreak = nextLineBreak(input, cur, offset);
      if (nextBreak < 0) { return new Position(line, offset - cur) }
      ++line;
      cur = nextBreak;
    }
  }

  // A second argument must be given to configure the parser process.
  // These options are recognized (only `ecmaVersion` is required):

  var defaultOptions = {
    // `ecmaVersion` indicates the ECMAScript version to parse. Must be
    // either 3, 5, 6 (or 2015), 7 (2016), 8 (2017), 9 (2018), 10
    // (2019), 11 (2020), 12 (2021), 13 (2022), 14 (2023), or `"latest"`
    // (the latest version the library supports). This influences
    // support for strict mode, the set of reserved words, and support
    // for new syntax features.
    ecmaVersion: null,
    // `sourceType` indicates the mode the code should be parsed in.
    // Can be either `"script"` or `"module"`. This influences global
    // strict mode and parsing of `import` and `export` declarations.
    sourceType: "script",
    // `onInsertedSemicolon` can be a callback that will be called
    // when a semicolon is automatically inserted. It will be passed
    // the position of the comma as an offset, and if `locations` is
    // enabled, it is given the location as a `{line, column}` object
    // as second argument.
    onInsertedSemicolon: null,
    // `onTrailingComma` is similar to `onInsertedSemicolon`, but for
    // trailing commas.
    onTrailingComma: null,
    // By default, reserved words are only enforced if ecmaVersion >= 5.
    // Set `allowReserved` to a boolean value to explicitly turn this on
    // an off. When this option has the value "never", reserved words
    // and keywords can also not be used as property names.
    allowReserved: null,
    // When enabled, a return at the top level is not considered an
    // error.
    allowReturnOutsideFunction: false,
    // When enabled, import/export statements are not constrained to
    // appearing at the top of the program, and an import.meta expression
    // in a script isn't considered an error.
    allowImportExportEverywhere: false,
    // By default, await identifiers are allowed to appear at the top-level scope only if ecmaVersion >= 2022.
    // When enabled, await identifiers are allowed to appear at the top-level scope,
    // but they are still not allowed in non-async functions.
    allowAwaitOutsideFunction: null,
    // When enabled, super identifiers are not constrained to
    // appearing in methods and do not raise an error when they appear elsewhere.
    allowSuperOutsideMethod: null,
    // When enabled, hashbang directive in the beginning of file is
    // allowed and treated as a line comment. Enabled by default when
    // `ecmaVersion` >= 2023.
    allowHashBang: false,
    // By default, the parser will verify that private properties are
    // only used in places where they are valid and have been declared.
    // Set this to false to turn such checks off.
    checkPrivateFields: true,
    // When `locations` is on, `loc` properties holding objects with
    // `start` and `end` properties in `{line, column}` form (with
    // line being 1-based and column 0-based) will be attached to the
    // nodes.
    locations: false,
    // A function can be passed as `onToken` option, which will
    // cause Acorn to call that function with object in the same
    // format as tokens returned from `tokenizer().getToken()`. Note
    // that you are not allowed to call the parser from the
    // callback—that will corrupt its internal state.
    onToken: null,
    // A function can be passed as `onComment` option, which will
    // cause Acorn to call that function with `(block, text, start,
    // end)` parameters whenever a comment is skipped. `block` is a
    // boolean indicating whether this is a block (`/* */`) comment,
    // `text` is the content of the comment, and `start` and `end` are
    // character offsets that denote the start and end of the comment.
    // When the `locations` option is on, two more parameters are
    // passed, the full `{line, column}` locations of the start and
    // end of the comments. Note that you are not allowed to call the
    // parser from the callback—that will corrupt its internal state.
    onComment: null,
    // Nodes have their start and end characters offsets recorded in
    // `start` and `end` properties (directly on the node, rather than
    // the `loc` object, which holds line/column data. To also add a
    // [semi-standardized][range] `range` property holding a `[start,
    // end]` array with the same numbers, set the `ranges` option to
    // `true`.
    //
    // [range]: https://bugzilla.mozilla.org/show_bug.cgi?id=745678
    ranges: false,
    // It is possible to parse multiple files into a single AST by
    // passing the tree produced by parsing the first file as
    // `program` option in subsequent parses. This will add the
    // toplevel forms of the parsed file to the `Program` (top) node
    // of an existing parse tree.
    program: null,
    // When `locations` is on, you can pass this to record the source
    // file in every node's `loc` object.
    sourceFile: null,
    // This value, if given, is stored in every node, whether
    // `locations` is on or off.
    directSourceFile: null,
    // When enabled, parenthesized expressions are represented by
    // (non-standard) ParenthesizedExpression nodes
    preserveParens: false
  };

  // Interpret and default an options object

  var warnedAboutEcmaVersion = false;

  function getOptions(opts) {
    var options = {};

    for (var opt in defaultOptions)
      { options[opt] = opts && hasOwn(opts, opt) ? opts[opt] : defaultOptions[opt]; }

    if (options.ecmaVersion === "latest") {
      options.ecmaVersion = 1e8;
    } else if (options.ecmaVersion == null) {
      if (!warnedAboutEcmaVersion && typeof console === "object" && console.warn) {
        warnedAboutEcmaVersion = true;
        console.warn("Since Acorn 8.0.0, options.ecmaVersion is required.\nDefaulting to 2020, but this will stop working in the future.");
      }
      options.ecmaVersion = 11;
    } else if (options.ecmaVersion >= 2015) {
      options.ecmaVersion -= 2009;
    }

    if (options.allowReserved == null)
      { options.allowReserved = options.ecmaVersion < 5; }

    if (!opts || opts.allowHashBang == null)
      { options.allowHashBang = options.ecmaVersion >= 14; }

    if (isArray(options.onToken)) {
      var tokens = options.onToken;
      options.onToken = function (token) { return tokens.push(token); };
    }
    if (isArray(options.onComment))
      { options.onComment = pushComment(options, options.onComment); }

    return options
  }

  function pushComment(options, array) {
    return function(block, text, start, end, startLoc, endLoc) {
      var comment = {
        type: block ? "Block" : "Line",
        value: text,
        start: start,
        end: end
      };
      if (options.locations)
        { comment.loc = new SourceLocation(this, startLoc, endLoc); }
      if (options.ranges)
        { comment.range = [start, end]; }
      array.push(comment);
    }
  }

  // Each scope gets a bitset that may contain these flags
  var
      SCOPE_TOP = 1,
      SCOPE_FUNCTION = 2,
      SCOPE_ASYNC = 4,
      SCOPE_GENERATOR = 8,
      SCOPE_ARROW = 16,
      SCOPE_SIMPLE_CATCH = 32,
      SCOPE_SUPER = 64,
      SCOPE_DIRECT_SUPER = 128,
      SCOPE_CLASS_STATIC_BLOCK = 256,
      SCOPE_VAR = SCOPE_TOP | SCOPE_FUNCTION | SCOPE_CLASS_STATIC_BLOCK;

  function functionFlags(async, generator) {
    return SCOPE_FUNCTION | (async ? SCOPE_ASYNC : 0) | (generator ? SCOPE_GENERATOR : 0)
  }

  // Used in checkLVal* and declareName to determine the type of a binding
  var
      BIND_NONE = 0, // Not a binding
      BIND_VAR = 1, // Var-style binding
      BIND_LEXICAL = 2, // Let- or const-style binding
      BIND_FUNCTION = 3, // Function declaration
      BIND_SIMPLE_CATCH = 4, // Simple (identifier pattern) catch binding
      BIND_OUTSIDE = 5; // Special case for function names as bound inside the function

  var Parser = function Parser(options, input, startPos) {
    this.options = options = getOptions(options);
    this.sourceFile = options.sourceFile;
    this.keywords = wordsRegexp(keywords$1[options.ecmaVersion >= 6 ? 6 : options.sourceType === "module" ? "5module" : 5]);
    var reserved = "";
    if (options.allowReserved !== true) {
      reserved = reservedWords[options.ecmaVersion >= 6 ? 6 : options.ecmaVersion === 5 ? 5 : 3];
      if (options.sourceType === "module") { reserved += " await"; }
    }
    this.reservedWords = wordsRegexp(reserved);
    var reservedStrict = (reserved ? reserved + " " : "") + reservedWords.strict;
    this.reservedWordsStrict = wordsRegexp(reservedStrict);
    this.reservedWordsStrictBind = wordsRegexp(reservedStrict + " " + reservedWords.strictBind);
    this.input = String(input);

    // Used to signal to callers of `readWord1` whether the word
    // contained any escape sequences. This is needed because words with
    // escape sequences must not be interpreted as keywords.
    this.containsEsc = false;

    // Set up token state

    // The current position of the tokenizer in the input.
    if (startPos) {
      this.pos = startPos;
      this.lineStart = this.input.lastIndexOf("\n", startPos - 1) + 1;
      this.curLine = this.input.slice(0, this.lineStart).split(lineBreak).length;
    } else {
      this.pos = this.lineStart = 0;
      this.curLine = 1;
    }

    // Properties of the current token:
    // Its type
    this.type = types$1.eof;
    // For tokens that include more information than their type, the value
    this.value = null;
    // Its start and end offset
    this.start = this.end = this.pos;
    // And, if locations are used, the {line, column} object
    // corresponding to those offsets
    this.startLoc = this.endLoc = this.curPosition();

    // Position information for the previous token
    this.lastTokEndLoc = this.lastTokStartLoc = null;
    this.lastTokStart = this.lastTokEnd = this.pos;

    // The context stack is used to superficially track syntactic
    // context to predict whether a regular expression is allowed in a
    // given position.
    this.context = this.initialContext();
    this.exprAllowed = true;

    // Figure out if it's a module code.
    this.inModule = options.sourceType === "module";
    this.strict = this.inModule || this.strictDirective(this.pos);

    // Used to signify the start of a potential arrow function
    this.potentialArrowAt = -1;
    this.potentialArrowInForAwait = false;

    // Positions to delayed-check that yield/await does not exist in default parameters.
    this.yieldPos = this.awaitPos = this.awaitIdentPos = 0;
    // Labels in scope.
    this.labels = [];
    // Thus-far undefined exports.
    this.undefinedExports = Object.create(null);

    // If enabled, skip leading hashbang line.
    if (this.pos === 0 && options.allowHashBang && this.input.slice(0, 2) === "#!")
      { this.skipLineComment(2); }

    // Scope tracking for duplicate variable names (see scope.js)
    this.scopeStack = [];
    this.enterScope(SCOPE_TOP);

    // For RegExp validation
    this.regexpState = null;

    // The stack of private names.
    // Each element has two properties: 'declared' and 'used'.
    // When it exited from the outermost class definition, all used private names must be declared.
    this.privateNameStack = [];
  };

  var prototypeAccessors = { inFunction: { configurable: true },inGenerator: { configurable: true },inAsync: { configurable: true },canAwait: { configurable: true },allowSuper: { configurable: true },allowDirectSuper: { configurable: true },treatFunctionsAsVar: { configurable: true },allowNewDotTarget: { configurable: true },inClassStaticBlock: { configurable: true } };

  Parser.prototype.parse = function parse () {
    var node = this.options.program || this.startNode();
    this.nextToken();
    return this.parseTopLevel(node)
  };

  prototypeAccessors.inFunction.get = function () { return (this.currentVarScope().flags & SCOPE_FUNCTION) > 0 };

  prototypeAccessors.inGenerator.get = function () { return (this.currentVarScope().flags & SCOPE_GENERATOR) > 0 && !this.currentVarScope().inClassFieldInit };

  prototypeAccessors.inAsync.get = function () { return (this.currentVarScope().flags & SCOPE_ASYNC) > 0 && !this.currentVarScope().inClassFieldInit };

  prototypeAccessors.canAwait.get = function () {
    for (var i = this.scopeStack.length - 1; i >= 0; i--) {
      var scope = this.scopeStack[i];
      if (scope.inClassFieldInit || scope.flags & SCOPE_CLASS_STATIC_BLOCK) { return false }
      if (scope.flags & SCOPE_FUNCTION) { return (scope.flags & SCOPE_ASYNC) > 0 }
    }
    return (this.inModule && this.options.ecmaVersion >= 13) || this.options.allowAwaitOutsideFunction
  };

  prototypeAccessors.allowSuper.get = function () {
    var ref = this.currentThisScope();
      var flags = ref.flags;
      var inClassFieldInit = ref.inClassFieldInit;
    return (flags & SCOPE_SUPER) > 0 || inClassFieldInit || this.options.allowSuperOutsideMethod
  };

  prototypeAccessors.allowDirectSuper.get = function () { return (this.currentThisScope().flags & SCOPE_DIRECT_SUPER) > 0 };

  prototypeAccessors.treatFunctionsAsVar.get = function () { return this.treatFunctionsAsVarInScope(this.currentScope()) };

  prototypeAccessors.allowNewDotTarget.get = function () {
    var ref = this.currentThisScope();
      var flags = ref.flags;
      var inClassFieldInit = ref.inClassFieldInit;
    return (flags & (SCOPE_FUNCTION | SCOPE_CLASS_STATIC_BLOCK)) > 0 || inClassFieldInit
  };

  prototypeAccessors.inClassStaticBlock.get = function () {
    return (this.currentVarScope().flags & SCOPE_CLASS_STATIC_BLOCK) > 0
  };

  Parser.extend = function extend () {
      var plugins = [], len = arguments.length;
      while ( len-- ) plugins[ len ] = arguments[ len ];

    var cls = this;
    for (var i = 0; i < plugins.length; i++) { cls = plugins[i](cls); }
    return cls
  };

  Parser.parse = function parse (input, options) {
    return new this(options, input).parse()
  };

  Parser.parseExpressionAt = function parseExpressionAt (input, pos, options) {
    var parser = new this(options, input, pos);
    parser.nextToken();
    return parser.parseExpression()
  };

  Parser.tokenizer = function tokenizer (input, options) {
    return new this(options, input)
  };

  Object.defineProperties( Parser.prototype, prototypeAccessors );

  var pp$9 = Parser.prototype;

  // ## Parser utilities

  var literal = /^(?:'((?:\\.|[^'\\])*?)'|"((?:\\.|[^"\\])*?)")/;
  pp$9.strictDirective = function(start) {
    if (this.options.ecmaVersion < 5) { return false }
    for (;;) {
      // Try to find string literal.
      skipWhiteSpace.lastIndex = start;
      start += skipWhiteSpace.exec(this.input)[0].length;
      var match = literal.exec(this.input.slice(start));
      if (!match) { return false }
      if ((match[1] || match[2]) === "use strict") {
        skipWhiteSpace.lastIndex = start + match[0].length;
        var spaceAfter = skipWhiteSpace.exec(this.input), end = spaceAfter.index + spaceAfter[0].length;
        var next = this.input.charAt(end);
        return next === ";" || next === "}" ||
          (lineBreak.test(spaceAfter[0]) &&
           !(/[(`.[+\-/*%<>=,?^&]/.test(next) || next === "!" && this.input.charAt(end + 1) === "="))
      }
      start += match[0].length;

      // Skip semicolon, if any.
      skipWhiteSpace.lastIndex = start;
      start += skipWhiteSpace.exec(this.input)[0].length;
      if (this.input[start] === ";")
        { start++; }
    }
  };

  // Predicate that tests whether the next token is of the given
  // type, and if yes, consumes it as a side effect.

  pp$9.eat = function(type) {
    if (this.type === type) {
      this.next();
      return true
    } else {
      return false
    }
  };

  // Tests whether parsed token is a contextual keyword.

  pp$9.isContextual = function(name) {
    return this.type === types$1.name && this.value === name && !this.containsEsc
  };

  // Consumes contextual keyword if possible.

  pp$9.eatContextual = function(name) {
    if (!this.isContextual(name)) { return false }
    this.next();
    return true
  };

  // Asserts that following token is given contextual keyword.

  pp$9.expectContextual = function(name) {
    if (!this.eatContextual(name)) { this.unexpected(); }
  };

  // Test whether a semicolon can be inserted at the current position.

  pp$9.canInsertSemicolon = function() {
    return this.type === types$1.eof ||
      this.type === types$1.braceR ||
      lineBreak.test(this.input.slice(this.lastTokEnd, this.start))
  };

  pp$9.insertSemicolon = function() {
    if (this.canInsertSemicolon()) {
      if (this.options.onInsertedSemicolon)
        { this.options.onInsertedSemicolon(this.lastTokEnd, this.lastTokEndLoc); }
      return true
    }
  };

  // Consume a semicolon, or, failing that, see if we are allowed to
  // pretend that there is a semicolon at this position.

  pp$9.semicolon = function() {
    if (!this.eat(types$1.semi) && !this.insertSemicolon()) { this.unexpected(); }
  };

  pp$9.afterTrailingComma = function(tokType, notNext) {
    if (this.type === tokType) {
      if (this.options.onTrailingComma)
        { this.options.onTrailingComma(this.lastTokStart, this.lastTokStartLoc); }
      if (!notNext)
        { this.next(); }
      return true
    }
  };

  // Expect a token of a given type. If found, consume it, otherwise,
  // raise an unexpected token error.

  pp$9.expect = function(type) {
    this.eat(type) || this.unexpected();
  };

  // Raise an unexpected token error.

  pp$9.unexpected = function(pos) {
    this.raise(pos != null ? pos : this.start, "Unexpected token");
  };

  var DestructuringErrors = function DestructuringErrors() {
    this.shorthandAssign =
    this.trailingComma =
    this.parenthesizedAssign =
    this.parenthesizedBind =
    this.doubleProto =
      -1;
  };

  pp$9.checkPatternErrors = function(refDestructuringErrors, isAssign) {
    if (!refDestructuringErrors) { return }
    if (refDestructuringErrors.trailingComma > -1)
      { this.raiseRecoverable(refDestructuringErrors.trailingComma, "Comma is not permitted after the rest element"); }
    var parens = isAssign ? refDestructuringErrors.parenthesizedAssign : refDestructuringErrors.parenthesizedBind;
    if (parens > -1) { this.raiseRecoverable(parens, isAssign ? "Assigning to rvalue" : "Parenthesized pattern"); }
  };

  pp$9.checkExpressionErrors = function(refDestructuringErrors, andThrow) {
    if (!refDestructuringErrors) { return false }
    var shorthandAssign = refDestructuringErrors.shorthandAssign;
    var doubleProto = refDestructuringErrors.doubleProto;
    if (!andThrow) { return shorthandAssign >= 0 || doubleProto >= 0 }
    if (shorthandAssign >= 0)
      { this.raise(shorthandAssign, "Shorthand property assignments are valid only in destructuring patterns"); }
    if (doubleProto >= 0)
      { this.raiseRecoverable(doubleProto, "Redefinition of __proto__ property"); }
  };

  pp$9.checkYieldAwaitInDefaultParams = function() {
    if (this.yieldPos && (!this.awaitPos || this.yieldPos < this.awaitPos))
      { this.raise(this.yieldPos, "Yield expression cannot be a default value"); }
    if (this.awaitPos)
      { this.raise(this.awaitPos, "Await expression cannot be a default value"); }
  };

  pp$9.isSimpleAssignTarget = function(expr) {
    if (expr.type === "ParenthesizedExpression")
      { return this.isSimpleAssignTarget(expr.expression) }
    return expr.type === "Identifier" || expr.type === "MemberExpression"
  };

  var pp$8 = Parser.prototype;

  // ### Statement parsing

  // Parse a program. Initializes the parser, reads any number of
  // statements, and wraps them in a Program node.  Optionally takes a
  // `program` argument.  If present, the statements will be appended
  // to its body instead of creating a new node.

  pp$8.parseTopLevel = function(node) {
    var exports = Object.create(null);
    if (!node.body) { node.body = []; }
    while (this.type !== types$1.eof) {
      var stmt = this.parseStatement(null, true, exports);
      node.body.push(stmt);
    }
    if (this.inModule)
      { for (var i = 0, list = Object.keys(this.undefinedExports); i < list.length; i += 1)
        {
          var name = list[i];

          this.raiseRecoverable(this.undefinedExports[name].start, ("Export '" + name + "' is not defined"));
        } }
    this.adaptDirectivePrologue(node.body);
    this.next();
    node.sourceType = this.options.sourceType;
    return this.finishNode(node, "Program")
  };

  var loopLabel = {kind: "loop"}, switchLabel = {kind: "switch"};

  pp$8.isLet = function(context) {
    if (this.options.ecmaVersion < 6 || !this.isContextual("let")) { return false }
    skipWhiteSpace.lastIndex = this.pos;
    var skip = skipWhiteSpace.exec(this.input);
    var next = this.pos + skip[0].length, nextCh = this.input.charCodeAt(next);
    // For ambiguous cases, determine if a LexicalDeclaration (or only a
    // Statement) is allowed here. If context is not empty then only a Statement
    // is allowed. However, `let [` is an explicit negative lookahead for
    // ExpressionStatement, so special-case it first.
    if (nextCh === 91 || nextCh === 92) { return true } // '[', '/'
    if (context) { return false }

    if (nextCh === 123 || nextCh > 0xd7ff && nextCh < 0xdc00) { return true } // '{', astral
    if (isIdentifierStart(nextCh, true)) {
      var pos = next + 1;
      while (isIdentifierChar(nextCh = this.input.charCodeAt(pos), true)) { ++pos; }
      if (nextCh === 92 || nextCh > 0xd7ff && nextCh < 0xdc00) { return true }
      var ident = this.input.slice(next, pos);
      if (!keywordRelationalOperator.test(ident)) { return true }
    }
    return false
  };

  // check 'async [no LineTerminator here] function'
  // - 'async /*foo*/ function' is OK.
  // - 'async /*\n*/ function' is invalid.
  pp$8.isAsyncFunction = function() {
    if (this.options.ecmaVersion < 8 || !this.isContextual("async"))
      { return false }

    skipWhiteSpace.lastIndex = this.pos;
    var skip = skipWhiteSpace.exec(this.input);
    var next = this.pos + skip[0].length, after;
    return !lineBreak.test(this.input.slice(this.pos, next)) &&
      this.input.slice(next, next + 8) === "function" &&
      (next + 8 === this.input.length ||
       !(isIdentifierChar(after = this.input.charCodeAt(next + 8)) || after > 0xd7ff && after < 0xdc00))
  };

  // Parse a single statement.
  //
  // If expecting a statement and finding a slash operator, parse a
  // regular expression literal. This is to handle cases like
  // `if (foo) /blah/.exec(foo)`, where looking at the previous token
  // does not help.

  pp$8.parseStatement = function(context, topLevel, exports) {
    var starttype = this.type, node = this.startNode(), kind;

    if (this.isLet(context)) {
      starttype = types$1._var;
      kind = "let";
    }

    // Most types of statements are recognized by the keyword they
    // start with. Many are trivial to parse, some require a bit of
    // complexity.

    switch (starttype) {
    case types$1._break: case types$1._continue: return this.parseBreakContinueStatement(node, starttype.keyword)
    case types$1._debugger: return this.parseDebuggerStatement(node)
    case types$1._do: return this.parseDoStatement(node)
    case types$1._for: return this.parseForStatement(node)
    case types$1._function:
      // Function as sole body of either an if statement or a labeled statement
      // works, but not when it is part of a labeled statement that is the sole
      // body of an if statement.
      if ((context && (this.strict || context !== "if" && context !== "label")) && this.options.ecmaVersion >= 6) { this.unexpected(); }
      return this.parseFunctionStatement(node, false, !context)
    case types$1._class:
      if (context) { this.unexpected(); }
      return this.parseClass(node, true)
    case types$1._if: return this.parseIfStatement(node)
    case types$1._return: return this.parseReturnStatement(node)
    case types$1._switch: return this.parseSwitchStatement(node)
    case types$1._throw: return this.parseThrowStatement(node)
    case types$1._try: return this.parseTryStatement(node)
    case types$1._const: case types$1._var:
      kind = kind || this.value;
      if (context && kind !== "var") { this.unexpected(); }
      return this.parseVarStatement(node, kind)
    case types$1._while: return this.parseWhileStatement(node)
    case types$1._with: return this.parseWithStatement(node)
    case types$1.braceL: return this.parseBlock(true, node)
    case types$1.semi: return this.parseEmptyStatement(node)
    case types$1._export:
    case types$1._import:
      if (this.options.ecmaVersion > 10 && starttype === types$1._import) {
        skipWhiteSpace.lastIndex = this.pos;
        var skip = skipWhiteSpace.exec(this.input);
        var next = this.pos + skip[0].length, nextCh = this.input.charCodeAt(next);
        if (nextCh === 40 || nextCh === 46) // '(' or '.'
          { return this.parseExpressionStatement(node, this.parseExpression()) }
      }

      if (!this.options.allowImportExportEverywhere) {
        if (!topLevel)
          { this.raise(this.start, "'import' and 'export' may only appear at the top level"); }
        if (!this.inModule)
          { this.raise(this.start, "'import' and 'export' may appear only with 'sourceType: module'"); }
      }
      return starttype === types$1._import ? this.parseImport(node) : this.parseExport(node, exports)

      // If the statement does not start with a statement keyword or a
      // brace, it's an ExpressionStatement or LabeledStatement. We
      // simply start parsing an expression, and afterwards, if the
      // next token is a colon and the expression was a simple
      // Identifier node, we switch to interpreting it as a label.
    default:
      if (this.isAsyncFunction()) {
        if (context) { this.unexpected(); }
        this.next();
        return this.parseFunctionStatement(node, true, !context)
      }

      var maybeName = this.value, expr = this.parseExpression();
      if (starttype === types$1.name && expr.type === "Identifier" && this.eat(types$1.colon))
        { return this.parseLabeledStatement(node, maybeName, expr, context) }
      else { return this.parseExpressionStatement(node, expr) }
    }
  };

  pp$8.parseBreakContinueStatement = function(node, keyword) {
    var isBreak = keyword === "break";
    this.next();
    if (this.eat(types$1.semi) || this.insertSemicolon()) { node.label = null; }
    else if (this.type !== types$1.name) { this.unexpected(); }
    else {
      node.label = this.parseIdent();
      this.semicolon();
    }

    // Verify that there is an actual destination to break or
    // continue to.
    var i = 0;
    for (; i < this.labels.length; ++i) {
      var lab = this.labels[i];
      if (node.label == null || lab.name === node.label.name) {
        if (lab.kind != null && (isBreak || lab.kind === "loop")) { break }
        if (node.label && isBreak) { break }
      }
    }
    if (i === this.labels.length) { this.raise(node.start, "Unsyntactic " + keyword); }
    return this.finishNode(node, isBreak ? "BreakStatement" : "ContinueStatement")
  };

  pp$8.parseDebuggerStatement = function(node) {
    this.next();
    this.semicolon();
    return this.finishNode(node, "DebuggerStatement")
  };

  pp$8.parseDoStatement = function(node) {
    this.next();
    this.labels.push(loopLabel);
    node.body = this.parseStatement("do");
    this.labels.pop();
    this.expect(types$1._while);
    node.test = this.parseParenExpression();
    if (this.options.ecmaVersion >= 6)
      { this.eat(types$1.semi); }
    else
      { this.semicolon(); }
    return this.finishNode(node, "DoWhileStatement")
  };

  // Disambiguating between a `for` and a `for`/`in` or `for`/`of`
  // loop is non-trivial. Basically, we have to parse the init `var`
  // statement or expression, disallowing the `in` operator (see
  // the second parameter to `parseExpression`), and then check
  // whether the next token is `in` or `of`. When there is no init
  // part (semicolon immediately after the opening parenthesis), it
  // is a regular `for` loop.

  pp$8.parseForStatement = function(node) {
    this.next();
    var awaitAt = (this.options.ecmaVersion >= 9 && this.canAwait && this.eatContextual("await")) ? this.lastTokStart : -1;
    this.labels.push(loopLabel);
    this.enterScope(0);
    this.expect(types$1.parenL);
    if (this.type === types$1.semi) {
      if (awaitAt > -1) { this.unexpected(awaitAt); }
      return this.parseFor(node, null)
    }
    var isLet = this.isLet();
    if (this.type === types$1._var || this.type === types$1._const || isLet) {
      var init$1 = this.startNode(), kind = isLet ? "let" : this.value;
      this.next();
      this.parseVar(init$1, true, kind);
      this.finishNode(init$1, "VariableDeclaration");
      if ((this.type === types$1._in || (this.options.ecmaVersion >= 6 && this.isContextual("of"))) && init$1.declarations.length === 1) {
        if (this.options.ecmaVersion >= 9) {
          if (this.type === types$1._in) {
            if (awaitAt > -1) { this.unexpected(awaitAt); }
          } else { node.await = awaitAt > -1; }
        }
        return this.parseForIn(node, init$1)
      }
      if (awaitAt > -1) { this.unexpected(awaitAt); }
      return this.parseFor(node, init$1)
    }
    var startsWithLet = this.isContextual("let"), isForOf = false;
    var refDestructuringErrors = new DestructuringErrors;
    var init = this.parseExpression(awaitAt > -1 ? "await" : true, refDestructuringErrors);
    if (this.type === types$1._in || (isForOf = this.options.ecmaVersion >= 6 && this.isContextual("of"))) {
      if (this.options.ecmaVersion >= 9) {
        if (this.type === types$1._in) {
          if (awaitAt > -1) { this.unexpected(awaitAt); }
        } else { node.await = awaitAt > -1; }
      }
      if (startsWithLet && isForOf) { this.raise(init.start, "The left-hand side of a for-of loop may not start with 'let'."); }
      this.toAssignable(init, false, refDestructuringErrors);
      this.checkLValPattern(init);
      return this.parseForIn(node, init)
    } else {
      this.checkExpressionErrors(refDestructuringErrors, true);
    }
    if (awaitAt > -1) { this.unexpected(awaitAt); }
    return this.parseFor(node, init)
  };

  pp$8.parseFunctionStatement = function(node, isAsync, declarationPosition) {
    this.next();
    return this.parseFunction(node, FUNC_STATEMENT | (declarationPosition ? 0 : FUNC_HANGING_STATEMENT), false, isAsync)
  };

  pp$8.parseIfStatement = function(node) {
    this.next();
    node.test = this.parseParenExpression();
    // allow function declarations in branches, but only in non-strict mode
    node.consequent = this.parseStatement("if");
    node.alternate = this.eat(types$1._else) ? this.parseStatement("if") : null;
    return this.finishNode(node, "IfStatement")
  };

  pp$8.parseReturnStatement = function(node) {
    if (!this.inFunction && !this.options.allowReturnOutsideFunction)
      { this.raise(this.start, "'return' outside of function"); }
    this.next();

    // In `return` (and `break`/`continue`), the keywords with
    // optional arguments, we eagerly look for a semicolon or the
    // possibility to insert one.

    if (this.eat(types$1.semi) || this.insertSemicolon()) { node.argument = null; }
    else { node.argument = this.parseExpression(); this.semicolon(); }
    return this.finishNode(node, "ReturnStatement")
  };

  pp$8.parseSwitchStatement = function(node) {
    this.next();
    node.discriminant = this.parseParenExpression();
    node.cases = [];
    this.expect(types$1.braceL);
    this.labels.push(switchLabel);
    this.enterScope(0);

    // Statements under must be grouped (by label) in SwitchCase
    // nodes. `cur` is used to keep the node that we are currently
    // adding statements to.

    var cur;
    for (var sawDefault = false; this.type !== types$1.braceR;) {
      if (this.type === types$1._case || this.type === types$1._default) {
        var isCase = this.type === types$1._case;
        if (cur) { this.finishNode(cur, "SwitchCase"); }
        node.cases.push(cur = this.startNode());
        cur.consequent = [];
        this.next();
        if (isCase) {
          cur.test = this.parseExpression();
        } else {
          if (sawDefault) { this.raiseRecoverable(this.lastTokStart, "Multiple default clauses"); }
          sawDefault = true;
          cur.test = null;
        }
        this.expect(types$1.colon);
      } else {
        if (!cur) { this.unexpected(); }
        cur.consequent.push(this.parseStatement(null));
      }
    }
    this.exitScope();
    if (cur) { this.finishNode(cur, "SwitchCase"); }
    this.next(); // Closing brace
    this.labels.pop();
    return this.finishNode(node, "SwitchStatement")
  };

  pp$8.parseThrowStatement = function(node) {
    this.next();
    if (lineBreak.test(this.input.slice(this.lastTokEnd, this.start)))
      { this.raise(this.lastTokEnd, "Illegal newline after throw"); }
    node.argument = this.parseExpression();
    this.semicolon();
    return this.finishNode(node, "ThrowStatement")
  };

  // Reused empty array added for node fields that are always empty.

  var empty$1 = [];

  pp$8.parseCatchClauseParam = function() {
    var param = this.parseBindingAtom();
    var simple = param.type === "Identifier";
    this.enterScope(simple ? SCOPE_SIMPLE_CATCH : 0);
    this.checkLValPattern(param, simple ? BIND_SIMPLE_CATCH : BIND_LEXICAL);
    this.expect(types$1.parenR);

    return param
  };

  pp$8.parseTryStatement = function(node) {
    this.next();
    node.block = this.parseBlock();
    node.handler = null;
    if (this.type === types$1._catch) {
      var clause = this.startNode();
      this.next();
      if (this.eat(types$1.parenL)) {
        clause.param = this.parseCatchClauseParam();
      } else {
        if (this.options.ecmaVersion < 10) { this.unexpected(); }
        clause.param = null;
        this.enterScope(0);
      }
      clause.body = this.parseBlock(false);
      this.exitScope();
      node.handler = this.finishNode(clause, "CatchClause");
    }
    node.finalizer = this.eat(types$1._finally) ? this.parseBlock() : null;
    if (!node.handler && !node.finalizer)
      { this.raise(node.start, "Missing catch or finally clause"); }
    return this.finishNode(node, "TryStatement")
  };

  pp$8.parseVarStatement = function(node, kind, allowMissingInitializer) {
    this.next();
    this.parseVar(node, false, kind, allowMissingInitializer);
    this.semicolon();
    return this.finishNode(node, "VariableDeclaration")
  };

  pp$8.parseWhileStatement = function(node) {
    this.next();
    node.test = this.parseParenExpression();
    this.labels.push(loopLabel);
    node.body = this.parseStatement("while");
    this.labels.pop();
    return this.finishNode(node, "WhileStatement")
  };

  pp$8.parseWithStatement = function(node) {
    if (this.strict) { this.raise(this.start, "'with' in strict mode"); }
    this.next();
    node.object = this.parseParenExpression();
    node.body = this.parseStatement("with");
    return this.finishNode(node, "WithStatement")
  };

  pp$8.parseEmptyStatement = function(node) {
    this.next();
    return this.finishNode(node, "EmptyStatement")
  };

  pp$8.parseLabeledStatement = function(node, maybeName, expr, context) {
    for (var i$1 = 0, list = this.labels; i$1 < list.length; i$1 += 1)
      {
      var label = list[i$1];

      if (label.name === maybeName)
        { this.raise(expr.start, "Label '" + maybeName + "' is already declared");
    } }
    var kind = this.type.isLoop ? "loop" : this.type === types$1._switch ? "switch" : null;
    for (var i = this.labels.length - 1; i >= 0; i--) {
      var label$1 = this.labels[i];
      if (label$1.statementStart === node.start) {
        // Update information about previous labels on this node
        label$1.statementStart = this.start;
        label$1.kind = kind;
      } else { break }
    }
    this.labels.push({name: maybeName, kind: kind, statementStart: this.start});
    node.body = this.parseStatement(context ? context.indexOf("label") === -1 ? context + "label" : context : "label");
    this.labels.pop();
    node.label = expr;
    return this.finishNode(node, "LabeledStatement")
  };

  pp$8.parseExpressionStatement = function(node, expr) {
    node.expression = expr;
    this.semicolon();
    return this.finishNode(node, "ExpressionStatement")
  };

  // Parse a semicolon-enclosed block of statements, handling `"use
  // strict"` declarations when `allowStrict` is true (used for
  // function bodies).

  pp$8.parseBlock = function(createNewLexicalScope, node, exitStrict) {
    if ( createNewLexicalScope === void 0 ) createNewLexicalScope = true;
    if ( node === void 0 ) node = this.startNode();

    node.body = [];
    this.expect(types$1.braceL);
    if (createNewLexicalScope) { this.enterScope(0); }
    while (this.type !== types$1.braceR) {
      var stmt = this.parseStatement(null);
      node.body.push(stmt);
    }
    if (exitStrict) { this.strict = false; }
    this.next();
    if (createNewLexicalScope) { this.exitScope(); }
    return this.finishNode(node, "BlockStatement")
  };

  // Parse a regular `for` loop. The disambiguation code in
  // `parseStatement` will already have parsed the init statement or
  // expression.

  pp$8.parseFor = function(node, init) {
    node.init = init;
    this.expect(types$1.semi);
    node.test = this.type === types$1.semi ? null : this.parseExpression();
    this.expect(types$1.semi);
    node.update = this.type === types$1.parenR ? null : this.parseExpression();
    this.expect(types$1.parenR);
    node.body = this.parseStatement("for");
    this.exitScope();
    this.labels.pop();
    return this.finishNode(node, "ForStatement")
  };

  // Parse a `for`/`in` and `for`/`of` loop, which are almost
  // same from parser's perspective.

  pp$8.parseForIn = function(node, init) {
    var isForIn = this.type === types$1._in;
    this.next();

    if (
      init.type === "VariableDeclaration" &&
      init.declarations[0].init != null &&
      (
        !isForIn ||
        this.options.ecmaVersion < 8 ||
        this.strict ||
        init.kind !== "var" ||
        init.declarations[0].id.type !== "Identifier"
      )
    ) {
      this.raise(
        init.start,
        ((isForIn ? "for-in" : "for-of") + " loop variable declaration may not have an initializer")
      );
    }
    node.left = init;
    node.right = isForIn ? this.parseExpression() : this.parseMaybeAssign();
    this.expect(types$1.parenR);
    node.body = this.parseStatement("for");
    this.exitScope();
    this.labels.pop();
    return this.finishNode(node, isForIn ? "ForInStatement" : "ForOfStatement")
  };

  // Parse a list of variable declarations.

  pp$8.parseVar = function(node, isFor, kind, allowMissingInitializer) {
    node.declarations = [];
    node.kind = kind;
    for (;;) {
      var decl = this.startNode();
      this.parseVarId(decl, kind);
      if (this.eat(types$1.eq)) {
        decl.init = this.parseMaybeAssign(isFor);
      } else if (!allowMissingInitializer && kind === "const" && !(this.type === types$1._in || (this.options.ecmaVersion >= 6 && this.isContextual("of")))) {
        this.unexpected();
      } else if (!allowMissingInitializer && decl.id.type !== "Identifier" && !(isFor && (this.type === types$1._in || this.isContextual("of")))) {
        this.raise(this.lastTokEnd, "Complex binding patterns require an initialization value");
      } else {
        decl.init = null;
      }
      node.declarations.push(this.finishNode(decl, "VariableDeclarator"));
      if (!this.eat(types$1.comma)) { break }
    }
    return node
  };

  pp$8.parseVarId = function(decl, kind) {
    decl.id = this.parseBindingAtom();
    this.checkLValPattern(decl.id, kind === "var" ? BIND_VAR : BIND_LEXICAL, false);
  };

  var FUNC_STATEMENT = 1, FUNC_HANGING_STATEMENT = 2, FUNC_NULLABLE_ID = 4;

  // Parse a function declaration or literal (depending on the
  // `statement & FUNC_STATEMENT`).

  // Remove `allowExpressionBody` for 7.0.0, as it is only called with false
  pp$8.parseFunction = function(node, statement, allowExpressionBody, isAsync, forInit) {
    this.initFunction(node);
    if (this.options.ecmaVersion >= 9 || this.options.ecmaVersion >= 6 && !isAsync) {
      if (this.type === types$1.star && (statement & FUNC_HANGING_STATEMENT))
        { this.unexpected(); }
      node.generator = this.eat(types$1.star);
    }
    if (this.options.ecmaVersion >= 8)
      { node.async = !!isAsync; }

    if (statement & FUNC_STATEMENT) {
      node.id = (statement & FUNC_NULLABLE_ID) && this.type !== types$1.name ? null : this.parseIdent();
      if (node.id && !(statement & FUNC_HANGING_STATEMENT))
        // If it is a regular function declaration in sloppy mode, then it is
        // subject to Annex B semantics (BIND_FUNCTION). Otherwise, the binding
        // mode depends on properties of the current scope (see
        // treatFunctionsAsVar).
        { this.checkLValSimple(node.id, (this.strict || node.generator || node.async) ? this.treatFunctionsAsVar ? BIND_VAR : BIND_LEXICAL : BIND_FUNCTION); }
    }

    var oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
    this.yieldPos = 0;
    this.awaitPos = 0;
    this.awaitIdentPos = 0;
    this.enterScope(functionFlags(node.async, node.generator));

    if (!(statement & FUNC_STATEMENT))
      { node.id = this.type === types$1.name ? this.parseIdent() : null; }

    this.parseFunctionParams(node);
    this.parseFunctionBody(node, allowExpressionBody, false, forInit);

    this.yieldPos = oldYieldPos;
    this.awaitPos = oldAwaitPos;
    this.awaitIdentPos = oldAwaitIdentPos;
    return this.finishNode(node, (statement & FUNC_STATEMENT) ? "FunctionDeclaration" : "FunctionExpression")
  };

  pp$8.parseFunctionParams = function(node) {
    this.expect(types$1.parenL);
    node.params = this.parseBindingList(types$1.parenR, false, this.options.ecmaVersion >= 8);
    this.checkYieldAwaitInDefaultParams();
  };

  // Parse a class declaration or literal (depending on the
  // `isStatement` parameter).

  pp$8.parseClass = function(node, isStatement) {
    this.next();

    // ecma-262 14.6 Class Definitions
    // A class definition is always strict mode code.
    var oldStrict = this.strict;
    this.strict = true;

    this.parseClassId(node, isStatement);
    this.parseClassSuper(node);
    var privateNameMap = this.enterClassBody();
    var classBody = this.startNode();
    var hadConstructor = false;
    classBody.body = [];
    this.expect(types$1.braceL);
    while (this.type !== types$1.braceR) {
      var element = this.parseClassElement(node.superClass !== null);
      if (element) {
        classBody.body.push(element);
        if (element.type === "MethodDefinition" && element.kind === "constructor") {
          if (hadConstructor) { this.raiseRecoverable(element.start, "Duplicate constructor in the same class"); }
          hadConstructor = true;
        } else if (element.key && element.key.type === "PrivateIdentifier" && isPrivateNameConflicted(privateNameMap, element)) {
          this.raiseRecoverable(element.key.start, ("Identifier '#" + (element.key.name) + "' has already been declared"));
        }
      }
    }
    this.strict = oldStrict;
    this.next();
    node.body = this.finishNode(classBody, "ClassBody");
    this.exitClassBody();
    return this.finishNode(node, isStatement ? "ClassDeclaration" : "ClassExpression")
  };

  pp$8.parseClassElement = function(constructorAllowsSuper) {
    if (this.eat(types$1.semi)) { return null }

    var ecmaVersion = this.options.ecmaVersion;
    var node = this.startNode();
    var keyName = "";
    var isGenerator = false;
    var isAsync = false;
    var kind = "method";
    var isStatic = false;

    if (this.eatContextual("static")) {
      // Parse static init block
      if (ecmaVersion >= 13 && this.eat(types$1.braceL)) {
        this.parseClassStaticBlock(node);
        return node
      }
      if (this.isClassElementNameStart() || this.type === types$1.star) {
        isStatic = true;
      } else {
        keyName = "static";
      }
    }
    node.static = isStatic;
    if (!keyName && ecmaVersion >= 8 && this.eatContextual("async")) {
      if ((this.isClassElementNameStart() || this.type === types$1.star) && !this.canInsertSemicolon()) {
        isAsync = true;
      } else {
        keyName = "async";
      }
    }
    if (!keyName && (ecmaVersion >= 9 || !isAsync) && this.eat(types$1.star)) {
      isGenerator = true;
    }
    if (!keyName && !isAsync && !isGenerator) {
      var lastValue = this.value;
      if (this.eatContextual("get") || this.eatContextual("set")) {
        if (this.isClassElementNameStart()) {
          kind = lastValue;
        } else {
          keyName = lastValue;
        }
      }
    }

    // Parse element name
    if (keyName) {
      // 'async', 'get', 'set', or 'static' were not a keyword contextually.
      // The last token is any of those. Make it the element name.
      node.computed = false;
      node.key = this.startNodeAt(this.lastTokStart, this.lastTokStartLoc);
      node.key.name = keyName;
      this.finishNode(node.key, "Identifier");
    } else {
      this.parseClassElementName(node);
    }

    // Parse element value
    if (ecmaVersion < 13 || this.type === types$1.parenL || kind !== "method" || isGenerator || isAsync) {
      var isConstructor = !node.static && checkKeyName(node, "constructor");
      var allowsDirectSuper = isConstructor && constructorAllowsSuper;
      // Couldn't move this check into the 'parseClassMethod' method for backward compatibility.
      if (isConstructor && kind !== "method") { this.raise(node.key.start, "Constructor can't have get/set modifier"); }
      node.kind = isConstructor ? "constructor" : kind;
      this.parseClassMethod(node, isGenerator, isAsync, allowsDirectSuper);
    } else {
      this.parseClassField(node);
    }

    return node
  };

  pp$8.isClassElementNameStart = function() {
    return (
      this.type === types$1.name ||
      this.type === types$1.privateId ||
      this.type === types$1.num ||
      this.type === types$1.string ||
      this.type === types$1.bracketL ||
      this.type.keyword
    )
  };

  pp$8.parseClassElementName = function(element) {
    if (this.type === types$1.privateId) {
      if (this.value === "constructor") {
        this.raise(this.start, "Classes can't have an element named '#constructor'");
      }
      element.computed = false;
      element.key = this.parsePrivateIdent();
    } else {
      this.parsePropertyName(element);
    }
  };

  pp$8.parseClassMethod = function(method, isGenerator, isAsync, allowsDirectSuper) {
    // Check key and flags
    var key = method.key;
    if (method.kind === "constructor") {
      if (isGenerator) { this.raise(key.start, "Constructor can't be a generator"); }
      if (isAsync) { this.raise(key.start, "Constructor can't be an async method"); }
    } else if (method.static && checkKeyName(method, "prototype")) {
      this.raise(key.start, "Classes may not have a static property named prototype");
    }

    // Parse value
    var value = method.value = this.parseMethod(isGenerator, isAsync, allowsDirectSuper);

    // Check value
    if (method.kind === "get" && value.params.length !== 0)
      { this.raiseRecoverable(value.start, "getter should have no params"); }
    if (method.kind === "set" && value.params.length !== 1)
      { this.raiseRecoverable(value.start, "setter should have exactly one param"); }
    if (method.kind === "set" && value.params[0].type === "RestElement")
      { this.raiseRecoverable(value.params[0].start, "Setter cannot use rest params"); }

    return this.finishNode(method, "MethodDefinition")
  };

  pp$8.parseClassField = function(field) {
    if (checkKeyName(field, "constructor")) {
      this.raise(field.key.start, "Classes can't have a field named 'constructor'");
    } else if (field.static && checkKeyName(field, "prototype")) {
      this.raise(field.key.start, "Classes can't have a static field named 'prototype'");
    }

    if (this.eat(types$1.eq)) {
      // To raise SyntaxError if 'arguments' exists in the initializer.
      var scope = this.currentThisScope();
      var inClassFieldInit = scope.inClassFieldInit;
      scope.inClassFieldInit = true;
      field.value = this.parseMaybeAssign();
      scope.inClassFieldInit = inClassFieldInit;
    } else {
      field.value = null;
    }
    this.semicolon();

    return this.finishNode(field, "PropertyDefinition")
  };

  pp$8.parseClassStaticBlock = function(node) {
    node.body = [];

    var oldLabels = this.labels;
    this.labels = [];
    this.enterScope(SCOPE_CLASS_STATIC_BLOCK | SCOPE_SUPER);
    while (this.type !== types$1.braceR) {
      var stmt = this.parseStatement(null);
      node.body.push(stmt);
    }
    this.next();
    this.exitScope();
    this.labels = oldLabels;

    return this.finishNode(node, "StaticBlock")
  };

  pp$8.parseClassId = function(node, isStatement) {
    if (this.type === types$1.name) {
      node.id = this.parseIdent();
      if (isStatement)
        { this.checkLValSimple(node.id, BIND_LEXICAL, false); }
    } else {
      if (isStatement === true)
        { this.unexpected(); }
      node.id = null;
    }
  };

  pp$8.parseClassSuper = function(node) {
    node.superClass = this.eat(types$1._extends) ? this.parseExprSubscripts(null, false) : null;
  };

  pp$8.enterClassBody = function() {
    var element = {declared: Object.create(null), used: []};
    this.privateNameStack.push(element);
    return element.declared
  };

  pp$8.exitClassBody = function() {
    var ref = this.privateNameStack.pop();
    var declared = ref.declared;
    var used = ref.used;
    if (!this.options.checkPrivateFields) { return }
    var len = this.privateNameStack.length;
    var parent = len === 0 ? null : this.privateNameStack[len - 1];
    for (var i = 0; i < used.length; ++i) {
      var id = used[i];
      if (!hasOwn(declared, id.name)) {
        if (parent) {
          parent.used.push(id);
        } else {
          this.raiseRecoverable(id.start, ("Private field '#" + (id.name) + "' must be declared in an enclosing class"));
        }
      }
    }
  };

  function isPrivateNameConflicted(privateNameMap, element) {
    var name = element.key.name;
    var curr = privateNameMap[name];

    var next = "true";
    if (element.type === "MethodDefinition" && (element.kind === "get" || element.kind === "set")) {
      next = (element.static ? "s" : "i") + element.kind;
    }

    // `class { get #a(){}; static set #a(_){} }` is also conflict.
    if (
      curr === "iget" && next === "iset" ||
      curr === "iset" && next === "iget" ||
      curr === "sget" && next === "sset" ||
      curr === "sset" && next === "sget"
    ) {
      privateNameMap[name] = "true";
      return false
    } else if (!curr) {
      privateNameMap[name] = next;
      return false
    } else {
      return true
    }
  }

  function checkKeyName(node, name) {
    var computed = node.computed;
    var key = node.key;
    return !computed && (
      key.type === "Identifier" && key.name === name ||
      key.type === "Literal" && key.value === name
    )
  }

  // Parses module export declaration.

  pp$8.parseExportAllDeclaration = function(node, exports) {
    if (this.options.ecmaVersion >= 11) {
      if (this.eatContextual("as")) {
        node.exported = this.parseModuleExportName();
        this.checkExport(exports, node.exported, this.lastTokStart);
      } else {
        node.exported = null;
      }
    }
    this.expectContextual("from");
    if (this.type !== types$1.string) { this.unexpected(); }
    node.source = this.parseExprAtom();
    this.semicolon();
    return this.finishNode(node, "ExportAllDeclaration")
  };

  pp$8.parseExport = function(node, exports) {
    this.next();
    // export * from '...'
    if (this.eat(types$1.star)) {
      return this.parseExportAllDeclaration(node, exports)
    }
    if (this.eat(types$1._default)) { // export default ...
      this.checkExport(exports, "default", this.lastTokStart);
      node.declaration = this.parseExportDefaultDeclaration();
      return this.finishNode(node, "ExportDefaultDeclaration")
    }
    // export var|const|let|function|class ...
    if (this.shouldParseExportStatement()) {
      node.declaration = this.parseExportDeclaration(node);
      if (node.declaration.type === "VariableDeclaration")
        { this.checkVariableExport(exports, node.declaration.declarations); }
      else
        { this.checkExport(exports, node.declaration.id, node.declaration.id.start); }
      node.specifiers = [];
      node.source = null;
    } else { // export { x, y as z } [from '...']
      node.declaration = null;
      node.specifiers = this.parseExportSpecifiers(exports);
      if (this.eatContextual("from")) {
        if (this.type !== types$1.string) { this.unexpected(); }
        node.source = this.parseExprAtom();
      } else {
        for (var i = 0, list = node.specifiers; i < list.length; i += 1) {
          // check for keywords used as local names
          var spec = list[i];

          this.checkUnreserved(spec.local);
          // check if export is defined
          this.checkLocalExport(spec.local);

          if (spec.local.type === "Literal") {
            this.raise(spec.local.start, "A string literal cannot be used as an exported binding without `from`.");
          }
        }

        node.source = null;
      }
      this.semicolon();
    }
    return this.finishNode(node, "ExportNamedDeclaration")
  };

  pp$8.parseExportDeclaration = function(node) {
    return this.parseStatement(null)
  };

  pp$8.parseExportDefaultDeclaration = function() {
    var isAsync;
    if (this.type === types$1._function || (isAsync = this.isAsyncFunction())) {
      var fNode = this.startNode();
      this.next();
      if (isAsync) { this.next(); }
      return this.parseFunction(fNode, FUNC_STATEMENT | FUNC_NULLABLE_ID, false, isAsync)
    } else if (this.type === types$1._class) {
      var cNode = this.startNode();
      return this.parseClass(cNode, "nullableID")
    } else {
      var declaration = this.parseMaybeAssign();
      this.semicolon();
      return declaration
    }
  };

  pp$8.checkExport = function(exports, name, pos) {
    if (!exports) { return }
    if (typeof name !== "string")
      { name = name.type === "Identifier" ? name.name : name.value; }
    if (hasOwn(exports, name))
      { this.raiseRecoverable(pos, "Duplicate export '" + name + "'"); }
    exports[name] = true;
  };

  pp$8.checkPatternExport = function(exports, pat) {
    var type = pat.type;
    if (type === "Identifier")
      { this.checkExport(exports, pat, pat.start); }
    else if (type === "ObjectPattern")
      { for (var i = 0, list = pat.properties; i < list.length; i += 1)
        {
          var prop = list[i];

          this.checkPatternExport(exports, prop);
        } }
    else if (type === "ArrayPattern")
      { for (var i$1 = 0, list$1 = pat.elements; i$1 < list$1.length; i$1 += 1) {
        var elt = list$1[i$1];

          if (elt) { this.checkPatternExport(exports, elt); }
      } }
    else if (type === "Property")
      { this.checkPatternExport(exports, pat.value); }
    else if (type === "AssignmentPattern")
      { this.checkPatternExport(exports, pat.left); }
    else if (type === "RestElement")
      { this.checkPatternExport(exports, pat.argument); }
    else if (type === "ParenthesizedExpression")
      { this.checkPatternExport(exports, pat.expression); }
  };

  pp$8.checkVariableExport = function(exports, decls) {
    if (!exports) { return }
    for (var i = 0, list = decls; i < list.length; i += 1)
      {
      var decl = list[i];

      this.checkPatternExport(exports, decl.id);
    }
  };

  pp$8.shouldParseExportStatement = function() {
    return this.type.keyword === "var" ||
      this.type.keyword === "const" ||
      this.type.keyword === "class" ||
      this.type.keyword === "function" ||
      this.isLet() ||
      this.isAsyncFunction()
  };

  // Parses a comma-separated list of module exports.

  pp$8.parseExportSpecifier = function(exports) {
    var node = this.startNode();
    node.local = this.parseModuleExportName();

    node.exported = this.eatContextual("as") ? this.parseModuleExportName() : node.local;
    this.checkExport(
      exports,
      node.exported,
      node.exported.start
    );

    return this.finishNode(node, "ExportSpecifier")
  };

  pp$8.parseExportSpecifiers = function(exports) {
    var nodes = [], first = true;
    // export { x, y as z } [from '...']
    this.expect(types$1.braceL);
    while (!this.eat(types$1.braceR)) {
      if (!first) {
        this.expect(types$1.comma);
        if (this.afterTrailingComma(types$1.braceR)) { break }
      } else { first = false; }

      nodes.push(this.parseExportSpecifier(exports));
    }
    return nodes
  };

  // Parses import declaration.

  pp$8.parseImport = function(node) {
    this.next();

    // import '...'
    if (this.type === types$1.string) {
      node.specifiers = empty$1;
      node.source = this.parseExprAtom();
    } else {
      node.specifiers = this.parseImportSpecifiers();
      this.expectContextual("from");
      node.source = this.type === types$1.string ? this.parseExprAtom() : this.unexpected();
    }
    this.semicolon();
    return this.finishNode(node, "ImportDeclaration")
  };

  // Parses a comma-separated list of module imports.

  pp$8.parseImportSpecifier = function() {
    var node = this.startNode();
    node.imported = this.parseModuleExportName();

    if (this.eatContextual("as")) {
      node.local = this.parseIdent();
    } else {
      this.checkUnreserved(node.imported);
      node.local = node.imported;
    }
    this.checkLValSimple(node.local, BIND_LEXICAL);

    return this.finishNode(node, "ImportSpecifier")
  };

  pp$8.parseImportDefaultSpecifier = function() {
    // import defaultObj, { x, y as z } from '...'
    var node = this.startNode();
    node.local = this.parseIdent();
    this.checkLValSimple(node.local, BIND_LEXICAL);
    return this.finishNode(node, "ImportDefaultSpecifier")
  };

  pp$8.parseImportNamespaceSpecifier = function() {
    var node = this.startNode();
    this.next();
    this.expectContextual("as");
    node.local = this.parseIdent();
    this.checkLValSimple(node.local, BIND_LEXICAL);
    return this.finishNode(node, "ImportNamespaceSpecifier")
  };

  pp$8.parseImportSpecifiers = function() {
    var nodes = [], first = true;
    if (this.type === types$1.name) {
      nodes.push(this.parseImportDefaultSpecifier());
      if (!this.eat(types$1.comma)) { return nodes }
    }
    if (this.type === types$1.star) {
      nodes.push(this.parseImportNamespaceSpecifier());
      return nodes
    }
    this.expect(types$1.braceL);
    while (!this.eat(types$1.braceR)) {
      if (!first) {
        this.expect(types$1.comma);
        if (this.afterTrailingComma(types$1.braceR)) { break }
      } else { first = false; }

      nodes.push(this.parseImportSpecifier());
    }
    return nodes
  };

  pp$8.parseModuleExportName = function() {
    if (this.options.ecmaVersion >= 13 && this.type === types$1.string) {
      var stringLiteral = this.parseLiteral(this.value);
      if (loneSurrogate.test(stringLiteral.value)) {
        this.raise(stringLiteral.start, "An export name cannot include a lone surrogate.");
      }
      return stringLiteral
    }
    return this.parseIdent(true)
  };

  // Set `ExpressionStatement#directive` property for directive prologues.
  pp$8.adaptDirectivePrologue = function(statements) {
    for (var i = 0; i < statements.length && this.isDirectiveCandidate(statements[i]); ++i) {
      statements[i].directive = statements[i].expression.raw.slice(1, -1);
    }
  };
  pp$8.isDirectiveCandidate = function(statement) {
    return (
      this.options.ecmaVersion >= 5 &&
      statement.type === "ExpressionStatement" &&
      statement.expression.type === "Literal" &&
      typeof statement.expression.value === "string" &&
      // Reject parenthesized strings.
      (this.input[statement.start] === "\"" || this.input[statement.start] === "'")
    )
  };

  var pp$7 = Parser.prototype;

  // Convert existing expression atom to assignable pattern
  // if possible.

  pp$7.toAssignable = function(node, isBinding, refDestructuringErrors) {
    if (this.options.ecmaVersion >= 6 && node) {
      switch (node.type) {
      case "Identifier":
        if (this.inAsync && node.name === "await")
          { this.raise(node.start, "Cannot use 'await' as identifier inside an async function"); }
        break

      case "ObjectPattern":
      case "ArrayPattern":
      case "AssignmentPattern":
      case "RestElement":
        break

      case "ObjectExpression":
        node.type = "ObjectPattern";
        if (refDestructuringErrors) { this.checkPatternErrors(refDestructuringErrors, true); }
        for (var i = 0, list = node.properties; i < list.length; i += 1) {
          var prop = list[i];

        this.toAssignable(prop, isBinding);
          // Early error:
          //   AssignmentRestProperty[Yield, Await] :
          //     `...` DestructuringAssignmentTarget[Yield, Await]
          //
          //   It is a Syntax Error if |DestructuringAssignmentTarget| is an |ArrayLiteral| or an |ObjectLiteral|.
          if (
            prop.type === "RestElement" &&
            (prop.argument.type === "ArrayPattern" || prop.argument.type === "ObjectPattern")
          ) {
            this.raise(prop.argument.start, "Unexpected token");
          }
        }
        break

      case "Property":
        // AssignmentProperty has type === "Property"
        if (node.kind !== "init") { this.raise(node.key.start, "Object pattern can't contain getter or setter"); }
        this.toAssignable(node.value, isBinding);
        break

      case "ArrayExpression":
        node.type = "ArrayPattern";
        if (refDestructuringErrors) { this.checkPatternErrors(refDestructuringErrors, true); }
        this.toAssignableList(node.elements, isBinding);
        break

      case "SpreadElement":
        node.type = "RestElement";
        this.toAssignable(node.argument, isBinding);
        if (node.argument.type === "AssignmentPattern")
          { this.raise(node.argument.start, "Rest elements cannot have a default value"); }
        break

      case "AssignmentExpression":
        if (node.operator !== "=") { this.raise(node.left.end, "Only '=' operator can be used for specifying default value."); }
        node.type = "AssignmentPattern";
        delete node.operator;
        this.toAssignable(node.left, isBinding);
        break

      case "ParenthesizedExpression":
        this.toAssignable(node.expression, isBinding, refDestructuringErrors);
        break

      case "ChainExpression":
        this.raiseRecoverable(node.start, "Optional chaining cannot appear in left-hand side");
        break

      case "MemberExpression":
        if (!isBinding) { break }

      default:
        this.raise(node.start, "Assigning to rvalue");
      }
    } else if (refDestructuringErrors) { this.checkPatternErrors(refDestructuringErrors, true); }
    return node
  };

  // Convert list of expression atoms to binding list.

  pp$7.toAssignableList = function(exprList, isBinding) {
    var end = exprList.length;
    for (var i = 0; i < end; i++) {
      var elt = exprList[i];
      if (elt) { this.toAssignable(elt, isBinding); }
    }
    if (end) {
      var last = exprList[end - 1];
      if (this.options.ecmaVersion === 6 && isBinding && last && last.type === "RestElement" && last.argument.type !== "Identifier")
        { this.unexpected(last.argument.start); }
    }
    return exprList
  };

  // Parses spread element.

  pp$7.parseSpread = function(refDestructuringErrors) {
    var node = this.startNode();
    this.next();
    node.argument = this.parseMaybeAssign(false, refDestructuringErrors);
    return this.finishNode(node, "SpreadElement")
  };

  pp$7.parseRestBinding = function() {
    var node = this.startNode();
    this.next();

    // RestElement inside of a function parameter must be an identifier
    if (this.options.ecmaVersion === 6 && this.type !== types$1.name)
      { this.unexpected(); }

    node.argument = this.parseBindingAtom();

    return this.finishNode(node, "RestElement")
  };

  // Parses lvalue (assignable) atom.

  pp$7.parseBindingAtom = function() {
    if (this.options.ecmaVersion >= 6) {
      switch (this.type) {
      case types$1.bracketL:
        var node = this.startNode();
        this.next();
        node.elements = this.parseBindingList(types$1.bracketR, true, true);
        return this.finishNode(node, "ArrayPattern")

      case types$1.braceL:
        return this.parseObj(true)
      }
    }
    return this.parseIdent()
  };

  pp$7.parseBindingList = function(close, allowEmpty, allowTrailingComma, allowModifiers) {
    var elts = [], first = true;
    while (!this.eat(close)) {
      if (first) { first = false; }
      else { this.expect(types$1.comma); }
      if (allowEmpty && this.type === types$1.comma) {
        elts.push(null);
      } else if (allowTrailingComma && this.afterTrailingComma(close)) {
        break
      } else if (this.type === types$1.ellipsis) {
        var rest = this.parseRestBinding();
        this.parseBindingListItem(rest);
        elts.push(rest);
        if (this.type === types$1.comma) { this.raiseRecoverable(this.start, "Comma is not permitted after the rest element"); }
        this.expect(close);
        break
      } else {
        elts.push(this.parseAssignableListItem(allowModifiers));
      }
    }
    return elts
  };

  pp$7.parseAssignableListItem = function(allowModifiers) {
    var elem = this.parseMaybeDefault(this.start, this.startLoc);
    this.parseBindingListItem(elem);
    return elem
  };

  pp$7.parseBindingListItem = function(param) {
    return param
  };

  // Parses assignment pattern around given atom if possible.

  pp$7.parseMaybeDefault = function(startPos, startLoc, left) {
    left = left || this.parseBindingAtom();
    if (this.options.ecmaVersion < 6 || !this.eat(types$1.eq)) { return left }
    var node = this.startNodeAt(startPos, startLoc);
    node.left = left;
    node.right = this.parseMaybeAssign();
    return this.finishNode(node, "AssignmentPattern")
  };

  // The following three functions all verify that a node is an lvalue —
  // something that can be bound, or assigned to. In order to do so, they perform
  // a variety of checks:
  //
  // - Check that none of the bound/assigned-to identifiers are reserved words.
  // - Record name declarations for bindings in the appropriate scope.
  // - Check duplicate argument names, if checkClashes is set.
  //
  // If a complex binding pattern is encountered (e.g., object and array
  // destructuring), the entire pattern is recursively checked.
  //
  // There are three versions of checkLVal*() appropriate for different
  // circumstances:
  //
  // - checkLValSimple() shall be used if the syntactic construct supports
  //   nothing other than identifiers and member expressions. Parenthesized
  //   expressions are also correctly handled. This is generally appropriate for
  //   constructs for which the spec says
  //
  //   > It is a Syntax Error if AssignmentTargetType of [the production] is not
  //   > simple.
  //
  //   It is also appropriate for checking if an identifier is valid and not
  //   defined elsewhere, like import declarations or function/class identifiers.
  //
  //   Examples where this is used include:
  //     a += …;
  //     import a from '…';
  //   where a is the node to be checked.
  //
  // - checkLValPattern() shall be used if the syntactic construct supports
  //   anything checkLValSimple() supports, as well as object and array
  //   destructuring patterns. This is generally appropriate for constructs for
  //   which the spec says
  //
  //   > It is a Syntax Error if [the production] is neither an ObjectLiteral nor
  //   > an ArrayLiteral and AssignmentTargetType of [the production] is not
  //   > simple.
  //
  //   Examples where this is used include:
  //     (a = …);
  //     const a = …;
  //     try { … } catch (a) { … }
  //   where a is the node to be checked.
  //
  // - checkLValInnerPattern() shall be used if the syntactic construct supports
  //   anything checkLValPattern() supports, as well as default assignment
  //   patterns, rest elements, and other constructs that may appear within an
  //   object or array destructuring pattern.
  //
  //   As a special case, function parameters also use checkLValInnerPattern(),
  //   as they also support defaults and rest constructs.
  //
  // These functions deliberately support both assignment and binding constructs,
  // as the logic for both is exceedingly similar. If the node is the target of
  // an assignment, then bindingType should be set to BIND_NONE. Otherwise, it
  // should be set to the appropriate BIND_* constant, like BIND_VAR or
  // BIND_LEXICAL.
  //
  // If the function is called with a non-BIND_NONE bindingType, then
  // additionally a checkClashes object may be specified to allow checking for
  // duplicate argument names. checkClashes is ignored if the provided construct
  // is an assignment (i.e., bindingType is BIND_NONE).

  pp$7.checkLValSimple = function(expr, bindingType, checkClashes) {
    if ( bindingType === void 0 ) bindingType = BIND_NONE;

    var isBind = bindingType !== BIND_NONE;

    switch (expr.type) {
    case "Identifier":
      if (this.strict && this.reservedWordsStrictBind.test(expr.name))
        { this.raiseRecoverable(expr.start, (isBind ? "Binding " : "Assigning to ") + expr.name + " in strict mode"); }
      if (isBind) {
        if (bindingType === BIND_LEXICAL && expr.name === "let")
          { this.raiseRecoverable(expr.start, "let is disallowed as a lexically bound name"); }
        if (checkClashes) {
          if (hasOwn(checkClashes, expr.name))
            { this.raiseRecoverable(expr.start, "Argument name clash"); }
          checkClashes[expr.name] = true;
        }
        if (bindingType !== BIND_OUTSIDE) { this.declareName(expr.name, bindingType, expr.start); }
      }
      break

    case "ChainExpression":
      this.raiseRecoverable(expr.start, "Optional chaining cannot appear in left-hand side");
      break

    case "MemberExpression":
      if (isBind) { this.raiseRecoverable(expr.start, "Binding member expression"); }
      break

    case "ParenthesizedExpression":
      if (isBind) { this.raiseRecoverable(expr.start, "Binding parenthesized expression"); }
      return this.checkLValSimple(expr.expression, bindingType, checkClashes)

    default:
      this.raise(expr.start, (isBind ? "Binding" : "Assigning to") + " rvalue");
    }
  };

  pp$7.checkLValPattern = function(expr, bindingType, checkClashes) {
    if ( bindingType === void 0 ) bindingType = BIND_NONE;

    switch (expr.type) {
    case "ObjectPattern":
      for (var i = 0, list = expr.properties; i < list.length; i += 1) {
        var prop = list[i];

      this.checkLValInnerPattern(prop, bindingType, checkClashes);
      }
      break

    case "ArrayPattern":
      for (var i$1 = 0, list$1 = expr.elements; i$1 < list$1.length; i$1 += 1) {
        var elem = list$1[i$1];

      if (elem) { this.checkLValInnerPattern(elem, bindingType, checkClashes); }
      }
      break

    default:
      this.checkLValSimple(expr, bindingType, checkClashes);
    }
  };

  pp$7.checkLValInnerPattern = function(expr, bindingType, checkClashes) {
    if ( bindingType === void 0 ) bindingType = BIND_NONE;

    switch (expr.type) {
    case "Property":
      // AssignmentProperty has type === "Property"
      this.checkLValInnerPattern(expr.value, bindingType, checkClashes);
      break

    case "AssignmentPattern":
      this.checkLValPattern(expr.left, bindingType, checkClashes);
      break

    case "RestElement":
      this.checkLValPattern(expr.argument, bindingType, checkClashes);
      break

    default:
      this.checkLValPattern(expr, bindingType, checkClashes);
    }
  };

  // The algorithm used to determine whether a regexp can appear at a
  // given point in the program is loosely based on sweet.js' approach.
  // See https://github.com/mozilla/sweet.js/wiki/design


  var TokContext = function TokContext(token, isExpr, preserveSpace, override, generator) {
    this.token = token;
    this.isExpr = !!isExpr;
    this.preserveSpace = !!preserveSpace;
    this.override = override;
    this.generator = !!generator;
  };

  var types = {
    b_stat: new TokContext("{", false),
    b_expr: new TokContext("{", true),
    b_tmpl: new TokContext("${", false),
    p_stat: new TokContext("(", false),
    p_expr: new TokContext("(", true),
    q_tmpl: new TokContext("`", true, true, function (p) { return p.tryReadTemplateToken(); }),
    f_stat: new TokContext("function", false),
    f_expr: new TokContext("function", true),
    f_expr_gen: new TokContext("function", true, false, null, true),
    f_gen: new TokContext("function", false, false, null, true)
  };

  var pp$6 = Parser.prototype;

  pp$6.initialContext = function() {
    return [types.b_stat]
  };

  pp$6.curContext = function() {
    return this.context[this.context.length - 1]
  };

  pp$6.braceIsBlock = function(prevType) {
    var parent = this.curContext();
    if (parent === types.f_expr || parent === types.f_stat)
      { return true }
    if (prevType === types$1.colon && (parent === types.b_stat || parent === types.b_expr))
      { return !parent.isExpr }

    // The check for `tt.name && exprAllowed` detects whether we are
    // after a `yield` or `of` construct. See the `updateContext` for
    // `tt.name`.
    if (prevType === types$1._return || prevType === types$1.name && this.exprAllowed)
      { return lineBreak.test(this.input.slice(this.lastTokEnd, this.start)) }
    if (prevType === types$1._else || prevType === types$1.semi || prevType === types$1.eof || prevType === types$1.parenR || prevType === types$1.arrow)
      { return true }
    if (prevType === types$1.braceL)
      { return parent === types.b_stat }
    if (prevType === types$1._var || prevType === types$1._const || prevType === types$1.name)
      { return false }
    return !this.exprAllowed
  };

  pp$6.inGeneratorContext = function() {
    for (var i = this.context.length - 1; i >= 1; i--) {
      var context = this.context[i];
      if (context.token === "function")
        { return context.generator }
    }
    return false
  };

  pp$6.updateContext = function(prevType) {
    var update, type = this.type;
    if (type.keyword && prevType === types$1.dot)
      { this.exprAllowed = false; }
    else if (update = type.updateContext)
      { update.call(this, prevType); }
    else
      { this.exprAllowed = type.beforeExpr; }
  };

  // Used to handle egde cases when token context could not be inferred correctly during tokenization phase

  pp$6.overrideContext = function(tokenCtx) {
    if (this.curContext() !== tokenCtx) {
      this.context[this.context.length - 1] = tokenCtx;
    }
  };

  // Token-specific context update code

  types$1.parenR.updateContext = types$1.braceR.updateContext = function() {
    if (this.context.length === 1) {
      this.exprAllowed = true;
      return
    }
    var out = this.context.pop();
    if (out === types.b_stat && this.curContext().token === "function") {
      out = this.context.pop();
    }
    this.exprAllowed = !out.isExpr;
  };

  types$1.braceL.updateContext = function(prevType) {
    this.context.push(this.braceIsBlock(prevType) ? types.b_stat : types.b_expr);
    this.exprAllowed = true;
  };

  types$1.dollarBraceL.updateContext = function() {
    this.context.push(types.b_tmpl);
    this.exprAllowed = true;
  };

  types$1.parenL.updateContext = function(prevType) {
    var statementParens = prevType === types$1._if || prevType === types$1._for || prevType === types$1._with || prevType === types$1._while;
    this.context.push(statementParens ? types.p_stat : types.p_expr);
    this.exprAllowed = true;
  };

  types$1.incDec.updateContext = function() {
    // tokExprAllowed stays unchanged
  };

  types$1._function.updateContext = types$1._class.updateContext = function(prevType) {
    if (prevType.beforeExpr && prevType !== types$1._else &&
        !(prevType === types$1.semi && this.curContext() !== types.p_stat) &&
        !(prevType === types$1._return && lineBreak.test(this.input.slice(this.lastTokEnd, this.start))) &&
        !((prevType === types$1.colon || prevType === types$1.braceL) && this.curContext() === types.b_stat))
      { this.context.push(types.f_expr); }
    else
      { this.context.push(types.f_stat); }
    this.exprAllowed = false;
  };

  types$1.backQuote.updateContext = function() {
    if (this.curContext() === types.q_tmpl)
      { this.context.pop(); }
    else
      { this.context.push(types.q_tmpl); }
    this.exprAllowed = false;
  };

  types$1.star.updateContext = function(prevType) {
    if (prevType === types$1._function) {
      var index = this.context.length - 1;
      if (this.context[index] === types.f_expr)
        { this.context[index] = types.f_expr_gen; }
      else
        { this.context[index] = types.f_gen; }
    }
    this.exprAllowed = true;
  };

  types$1.name.updateContext = function(prevType) {
    var allowed = false;
    if (this.options.ecmaVersion >= 6 && prevType !== types$1.dot) {
      if (this.value === "of" && !this.exprAllowed ||
          this.value === "yield" && this.inGeneratorContext())
        { allowed = true; }
    }
    this.exprAllowed = allowed;
  };

  // A recursive descent parser operates by defining functions for all
  // syntactic elements, and recursively calling those, each function
  // advancing the input stream and returning an AST node. Precedence
  // of constructs (for example, the fact that `!x[1]` means `!(x[1])`
  // instead of `(!x)[1]` is handled by the fact that the parser
  // function that parses unary prefix operators is called first, and
  // in turn calls the function that parses `[]` subscripts — that
  // way, it'll receive the node for `x[1]` already parsed, and wraps
  // *that* in the unary operator node.
  //
  // Acorn uses an [operator precedence parser][opp] to handle binary
  // operator precedence, because it is much more compact than using
  // the technique outlined above, which uses different, nesting
  // functions to specify precedence, for all of the ten binary
  // precedence levels that JavaScript defines.
  //
  // [opp]: http://en.wikipedia.org/wiki/Operator-precedence_parser


  var pp$5 = Parser.prototype;

  // Check if property name clashes with already added.
  // Object/class getters and setters are not allowed to clash —
  // either with each other or with an init property — and in
  // strict mode, init properties are also not allowed to be repeated.

  pp$5.checkPropClash = function(prop, propHash, refDestructuringErrors) {
    if (this.options.ecmaVersion >= 9 && prop.type === "SpreadElement")
      { return }
    if (this.options.ecmaVersion >= 6 && (prop.computed || prop.method || prop.shorthand))
      { return }
    var key = prop.key;
    var name;
    switch (key.type) {
    case "Identifier": name = key.name; break
    case "Literal": name = String(key.value); break
    default: return
    }
    var kind = prop.kind;
    if (this.options.ecmaVersion >= 6) {
      if (name === "__proto__" && kind === "init") {
        if (propHash.proto) {
          if (refDestructuringErrors) {
            if (refDestructuringErrors.doubleProto < 0) {
              refDestructuringErrors.doubleProto = key.start;
            }
          } else {
            this.raiseRecoverable(key.start, "Redefinition of __proto__ property");
          }
        }
        propHash.proto = true;
      }
      return
    }
    name = "$" + name;
    var other = propHash[name];
    if (other) {
      var redefinition;
      if (kind === "init") {
        redefinition = this.strict && other.init || other.get || other.set;
      } else {
        redefinition = other.init || other[kind];
      }
      if (redefinition)
        { this.raiseRecoverable(key.start, "Redefinition of property"); }
    } else {
      other = propHash[name] = {
        init: false,
        get: false,
        set: false
      };
    }
    other[kind] = true;
  };

  // ### Expression parsing

  // These nest, from the most general expression type at the top to
  // 'atomic', nondivisible expression types at the bottom. Most of
  // the functions will simply let the function(s) below them parse,
  // and, *if* the syntactic construct they handle is present, wrap
  // the AST node that the inner parser gave them in another node.

  // Parse a full expression. The optional arguments are used to
  // forbid the `in` operator (in for loops initalization expressions)
  // and provide reference for storing '=' operator inside shorthand
  // property assignment in contexts where both object expression
  // and object pattern might appear (so it's possible to raise
  // delayed syntax error at correct position).

  pp$5.parseExpression = function(forInit, refDestructuringErrors) {
    var startPos = this.start, startLoc = this.startLoc;
    var expr = this.parseMaybeAssign(forInit, refDestructuringErrors);
    if (this.type === types$1.comma) {
      var node = this.startNodeAt(startPos, startLoc);
      node.expressions = [expr];
      while (this.eat(types$1.comma)) { node.expressions.push(this.parseMaybeAssign(forInit, refDestructuringErrors)); }
      return this.finishNode(node, "SequenceExpression")
    }
    return expr
  };

  // Parse an assignment expression. This includes applications of
  // operators like `+=`.

  pp$5.parseMaybeAssign = function(forInit, refDestructuringErrors, afterLeftParse) {
    if (this.isContextual("yield")) {
      if (this.inGenerator) { return this.parseYield(forInit) }
      // The tokenizer will assume an expression is allowed after
      // `yield`, but this isn't that kind of yield
      else { this.exprAllowed = false; }
    }

    var ownDestructuringErrors = false, oldParenAssign = -1, oldTrailingComma = -1, oldDoubleProto = -1;
    if (refDestructuringErrors) {
      oldParenAssign = refDestructuringErrors.parenthesizedAssign;
      oldTrailingComma = refDestructuringErrors.trailingComma;
      oldDoubleProto = refDestructuringErrors.doubleProto;
      refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = -1;
    } else {
      refDestructuringErrors = new DestructuringErrors;
      ownDestructuringErrors = true;
    }

    var startPos = this.start, startLoc = this.startLoc;
    if (this.type === types$1.parenL || this.type === types$1.name) {
      this.potentialArrowAt = this.start;
      this.potentialArrowInForAwait = forInit === "await";
    }
    var left = this.parseMaybeConditional(forInit, refDestructuringErrors);
    if (afterLeftParse) { left = afterLeftParse.call(this, left, startPos, startLoc); }
    if (this.type.isAssign) {
      var node = this.startNodeAt(startPos, startLoc);
      node.operator = this.value;
      if (this.type === types$1.eq)
        { left = this.toAssignable(left, false, refDestructuringErrors); }
      if (!ownDestructuringErrors) {
        refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = refDestructuringErrors.doubleProto = -1;
      }
      if (refDestructuringErrors.shorthandAssign >= left.start)
        { refDestructuringErrors.shorthandAssign = -1; } // reset because shorthand default was used correctly
      if (this.type === types$1.eq)
        { this.checkLValPattern(left); }
      else
        { this.checkLValSimple(left); }
      node.left = left;
      this.next();
      node.right = this.parseMaybeAssign(forInit);
      if (oldDoubleProto > -1) { refDestructuringErrors.doubleProto = oldDoubleProto; }
      return this.finishNode(node, "AssignmentExpression")
    } else {
      if (ownDestructuringErrors) { this.checkExpressionErrors(refDestructuringErrors, true); }
    }
    if (oldParenAssign > -1) { refDestructuringErrors.parenthesizedAssign = oldParenAssign; }
    if (oldTrailingComma > -1) { refDestructuringErrors.trailingComma = oldTrailingComma; }
    return left
  };

  // Parse a ternary conditional (`?:`) operator.

  pp$5.parseMaybeConditional = function(forInit, refDestructuringErrors) {
    var startPos = this.start, startLoc = this.startLoc;
    var expr = this.parseExprOps(forInit, refDestructuringErrors);
    if (this.checkExpressionErrors(refDestructuringErrors)) { return expr }
    if (this.eat(types$1.question)) {
      var node = this.startNodeAt(startPos, startLoc);
      node.test = expr;
      node.consequent = this.parseMaybeAssign();
      this.expect(types$1.colon);
      node.alternate = this.parseMaybeAssign(forInit);
      return this.finishNode(node, "ConditionalExpression")
    }
    return expr
  };

  // Start the precedence parser.

  pp$5.parseExprOps = function(forInit, refDestructuringErrors) {
    var startPos = this.start, startLoc = this.startLoc;
    var expr = this.parseMaybeUnary(refDestructuringErrors, false, false, forInit);
    if (this.checkExpressionErrors(refDestructuringErrors)) { return expr }
    return expr.start === startPos && expr.type === "ArrowFunctionExpression" ? expr : this.parseExprOp(expr, startPos, startLoc, -1, forInit)
  };

  // Parse binary operators with the operator precedence parsing
  // algorithm. `left` is the left-hand side of the operator.
  // `minPrec` provides context that allows the function to stop and
  // defer further parser to one of its callers when it encounters an
  // operator that has a lower precedence than the set it is parsing.

  pp$5.parseExprOp = function(left, leftStartPos, leftStartLoc, minPrec, forInit) {
    var prec = this.type.binop;
    if (prec != null && (!forInit || this.type !== types$1._in)) {
      if (prec > minPrec) {
        var logical = this.type === types$1.logicalOR || this.type === types$1.logicalAND;
        var coalesce = this.type === types$1.coalesce;
        if (coalesce) {
          // Handle the precedence of `tt.coalesce` as equal to the range of logical expressions.
          // In other words, `node.right` shouldn't contain logical expressions in order to check the mixed error.
          prec = types$1.logicalAND.binop;
        }
        var op = this.value;
        this.next();
        var startPos = this.start, startLoc = this.startLoc;
        var right = this.parseExprOp(this.parseMaybeUnary(null, false, false, forInit), startPos, startLoc, prec, forInit);
        var node = this.buildBinary(leftStartPos, leftStartLoc, left, right, op, logical || coalesce);
        if ((logical && this.type === types$1.coalesce) || (coalesce && (this.type === types$1.logicalOR || this.type === types$1.logicalAND))) {
          this.raiseRecoverable(this.start, "Logical expressions and coalesce expressions cannot be mixed. Wrap either by parentheses");
        }
        return this.parseExprOp(node, leftStartPos, leftStartLoc, minPrec, forInit)
      }
    }
    return left
  };

  pp$5.buildBinary = function(startPos, startLoc, left, right, op, logical) {
    if (right.type === "PrivateIdentifier") { this.raise(right.start, "Private identifier can only be left side of binary expression"); }
    var node = this.startNodeAt(startPos, startLoc);
    node.left = left;
    node.operator = op;
    node.right = right;
    return this.finishNode(node, logical ? "LogicalExpression" : "BinaryExpression")
  };

  // Parse unary operators, both prefix and postfix.

  pp$5.parseMaybeUnary = function(refDestructuringErrors, sawUnary, incDec, forInit) {
    var startPos = this.start, startLoc = this.startLoc, expr;
    if (this.isContextual("await") && this.canAwait) {
      expr = this.parseAwait(forInit);
      sawUnary = true;
    } else if (this.type.prefix) {
      var node = this.startNode(), update = this.type === types$1.incDec;
      node.operator = this.value;
      node.prefix = true;
      this.next();
      node.argument = this.parseMaybeUnary(null, true, update, forInit);
      this.checkExpressionErrors(refDestructuringErrors, true);
      if (update) { this.checkLValSimple(node.argument); }
      else if (this.strict && node.operator === "delete" &&
               node.argument.type === "Identifier")
        { this.raiseRecoverable(node.start, "Deleting local variable in strict mode"); }
      else if (node.operator === "delete" && isPrivateFieldAccess(node.argument))
        { this.raiseRecoverable(node.start, "Private fields can not be deleted"); }
      else { sawUnary = true; }
      expr = this.finishNode(node, update ? "UpdateExpression" : "UnaryExpression");
    } else if (!sawUnary && this.type === types$1.privateId) {
      if ((forInit || this.privateNameStack.length === 0) && this.options.checkPrivateFields) { this.unexpected(); }
      expr = this.parsePrivateIdent();
      // only could be private fields in 'in', such as #x in obj
      if (this.type !== types$1._in) { this.unexpected(); }
    } else {
      expr = this.parseExprSubscripts(refDestructuringErrors, forInit);
      if (this.checkExpressionErrors(refDestructuringErrors)) { return expr }
      while (this.type.postfix && !this.canInsertSemicolon()) {
        var node$1 = this.startNodeAt(startPos, startLoc);
        node$1.operator = this.value;
        node$1.prefix = false;
        node$1.argument = expr;
        this.checkLValSimple(expr);
        this.next();
        expr = this.finishNode(node$1, "UpdateExpression");
      }
    }

    if (!incDec && this.eat(types$1.starstar)) {
      if (sawUnary)
        { this.unexpected(this.lastTokStart); }
      else
        { return this.buildBinary(startPos, startLoc, expr, this.parseMaybeUnary(null, false, false, forInit), "**", false) }
    } else {
      return expr
    }
  };

  function isPrivateFieldAccess(node) {
    return (
      node.type === "MemberExpression" && node.property.type === "PrivateIdentifier" ||
      node.type === "ChainExpression" && isPrivateFieldAccess(node.expression)
    )
  }

  // Parse call, dot, and `[]`-subscript expressions.

  pp$5.parseExprSubscripts = function(refDestructuringErrors, forInit) {
    var startPos = this.start, startLoc = this.startLoc;
    var expr = this.parseExprAtom(refDestructuringErrors, forInit);
    if (expr.type === "ArrowFunctionExpression" && this.input.slice(this.lastTokStart, this.lastTokEnd) !== ")")
      { return expr }
    var result = this.parseSubscripts(expr, startPos, startLoc, false, forInit);
    if (refDestructuringErrors && result.type === "MemberExpression") {
      if (refDestructuringErrors.parenthesizedAssign >= result.start) { refDestructuringErrors.parenthesizedAssign = -1; }
      if (refDestructuringErrors.parenthesizedBind >= result.start) { refDestructuringErrors.parenthesizedBind = -1; }
      if (refDestructuringErrors.trailingComma >= result.start) { refDestructuringErrors.trailingComma = -1; }
    }
    return result
  };

  pp$5.parseSubscripts = function(base, startPos, startLoc, noCalls, forInit) {
    var maybeAsyncArrow = this.options.ecmaVersion >= 8 && base.type === "Identifier" && base.name === "async" &&
        this.lastTokEnd === base.end && !this.canInsertSemicolon() && base.end - base.start === 5 &&
        this.potentialArrowAt === base.start;
    var optionalChained = false;

    while (true) {
      var element = this.parseSubscript(base, startPos, startLoc, noCalls, maybeAsyncArrow, optionalChained, forInit);

      if (element.optional) { optionalChained = true; }
      if (element === base || element.type === "ArrowFunctionExpression") {
        if (optionalChained) {
          var chainNode = this.startNodeAt(startPos, startLoc);
          chainNode.expression = element;
          element = this.finishNode(chainNode, "ChainExpression");
        }
        return element
      }

      base = element;
    }
  };

  pp$5.shouldParseAsyncArrow = function() {
    return !this.canInsertSemicolon() && this.eat(types$1.arrow)
  };

  pp$5.parseSubscriptAsyncArrow = function(startPos, startLoc, exprList, forInit) {
    return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList, true, forInit)
  };

  pp$5.parseSubscript = function(base, startPos, startLoc, noCalls, maybeAsyncArrow, optionalChained, forInit) {
    var optionalSupported = this.options.ecmaVersion >= 11;
    var optional = optionalSupported && this.eat(types$1.questionDot);
    if (noCalls && optional) { this.raise(this.lastTokStart, "Optional chaining cannot appear in the callee of new expressions"); }

    var computed = this.eat(types$1.bracketL);
    if (computed || (optional && this.type !== types$1.parenL && this.type !== types$1.backQuote) || this.eat(types$1.dot)) {
      var node = this.startNodeAt(startPos, startLoc);
      node.object = base;
      if (computed) {
        node.property = this.parseExpression();
        this.expect(types$1.bracketR);
      } else if (this.type === types$1.privateId && base.type !== "Super") {
        node.property = this.parsePrivateIdent();
      } else {
        node.property = this.parseIdent(this.options.allowReserved !== "never");
      }
      node.computed = !!computed;
      if (optionalSupported) {
        node.optional = optional;
      }
      base = this.finishNode(node, "MemberExpression");
    } else if (!noCalls && this.eat(types$1.parenL)) {
      var refDestructuringErrors = new DestructuringErrors, oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
      this.yieldPos = 0;
      this.awaitPos = 0;
      this.awaitIdentPos = 0;
      var exprList = this.parseExprList(types$1.parenR, this.options.ecmaVersion >= 8, false, refDestructuringErrors);
      if (maybeAsyncArrow && !optional && this.shouldParseAsyncArrow()) {
        this.checkPatternErrors(refDestructuringErrors, false);
        this.checkYieldAwaitInDefaultParams();
        if (this.awaitIdentPos > 0)
          { this.raise(this.awaitIdentPos, "Cannot use 'await' as identifier inside an async function"); }
        this.yieldPos = oldYieldPos;
        this.awaitPos = oldAwaitPos;
        this.awaitIdentPos = oldAwaitIdentPos;
        return this.parseSubscriptAsyncArrow(startPos, startLoc, exprList, forInit)
      }
      this.checkExpressionErrors(refDestructuringErrors, true);
      this.yieldPos = oldYieldPos || this.yieldPos;
      this.awaitPos = oldAwaitPos || this.awaitPos;
      this.awaitIdentPos = oldAwaitIdentPos || this.awaitIdentPos;
      var node$1 = this.startNodeAt(startPos, startLoc);
      node$1.callee = base;
      node$1.arguments = exprList;
      if (optionalSupported) {
        node$1.optional = optional;
      }
      base = this.finishNode(node$1, "CallExpression");
    } else if (this.type === types$1.backQuote) {
      if (optional || optionalChained) {
        this.raise(this.start, "Optional chaining cannot appear in the tag of tagged template expressions");
      }
      var node$2 = this.startNodeAt(startPos, startLoc);
      node$2.tag = base;
      node$2.quasi = this.parseTemplate({isTagged: true});
      base = this.finishNode(node$2, "TaggedTemplateExpression");
    }
    return base
  };

  // Parse an atomic expression — either a single token that is an
  // expression, an expression started by a keyword like `function` or
  // `new`, or an expression wrapped in punctuation like `()`, `[]`,
  // or `{}`.

  pp$5.parseExprAtom = function(refDestructuringErrors, forInit, forNew) {
    // If a division operator appears in an expression position, the
    // tokenizer got confused, and we force it to read a regexp instead.
    if (this.type === types$1.slash) { this.readRegexp(); }

    var node, canBeArrow = this.potentialArrowAt === this.start;
    switch (this.type) {
    case types$1._super:
      if (!this.allowSuper)
        { this.raise(this.start, "'super' keyword outside a method"); }
      node = this.startNode();
      this.next();
      if (this.type === types$1.parenL && !this.allowDirectSuper)
        { this.raise(node.start, "super() call outside constructor of a subclass"); }
      // The `super` keyword can appear at below:
      // SuperProperty:
      //     super [ Expression ]
      //     super . IdentifierName
      // SuperCall:
      //     super ( Arguments )
      if (this.type !== types$1.dot && this.type !== types$1.bracketL && this.type !== types$1.parenL)
        { this.unexpected(); }
      return this.finishNode(node, "Super")

    case types$1._this:
      node = this.startNode();
      this.next();
      return this.finishNode(node, "ThisExpression")

    case types$1.name:
      var startPos = this.start, startLoc = this.startLoc, containsEsc = this.containsEsc;
      var id = this.parseIdent(false);
      if (this.options.ecmaVersion >= 8 && !containsEsc && id.name === "async" && !this.canInsertSemicolon() && this.eat(types$1._function)) {
        this.overrideContext(types.f_expr);
        return this.parseFunction(this.startNodeAt(startPos, startLoc), 0, false, true, forInit)
      }
      if (canBeArrow && !this.canInsertSemicolon()) {
        if (this.eat(types$1.arrow))
          { return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id], false, forInit) }
        if (this.options.ecmaVersion >= 8 && id.name === "async" && this.type === types$1.name && !containsEsc &&
            (!this.potentialArrowInForAwait || this.value !== "of" || this.containsEsc)) {
          id = this.parseIdent(false);
          if (this.canInsertSemicolon() || !this.eat(types$1.arrow))
            { this.unexpected(); }
          return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id], true, forInit)
        }
      }
      return id

    case types$1.regexp:
      var value = this.value;
      node = this.parseLiteral(value.value);
      node.regex = {pattern: value.pattern, flags: value.flags};
      return node

    case types$1.num: case types$1.string:
      return this.parseLiteral(this.value)

    case types$1._null: case types$1._true: case types$1._false:
      node = this.startNode();
      node.value = this.type === types$1._null ? null : this.type === types$1._true;
      node.raw = this.type.keyword;
      this.next();
      return this.finishNode(node, "Literal")

    case types$1.parenL:
      var start = this.start, expr = this.parseParenAndDistinguishExpression(canBeArrow, forInit);
      if (refDestructuringErrors) {
        if (refDestructuringErrors.parenthesizedAssign < 0 && !this.isSimpleAssignTarget(expr))
          { refDestructuringErrors.parenthesizedAssign = start; }
        if (refDestructuringErrors.parenthesizedBind < 0)
          { refDestructuringErrors.parenthesizedBind = start; }
      }
      return expr

    case types$1.bracketL:
      node = this.startNode();
      this.next();
      node.elements = this.parseExprList(types$1.bracketR, true, true, refDestructuringErrors);
      return this.finishNode(node, "ArrayExpression")

    case types$1.braceL:
      this.overrideContext(types.b_expr);
      return this.parseObj(false, refDestructuringErrors)

    case types$1._function:
      node = this.startNode();
      this.next();
      return this.parseFunction(node, 0)

    case types$1._class:
      return this.parseClass(this.startNode(), false)

    case types$1._new:
      return this.parseNew()

    case types$1.backQuote:
      return this.parseTemplate()

    case types$1._import:
      if (this.options.ecmaVersion >= 11) {
        return this.parseExprImport(forNew)
      } else {
        return this.unexpected()
      }

    default:
      return this.parseExprAtomDefault()
    }
  };

  pp$5.parseExprAtomDefault = function() {
    this.unexpected();
  };

  pp$5.parseExprImport = function(forNew) {
    var node = this.startNode();

    // Consume `import` as an identifier for `import.meta`.
    // Because `this.parseIdent(true)` doesn't check escape sequences, it needs the check of `this.containsEsc`.
    if (this.containsEsc) { this.raiseRecoverable(this.start, "Escape sequence in keyword import"); }
    var meta = this.parseIdent(true);

    if (this.type === types$1.parenL && !forNew) {
      return this.parseDynamicImport(node)
    } else if (this.type === types$1.dot) {
      node.meta = meta;
      return this.parseImportMeta(node)
    } else {
      this.unexpected();
    }
  };

  pp$5.parseDynamicImport = function(node) {
    this.next(); // skip `(`

    // Parse node.source.
    node.source = this.parseMaybeAssign();

    // Verify ending.
    if (!this.eat(types$1.parenR)) {
      var errorPos = this.start;
      if (this.eat(types$1.comma) && this.eat(types$1.parenR)) {
        this.raiseRecoverable(errorPos, "Trailing comma is not allowed in import()");
      } else {
        this.unexpected(errorPos);
      }
    }

    return this.finishNode(node, "ImportExpression")
  };

  pp$5.parseImportMeta = function(node) {
    this.next(); // skip `.`

    var containsEsc = this.containsEsc;
    node.property = this.parseIdent(true);

    if (node.property.name !== "meta")
      { this.raiseRecoverable(node.property.start, "The only valid meta property for import is 'import.meta'"); }
    if (containsEsc)
      { this.raiseRecoverable(node.start, "'import.meta' must not contain escaped characters"); }
    if (this.options.sourceType !== "module" && !this.options.allowImportExportEverywhere)
      { this.raiseRecoverable(node.start, "Cannot use 'import.meta' outside a module"); }

    return this.finishNode(node, "MetaProperty")
  };

  pp$5.parseLiteral = function(value) {
    var node = this.startNode();
    node.value = value;
    node.raw = this.input.slice(this.start, this.end);
    if (node.raw.charCodeAt(node.raw.length - 1) === 110) { node.bigint = node.raw.slice(0, -1).replace(/_/g, ""); }
    this.next();
    return this.finishNode(node, "Literal")
  };

  pp$5.parseParenExpression = function() {
    this.expect(types$1.parenL);
    var val = this.parseExpression();
    this.expect(types$1.parenR);
    return val
  };

  pp$5.shouldParseArrow = function(exprList) {
    return !this.canInsertSemicolon()
  };

  pp$5.parseParenAndDistinguishExpression = function(canBeArrow, forInit) {
    var startPos = this.start, startLoc = this.startLoc, val, allowTrailingComma = this.options.ecmaVersion >= 8;
    if (this.options.ecmaVersion >= 6) {
      this.next();

      var innerStartPos = this.start, innerStartLoc = this.startLoc;
      var exprList = [], first = true, lastIsComma = false;
      var refDestructuringErrors = new DestructuringErrors, oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, spreadStart;
      this.yieldPos = 0;
      this.awaitPos = 0;
      // Do not save awaitIdentPos to allow checking awaits nested in parameters
      while (this.type !== types$1.parenR) {
        first ? first = false : this.expect(types$1.comma);
        if (allowTrailingComma && this.afterTrailingComma(types$1.parenR, true)) {
          lastIsComma = true;
          break
        } else if (this.type === types$1.ellipsis) {
          spreadStart = this.start;
          exprList.push(this.parseParenItem(this.parseRestBinding()));
          if (this.type === types$1.comma) {
            this.raiseRecoverable(
              this.start,
              "Comma is not permitted after the rest element"
            );
          }
          break
        } else {
          exprList.push(this.parseMaybeAssign(false, refDestructuringErrors, this.parseParenItem));
        }
      }
      var innerEndPos = this.lastTokEnd, innerEndLoc = this.lastTokEndLoc;
      this.expect(types$1.parenR);

      if (canBeArrow && this.shouldParseArrow(exprList) && this.eat(types$1.arrow)) {
        this.checkPatternErrors(refDestructuringErrors, false);
        this.checkYieldAwaitInDefaultParams();
        this.yieldPos = oldYieldPos;
        this.awaitPos = oldAwaitPos;
        return this.parseParenArrowList(startPos, startLoc, exprList, forInit)
      }

      if (!exprList.length || lastIsComma) { this.unexpected(this.lastTokStart); }
      if (spreadStart) { this.unexpected(spreadStart); }
      this.checkExpressionErrors(refDestructuringErrors, true);
      this.yieldPos = oldYieldPos || this.yieldPos;
      this.awaitPos = oldAwaitPos || this.awaitPos;

      if (exprList.length > 1) {
        val = this.startNodeAt(innerStartPos, innerStartLoc);
        val.expressions = exprList;
        this.finishNodeAt(val, "SequenceExpression", innerEndPos, innerEndLoc);
      } else {
        val = exprList[0];
      }
    } else {
      val = this.parseParenExpression();
    }

    if (this.options.preserveParens) {
      var par = this.startNodeAt(startPos, startLoc);
      par.expression = val;
      return this.finishNode(par, "ParenthesizedExpression")
    } else {
      return val
    }
  };

  pp$5.parseParenItem = function(item) {
    return item
  };

  pp$5.parseParenArrowList = function(startPos, startLoc, exprList, forInit) {
    return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList, false, forInit)
  };

  // New's precedence is slightly tricky. It must allow its argument to
  // be a `[]` or dot subscript expression, but not a call — at least,
  // not without wrapping it in parentheses. Thus, it uses the noCalls
  // argument to parseSubscripts to prevent it from consuming the
  // argument list.

  var empty = [];

  pp$5.parseNew = function() {
    if (this.containsEsc) { this.raiseRecoverable(this.start, "Escape sequence in keyword new"); }
    var node = this.startNode();
    var meta = this.parseIdent(true);
    if (this.options.ecmaVersion >= 6 && this.eat(types$1.dot)) {
      node.meta = meta;
      var containsEsc = this.containsEsc;
      node.property = this.parseIdent(true);
      if (node.property.name !== "target")
        { this.raiseRecoverable(node.property.start, "The only valid meta property for new is 'new.target'"); }
      if (containsEsc)
        { this.raiseRecoverable(node.start, "'new.target' must not contain escaped characters"); }
      if (!this.allowNewDotTarget)
        { this.raiseRecoverable(node.start, "'new.target' can only be used in functions and class static block"); }
      return this.finishNode(node, "MetaProperty")
    }
    var startPos = this.start, startLoc = this.startLoc;
    node.callee = this.parseSubscripts(this.parseExprAtom(null, false, true), startPos, startLoc, true, false);
    if (this.eat(types$1.parenL)) { node.arguments = this.parseExprList(types$1.parenR, this.options.ecmaVersion >= 8, false); }
    else { node.arguments = empty; }
    return this.finishNode(node, "NewExpression")
  };

  // Parse template expression.

  pp$5.parseTemplateElement = function(ref) {
    var isTagged = ref.isTagged;

    var elem = this.startNode();
    if (this.type === types$1.invalidTemplate) {
      if (!isTagged) {
        this.raiseRecoverable(this.start, "Bad escape sequence in untagged template literal");
      }
      elem.value = {
        raw: this.value,
        cooked: null
      };
    } else {
      elem.value = {
        raw: this.input.slice(this.start, this.end).replace(/\r\n?/g, "\n"),
        cooked: this.value
      };
    }
    this.next();
    elem.tail = this.type === types$1.backQuote;
    return this.finishNode(elem, "TemplateElement")
  };

  pp$5.parseTemplate = function(ref) {
    if ( ref === void 0 ) ref = {};
    var isTagged = ref.isTagged; if ( isTagged === void 0 ) isTagged = false;

    var node = this.startNode();
    this.next();
    node.expressions = [];
    var curElt = this.parseTemplateElement({isTagged: isTagged});
    node.quasis = [curElt];
    while (!curElt.tail) {
      if (this.type === types$1.eof) { this.raise(this.pos, "Unterminated template literal"); }
      this.expect(types$1.dollarBraceL);
      node.expressions.push(this.parseExpression());
      this.expect(types$1.braceR);
      node.quasis.push(curElt = this.parseTemplateElement({isTagged: isTagged}));
    }
    this.next();
    return this.finishNode(node, "TemplateLiteral")
  };

  pp$5.isAsyncProp = function(prop) {
    return !prop.computed && prop.key.type === "Identifier" && prop.key.name === "async" &&
      (this.type === types$1.name || this.type === types$1.num || this.type === types$1.string || this.type === types$1.bracketL || this.type.keyword || (this.options.ecmaVersion >= 9 && this.type === types$1.star)) &&
      !lineBreak.test(this.input.slice(this.lastTokEnd, this.start))
  };

  // Parse an object literal or binding pattern.

  pp$5.parseObj = function(isPattern, refDestructuringErrors) {
    var node = this.startNode(), first = true, propHash = {};
    node.properties = [];
    this.next();
    while (!this.eat(types$1.braceR)) {
      if (!first) {
        this.expect(types$1.comma);
        if (this.options.ecmaVersion >= 5 && this.afterTrailingComma(types$1.braceR)) { break }
      } else { first = false; }

      var prop = this.parseProperty(isPattern, refDestructuringErrors);
      if (!isPattern) { this.checkPropClash(prop, propHash, refDestructuringErrors); }
      node.properties.push(prop);
    }
    return this.finishNode(node, isPattern ? "ObjectPattern" : "ObjectExpression")
  };

  pp$5.parseProperty = function(isPattern, refDestructuringErrors) {
    var prop = this.startNode(), isGenerator, isAsync, startPos, startLoc;
    if (this.options.ecmaVersion >= 9 && this.eat(types$1.ellipsis)) {
      if (isPattern) {
        prop.argument = this.parseIdent(false);
        if (this.type === types$1.comma) {
          this.raiseRecoverable(this.start, "Comma is not permitted after the rest element");
        }
        return this.finishNode(prop, "RestElement")
      }
      // Parse argument.
      prop.argument = this.parseMaybeAssign(false, refDestructuringErrors);
      // To disallow trailing comma via `this.toAssignable()`.
      if (this.type === types$1.comma && refDestructuringErrors && refDestructuringErrors.trailingComma < 0) {
        refDestructuringErrors.trailingComma = this.start;
      }
      // Finish
      return this.finishNode(prop, "SpreadElement")
    }
    if (this.options.ecmaVersion >= 6) {
      prop.method = false;
      prop.shorthand = false;
      if (isPattern || refDestructuringErrors) {
        startPos = this.start;
        startLoc = this.startLoc;
      }
      if (!isPattern)
        { isGenerator = this.eat(types$1.star); }
    }
    var containsEsc = this.containsEsc;
    this.parsePropertyName(prop);
    if (!isPattern && !containsEsc && this.options.ecmaVersion >= 8 && !isGenerator && this.isAsyncProp(prop)) {
      isAsync = true;
      isGenerator = this.options.ecmaVersion >= 9 && this.eat(types$1.star);
      this.parsePropertyName(prop);
    } else {
      isAsync = false;
    }
    this.parsePropertyValue(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc);
    return this.finishNode(prop, "Property")
  };

  pp$5.parseGetterSetter = function(prop) {
    prop.kind = prop.key.name;
    this.parsePropertyName(prop);
    prop.value = this.parseMethod(false);
    var paramCount = prop.kind === "get" ? 0 : 1;
    if (prop.value.params.length !== paramCount) {
      var start = prop.value.start;
      if (prop.kind === "get")
        { this.raiseRecoverable(start, "getter should have no params"); }
      else
        { this.raiseRecoverable(start, "setter should have exactly one param"); }
    } else {
      if (prop.kind === "set" && prop.value.params[0].type === "RestElement")
        { this.raiseRecoverable(prop.value.params[0].start, "Setter cannot use rest params"); }
    }
  };

  pp$5.parsePropertyValue = function(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc) {
    if ((isGenerator || isAsync) && this.type === types$1.colon)
      { this.unexpected(); }

    if (this.eat(types$1.colon)) {
      prop.value = isPattern ? this.parseMaybeDefault(this.start, this.startLoc) : this.parseMaybeAssign(false, refDestructuringErrors);
      prop.kind = "init";
    } else if (this.options.ecmaVersion >= 6 && this.type === types$1.parenL) {
      if (isPattern) { this.unexpected(); }
      prop.kind = "init";
      prop.method = true;
      prop.value = this.parseMethod(isGenerator, isAsync);
    } else if (!isPattern && !containsEsc &&
               this.options.ecmaVersion >= 5 && !prop.computed && prop.key.type === "Identifier" &&
               (prop.key.name === "get" || prop.key.name === "set") &&
               (this.type !== types$1.comma && this.type !== types$1.braceR && this.type !== types$1.eq)) {
      if (isGenerator || isAsync) { this.unexpected(); }
      this.parseGetterSetter(prop);
    } else if (this.options.ecmaVersion >= 6 && !prop.computed && prop.key.type === "Identifier") {
      if (isGenerator || isAsync) { this.unexpected(); }
      this.checkUnreserved(prop.key);
      if (prop.key.name === "await" && !this.awaitIdentPos)
        { this.awaitIdentPos = startPos; }
      prop.kind = "init";
      if (isPattern) {
        prop.value = this.parseMaybeDefault(startPos, startLoc, this.copyNode(prop.key));
      } else if (this.type === types$1.eq && refDestructuringErrors) {
        if (refDestructuringErrors.shorthandAssign < 0)
          { refDestructuringErrors.shorthandAssign = this.start; }
        prop.value = this.parseMaybeDefault(startPos, startLoc, this.copyNode(prop.key));
      } else {
        prop.value = this.copyNode(prop.key);
      }
      prop.shorthand = true;
    } else { this.unexpected(); }
  };

  pp$5.parsePropertyName = function(prop) {
    if (this.options.ecmaVersion >= 6) {
      if (this.eat(types$1.bracketL)) {
        prop.computed = true;
        prop.key = this.parseMaybeAssign();
        this.expect(types$1.bracketR);
        return prop.key
      } else {
        prop.computed = false;
      }
    }
    return prop.key = this.type === types$1.num || this.type === types$1.string ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== "never")
  };

  // Initialize empty function node.

  pp$5.initFunction = function(node) {
    node.id = null;
    if (this.options.ecmaVersion >= 6) { node.generator = node.expression = false; }
    if (this.options.ecmaVersion >= 8) { node.async = false; }
  };

  // Parse object or class method.

  pp$5.parseMethod = function(isGenerator, isAsync, allowDirectSuper) {
    var node = this.startNode(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;

    this.initFunction(node);
    if (this.options.ecmaVersion >= 6)
      { node.generator = isGenerator; }
    if (this.options.ecmaVersion >= 8)
      { node.async = !!isAsync; }

    this.yieldPos = 0;
    this.awaitPos = 0;
    this.awaitIdentPos = 0;
    this.enterScope(functionFlags(isAsync, node.generator) | SCOPE_SUPER | (allowDirectSuper ? SCOPE_DIRECT_SUPER : 0));

    this.expect(types$1.parenL);
    node.params = this.parseBindingList(types$1.parenR, false, this.options.ecmaVersion >= 8);
    this.checkYieldAwaitInDefaultParams();
    this.parseFunctionBody(node, false, true, false);

    this.yieldPos = oldYieldPos;
    this.awaitPos = oldAwaitPos;
    this.awaitIdentPos = oldAwaitIdentPos;
    return this.finishNode(node, "FunctionExpression")
  };

  // Parse arrow function expression with given parameters.

  pp$5.parseArrowExpression = function(node, params, isAsync, forInit) {
    var oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;

    this.enterScope(functionFlags(isAsync, false) | SCOPE_ARROW);
    this.initFunction(node);
    if (this.options.ecmaVersion >= 8) { node.async = !!isAsync; }

    this.yieldPos = 0;
    this.awaitPos = 0;
    this.awaitIdentPos = 0;

    node.params = this.toAssignableList(params, true);
    this.parseFunctionBody(node, true, false, forInit);

    this.yieldPos = oldYieldPos;
    this.awaitPos = oldAwaitPos;
    this.awaitIdentPos = oldAwaitIdentPos;
    return this.finishNode(node, "ArrowFunctionExpression")
  };

  // Parse function body and check parameters.

  pp$5.parseFunctionBody = function(node, isArrowFunction, isMethod, forInit) {
    var isExpression = isArrowFunction && this.type !== types$1.braceL;
    var oldStrict = this.strict, useStrict = false;

    if (isExpression) {
      node.body = this.parseMaybeAssign(forInit);
      node.expression = true;
      this.checkParams(node, false);
    } else {
      var nonSimple = this.options.ecmaVersion >= 7 && !this.isSimpleParamList(node.params);
      if (!oldStrict || nonSimple) {
        useStrict = this.strictDirective(this.end);
        // If this is a strict mode function, verify that argument names
        // are not repeated, and it does not try to bind the words `eval`
        // or `arguments`.
        if (useStrict && nonSimple)
          { this.raiseRecoverable(node.start, "Illegal 'use strict' directive in function with non-simple parameter list"); }
      }
      // Start a new scope with regard to labels and the `inFunction`
      // flag (restore them to their old value afterwards).
      var oldLabels = this.labels;
      this.labels = [];
      if (useStrict) { this.strict = true; }

      // Add the params to varDeclaredNames to ensure that an error is thrown
      // if a let/const declaration in the function clashes with one of the params.
      this.checkParams(node, !oldStrict && !useStrict && !isArrowFunction && !isMethod && this.isSimpleParamList(node.params));
      // Ensure the function name isn't a forbidden identifier in strict mode, e.g. 'eval'
      if (this.strict && node.id) { this.checkLValSimple(node.id, BIND_OUTSIDE); }
      node.body = this.parseBlock(false, undefined, useStrict && !oldStrict);
      node.expression = false;
      this.adaptDirectivePrologue(node.body.body);
      this.labels = oldLabels;
    }
    this.exitScope();
  };

  pp$5.isSimpleParamList = function(params) {
    for (var i = 0, list = params; i < list.length; i += 1)
      {
      var param = list[i];

      if (param.type !== "Identifier") { return false
    } }
    return true
  };

  // Checks function params for various disallowed patterns such as using "eval"
  // or "arguments" and duplicate parameters.

  pp$5.checkParams = function(node, allowDuplicates) {
    var nameHash = Object.create(null);
    for (var i = 0, list = node.params; i < list.length; i += 1)
      {
      var param = list[i];

      this.checkLValInnerPattern(param, BIND_VAR, allowDuplicates ? null : nameHash);
    }
  };

  // Parses a comma-separated list of expressions, and returns them as
  // an array. `close` is the token type that ends the list, and
  // `allowEmpty` can be turned on to allow subsequent commas with
  // nothing in between them to be parsed as `null` (which is needed
  // for array literals).

  pp$5.parseExprList = function(close, allowTrailingComma, allowEmpty, refDestructuringErrors) {
    var elts = [], first = true;
    while (!this.eat(close)) {
      if (!first) {
        this.expect(types$1.comma);
        if (allowTrailingComma && this.afterTrailingComma(close)) { break }
      } else { first = false; }

      var elt = (void 0);
      if (allowEmpty && this.type === types$1.comma)
        { elt = null; }
      else if (this.type === types$1.ellipsis) {
        elt = this.parseSpread(refDestructuringErrors);
        if (refDestructuringErrors && this.type === types$1.comma && refDestructuringErrors.trailingComma < 0)
          { refDestructuringErrors.trailingComma = this.start; }
      } else {
        elt = this.parseMaybeAssign(false, refDestructuringErrors);
      }
      elts.push(elt);
    }
    return elts
  };

  pp$5.checkUnreserved = function(ref) {
    var start = ref.start;
    var end = ref.end;
    var name = ref.name;

    if (this.inGenerator && name === "yield")
      { this.raiseRecoverable(start, "Cannot use 'yield' as identifier inside a generator"); }
    if (this.inAsync && name === "await")
      { this.raiseRecoverable(start, "Cannot use 'await' as identifier inside an async function"); }
    if (this.currentThisScope().inClassFieldInit && name === "arguments")
      { this.raiseRecoverable(start, "Cannot use 'arguments' in class field initializer"); }
    if (this.inClassStaticBlock && (name === "arguments" || name === "await"))
      { this.raise(start, ("Cannot use " + name + " in class static initialization block")); }
    if (this.keywords.test(name))
      { this.raise(start, ("Unexpected keyword '" + name + "'")); }
    if (this.options.ecmaVersion < 6 &&
      this.input.slice(start, end).indexOf("\\") !== -1) { return }
    var re = this.strict ? this.reservedWordsStrict : this.reservedWords;
    if (re.test(name)) {
      if (!this.inAsync && name === "await")
        { this.raiseRecoverable(start, "Cannot use keyword 'await' outside an async function"); }
      this.raiseRecoverable(start, ("The keyword '" + name + "' is reserved"));
    }
  };

  // Parse the next token as an identifier. If `liberal` is true (used
  // when parsing properties), it will also convert keywords into
  // identifiers.

  pp$5.parseIdent = function(liberal) {
    var node = this.parseIdentNode();
    this.next(!!liberal);
    this.finishNode(node, "Identifier");
    if (!liberal) {
      this.checkUnreserved(node);
      if (node.name === "await" && !this.awaitIdentPos)
        { this.awaitIdentPos = node.start; }
    }
    return node
  };

  pp$5.parseIdentNode = function() {
    var node = this.startNode();
    if (this.type === types$1.name) {
      node.name = this.value;
    } else if (this.type.keyword) {
      node.name = this.type.keyword;

      // To fix https://github.com/acornjs/acorn/issues/575
      // `class` and `function` keywords push new context into this.context.
      // But there is no chance to pop the context if the keyword is consumed as an identifier such as a property name.
      // If the previous token is a dot, this does not apply because the context-managing code already ignored the keyword
      if ((node.name === "class" || node.name === "function") &&
        (this.lastTokEnd !== this.lastTokStart + 1 || this.input.charCodeAt(this.lastTokStart) !== 46)) {
        this.context.pop();
      }
    } else {
      this.unexpected();
    }
    return node
  };

  pp$5.parsePrivateIdent = function() {
    var node = this.startNode();
    if (this.type === types$1.privateId) {
      node.name = this.value;
    } else {
      this.unexpected();
    }
    this.next();
    this.finishNode(node, "PrivateIdentifier");

    // For validating existence
    if (this.options.checkPrivateFields) {
      if (this.privateNameStack.length === 0) {
        this.raise(node.start, ("Private field '#" + (node.name) + "' must be declared in an enclosing class"));
      } else {
        this.privateNameStack[this.privateNameStack.length - 1].used.push(node);
      }
    }

    return node
  };

  // Parses yield expression inside generator.

  pp$5.parseYield = function(forInit) {
    if (!this.yieldPos) { this.yieldPos = this.start; }

    var node = this.startNode();
    this.next();
    if (this.type === types$1.semi || this.canInsertSemicolon() || (this.type !== types$1.star && !this.type.startsExpr)) {
      node.delegate = false;
      node.argument = null;
    } else {
      node.delegate = this.eat(types$1.star);
      node.argument = this.parseMaybeAssign(forInit);
    }
    return this.finishNode(node, "YieldExpression")
  };

  pp$5.parseAwait = function(forInit) {
    if (!this.awaitPos) { this.awaitPos = this.start; }

    var node = this.startNode();
    this.next();
    node.argument = this.parseMaybeUnary(null, true, false, forInit);
    return this.finishNode(node, "AwaitExpression")
  };

  var pp$4 = Parser.prototype;

  // This function is used to raise exceptions on parse errors. It
  // takes an offset integer (into the current `input`) to indicate
  // the location of the error, attaches the position to the end
  // of the error message, and then raises a `SyntaxError` with that
  // message.

  pp$4.raise = function(pos, message) {
    var loc = getLineInfo(this.input, pos);
    message += " (" + loc.line + ":" + loc.column + ")";
    var err = new SyntaxError(message);
    err.pos = pos; err.loc = loc; err.raisedAt = this.pos;
    throw err
  };

  pp$4.raiseRecoverable = pp$4.raise;

  pp$4.curPosition = function() {
    if (this.options.locations) {
      return new Position(this.curLine, this.pos - this.lineStart)
    }
  };

  var pp$3 = Parser.prototype;

  var Scope = function Scope(flags) {
    this.flags = flags;
    // A list of var-declared names in the current lexical scope
    this.var = [];
    // A list of lexically-declared names in the current lexical scope
    this.lexical = [];
    // A list of lexically-declared FunctionDeclaration names in the current lexical scope
    this.functions = [];
    // A switch to disallow the identifier reference 'arguments'
    this.inClassFieldInit = false;
  };

  // The functions in this module keep track of declared variables in the current scope in order to detect duplicate variable names.

  pp$3.enterScope = function(flags) {
    this.scopeStack.push(new Scope(flags));
  };

  pp$3.exitScope = function() {
    this.scopeStack.pop();
  };

  // The spec says:
  // > At the top level of a function, or script, function declarations are
  // > treated like var declarations rather than like lexical declarations.
  pp$3.treatFunctionsAsVarInScope = function(scope) {
    return (scope.flags & SCOPE_FUNCTION) || !this.inModule && (scope.flags & SCOPE_TOP)
  };

  pp$3.declareName = function(name, bindingType, pos) {
    var redeclared = false;
    if (bindingType === BIND_LEXICAL) {
      var scope = this.currentScope();
      redeclared = scope.lexical.indexOf(name) > -1 || scope.functions.indexOf(name) > -1 || scope.var.indexOf(name) > -1;
      scope.lexical.push(name);
      if (this.inModule && (scope.flags & SCOPE_TOP))
        { delete this.undefinedExports[name]; }
    } else if (bindingType === BIND_SIMPLE_CATCH) {
      var scope$1 = this.currentScope();
      scope$1.lexical.push(name);
    } else if (bindingType === BIND_FUNCTION) {
      var scope$2 = this.currentScope();
      if (this.treatFunctionsAsVar)
        { redeclared = scope$2.lexical.indexOf(name) > -1; }
      else
        { redeclared = scope$2.lexical.indexOf(name) > -1 || scope$2.var.indexOf(name) > -1; }
      scope$2.functions.push(name);
    } else {
      for (var i = this.scopeStack.length - 1; i >= 0; --i) {
        var scope$3 = this.scopeStack[i];
        if (scope$3.lexical.indexOf(name) > -1 && !((scope$3.flags & SCOPE_SIMPLE_CATCH) && scope$3.lexical[0] === name) ||
            !this.treatFunctionsAsVarInScope(scope$3) && scope$3.functions.indexOf(name) > -1) {
          redeclared = true;
          break
        }
        scope$3.var.push(name);
        if (this.inModule && (scope$3.flags & SCOPE_TOP))
          { delete this.undefinedExports[name]; }
        if (scope$3.flags & SCOPE_VAR) { break }
      }
    }
    if (redeclared) { this.raiseRecoverable(pos, ("Identifier '" + name + "' has already been declared")); }
  };

  pp$3.checkLocalExport = function(id) {
    // scope.functions must be empty as Module code is always strict.
    if (this.scopeStack[0].lexical.indexOf(id.name) === -1 &&
        this.scopeStack[0].var.indexOf(id.name) === -1) {
      this.undefinedExports[id.name] = id;
    }
  };

  pp$3.currentScope = function() {
    return this.scopeStack[this.scopeStack.length - 1]
  };

  pp$3.currentVarScope = function() {
    for (var i = this.scopeStack.length - 1;; i--) {
      var scope = this.scopeStack[i];
      if (scope.flags & SCOPE_VAR) { return scope }
    }
  };

  // Could be useful for `this`, `new.target`, `super()`, `super.property`, and `super[property]`.
  pp$3.currentThisScope = function() {
    for (var i = this.scopeStack.length - 1;; i--) {
      var scope = this.scopeStack[i];
      if (scope.flags & SCOPE_VAR && !(scope.flags & SCOPE_ARROW)) { return scope }
    }
  };

  var Node = function Node(parser, pos, loc) {
    this.type = "";
    this.start = pos;
    this.end = 0;
    if (parser.options.locations)
      { this.loc = new SourceLocation(parser, loc); }
    if (parser.options.directSourceFile)
      { this.sourceFile = parser.options.directSourceFile; }
    if (parser.options.ranges)
      { this.range = [pos, 0]; }
  };

  // Start an AST node, attaching a start offset.

  var pp$2 = Parser.prototype;

  pp$2.startNode = function() {
    return new Node(this, this.start, this.startLoc)
  };

  pp$2.startNodeAt = function(pos, loc) {
    return new Node(this, pos, loc)
  };

  // Finish an AST node, adding `type` and `end` properties.

  function finishNodeAt(node, type, pos, loc) {
    node.type = type;
    node.end = pos;
    if (this.options.locations)
      { node.loc.end = loc; }
    if (this.options.ranges)
      { node.range[1] = pos; }
    return node
  }

  pp$2.finishNode = function(node, type) {
    return finishNodeAt.call(this, node, type, this.lastTokEnd, this.lastTokEndLoc)
  };

  // Finish node at given position

  pp$2.finishNodeAt = function(node, type, pos, loc) {
    return finishNodeAt.call(this, node, type, pos, loc)
  };

  pp$2.copyNode = function(node) {
    var newNode = new Node(this, node.start, this.startLoc);
    for (var prop in node) { newNode[prop] = node[prop]; }
    return newNode
  };

  // This file contains Unicode properties extracted from the ECMAScript specification.
  // The lists are extracted like so:
  // $$('#table-binary-unicode-properties > figure > table > tbody > tr > td:nth-child(1) code').map(el => el.innerText)

  // #table-binary-unicode-properties
  var ecma9BinaryProperties = "ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS";
  var ecma10BinaryProperties = ecma9BinaryProperties + " Extended_Pictographic";
  var ecma11BinaryProperties = ecma10BinaryProperties;
  var ecma12BinaryProperties = ecma11BinaryProperties + " EBase EComp EMod EPres ExtPict";
  var ecma13BinaryProperties = ecma12BinaryProperties;
  var ecma14BinaryProperties = ecma13BinaryProperties;

  var unicodeBinaryProperties = {
    9: ecma9BinaryProperties,
    10: ecma10BinaryProperties,
    11: ecma11BinaryProperties,
    12: ecma12BinaryProperties,
    13: ecma13BinaryProperties,
    14: ecma14BinaryProperties
  };

  // #table-binary-unicode-properties-of-strings
  var ecma14BinaryPropertiesOfStrings = "Basic_Emoji Emoji_Keycap_Sequence RGI_Emoji_Modifier_Sequence RGI_Emoji_Flag_Sequence RGI_Emoji_Tag_Sequence RGI_Emoji_ZWJ_Sequence RGI_Emoji";

  var unicodeBinaryPropertiesOfStrings = {
    9: "",
    10: "",
    11: "",
    12: "",
    13: "",
    14: ecma14BinaryPropertiesOfStrings
  };

  // #table-unicode-general-category-values
  var unicodeGeneralCategoryValues = "Cased_Letter LC Close_Punctuation Pe Connector_Punctuation Pc Control Cc cntrl Currency_Symbol Sc Dash_Punctuation Pd Decimal_Number Nd digit Enclosing_Mark Me Final_Punctuation Pf Format Cf Initial_Punctuation Pi Letter L Letter_Number Nl Line_Separator Zl Lowercase_Letter Ll Mark M Combining_Mark Math_Symbol Sm Modifier_Letter Lm Modifier_Symbol Sk Nonspacing_Mark Mn Number N Open_Punctuation Ps Other C Other_Letter Lo Other_Number No Other_Punctuation Po Other_Symbol So Paragraph_Separator Zp Private_Use Co Punctuation P punct Separator Z Space_Separator Zs Spacing_Mark Mc Surrogate Cs Symbol S Titlecase_Letter Lt Unassigned Cn Uppercase_Letter Lu";

  // #table-unicode-script-values
  var ecma9ScriptValues = "Adlam Adlm Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb";
  var ecma10ScriptValues = ecma9ScriptValues + " Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd";
  var ecma11ScriptValues = ecma10ScriptValues + " Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho";
  var ecma12ScriptValues = ecma11ScriptValues + " Chorasmian Chrs Diak Dives_Akuru Khitan_Small_Script Kits Yezi Yezidi";
  var ecma13ScriptValues = ecma12ScriptValues + " Cypro_Minoan Cpmn Old_Uyghur Ougr Tangsa Tnsa Toto Vithkuqi Vith";
  var ecma14ScriptValues = ecma13ScriptValues + " Hrkt Katakana_Or_Hiragana Kawi Nag_Mundari Nagm Unknown Zzzz";

  var unicodeScriptValues = {
    9: ecma9ScriptValues,
    10: ecma10ScriptValues,
    11: ecma11ScriptValues,
    12: ecma12ScriptValues,
    13: ecma13ScriptValues,
    14: ecma14ScriptValues
  };

  var data = {};
  function buildUnicodeData(ecmaVersion) {
    var d = data[ecmaVersion] = {
      binary: wordsRegexp(unicodeBinaryProperties[ecmaVersion] + " " + unicodeGeneralCategoryValues),
      binaryOfStrings: wordsRegexp(unicodeBinaryPropertiesOfStrings[ecmaVersion]),
      nonBinary: {
        General_Category: wordsRegexp(unicodeGeneralCategoryValues),
        Script: wordsRegexp(unicodeScriptValues[ecmaVersion])
      }
    };
    d.nonBinary.Script_Extensions = d.nonBinary.Script;

    d.nonBinary.gc = d.nonBinary.General_Category;
    d.nonBinary.sc = d.nonBinary.Script;
    d.nonBinary.scx = d.nonBinary.Script_Extensions;
  }

  for (var i = 0, list = [9, 10, 11, 12, 13, 14]; i < list.length; i += 1) {
    var ecmaVersion = list[i];

    buildUnicodeData(ecmaVersion);
  }

  var pp$1 = Parser.prototype;

  var RegExpValidationState = function RegExpValidationState(parser) {
    this.parser = parser;
    this.validFlags = "gim" + (parser.options.ecmaVersion >= 6 ? "uy" : "") + (parser.options.ecmaVersion >= 9 ? "s" : "") + (parser.options.ecmaVersion >= 13 ? "d" : "") + (parser.options.ecmaVersion >= 15 ? "v" : "");
    this.unicodeProperties = data[parser.options.ecmaVersion >= 14 ? 14 : parser.options.ecmaVersion];
    this.source = "";
    this.flags = "";
    this.start = 0;
    this.switchU = false;
    this.switchV = false;
    this.switchN = false;
    this.pos = 0;
    this.lastIntValue = 0;
    this.lastStringValue = "";
    this.lastAssertionIsQuantifiable = false;
    this.numCapturingParens = 0;
    this.maxBackReference = 0;
    this.groupNames = [];
    this.backReferenceNames = [];
  };

  RegExpValidationState.prototype.reset = function reset (start, pattern, flags) {
    var unicodeSets = flags.indexOf("v") !== -1;
    var unicode = flags.indexOf("u") !== -1;
    this.start = start | 0;
    this.source = pattern + "";
    this.flags = flags;
    if (unicodeSets && this.parser.options.ecmaVersion >= 15) {
      this.switchU = true;
      this.switchV = true;
      this.switchN = true;
    } else {
      this.switchU = unicode && this.parser.options.ecmaVersion >= 6;
      this.switchV = false;
      this.switchN = unicode && this.parser.options.ecmaVersion >= 9;
    }
  };

  RegExpValidationState.prototype.raise = function raise (message) {
    this.parser.raiseRecoverable(this.start, ("Invalid regular expression: /" + (this.source) + "/: " + message));
  };

  // If u flag is given, this returns the code point at the index (it combines a surrogate pair).
  // Otherwise, this returns the code unit of the index (can be a part of a surrogate pair).
  RegExpValidationState.prototype.at = function at (i, forceU) {
      if ( forceU === void 0 ) forceU = false;

    var s = this.source;
    var l = s.length;
    if (i >= l) {
      return -1
    }
    var c = s.charCodeAt(i);
    if (!(forceU || this.switchU) || c <= 0xD7FF || c >= 0xE000 || i + 1 >= l) {
      return c
    }
    var next = s.charCodeAt(i + 1);
    return next >= 0xDC00 && next <= 0xDFFF ? (c << 10) + next - 0x35FDC00 : c
  };

  RegExpValidationState.prototype.nextIndex = function nextIndex (i, forceU) {
      if ( forceU === void 0 ) forceU = false;

    var s = this.source;
    var l = s.length;
    if (i >= l) {
      return l
    }
    var c = s.charCodeAt(i), next;
    if (!(forceU || this.switchU) || c <= 0xD7FF || c >= 0xE000 || i + 1 >= l ||
        (next = s.charCodeAt(i + 1)) < 0xDC00 || next > 0xDFFF) {
      return i + 1
    }
    return i + 2
  };

  RegExpValidationState.prototype.current = function current (forceU) {
      if ( forceU === void 0 ) forceU = false;

    return this.at(this.pos, forceU)
  };

  RegExpValidationState.prototype.lookahead = function lookahead (forceU) {
      if ( forceU === void 0 ) forceU = false;

    return this.at(this.nextIndex(this.pos, forceU), forceU)
  };

  RegExpValidationState.prototype.advance = function advance (forceU) {
      if ( forceU === void 0 ) forceU = false;

    this.pos = this.nextIndex(this.pos, forceU);
  };

  RegExpValidationState.prototype.eat = function eat (ch, forceU) {
      if ( forceU === void 0 ) forceU = false;

    if (this.current(forceU) === ch) {
      this.advance(forceU);
      return true
    }
    return false
  };

  RegExpValidationState.prototype.eatChars = function eatChars (chs, forceU) {
      if ( forceU === void 0 ) forceU = false;

    var pos = this.pos;
    for (var i = 0, list = chs; i < list.length; i += 1) {
      var ch = list[i];

        var current = this.at(pos, forceU);
      if (current === -1 || current !== ch) {
        return false
      }
      pos = this.nextIndex(pos, forceU);
    }
    this.pos = pos;
    return true
  };

  /**
   * Validate the flags part of a given RegExpLiteral.
   *
   * @param {RegExpValidationState} state The state to validate RegExp.
   * @returns {void}
   */
  pp$1.validateRegExpFlags = function(state) {
    var validFlags = state.validFlags;
    var flags = state.flags;

    var u = false;
    var v = false;

    for (var i = 0; i < flags.length; i++) {
      var flag = flags.charAt(i);
      if (validFlags.indexOf(flag) === -1) {
        this.raise(state.start, "Invalid regular expression flag");
      }
      if (flags.indexOf(flag, i + 1) > -1) {
        this.raise(state.start, "Duplicate regular expression flag");
      }
      if (flag === "u") { u = true; }
      if (flag === "v") { v = true; }
    }
    if (this.options.ecmaVersion >= 15 && u && v) {
      this.raise(state.start, "Invalid regular expression flag");
    }
  };

  /**
   * Validate the pattern part of a given RegExpLiteral.
   *
   * @param {RegExpValidationState} state The state to validate RegExp.
   * @returns {void}
   */
  pp$1.validateRegExpPattern = function(state) {
    this.regexp_pattern(state);

    // The goal symbol for the parse is |Pattern[~U, ~N]|. If the result of
    // parsing contains a |GroupName|, reparse with the goal symbol
    // |Pattern[~U, +N]| and use this result instead. Throw a *SyntaxError*
    // exception if _P_ did not conform to the grammar, if any elements of _P_
    // were not matched by the parse, or if any Early Error conditions exist.
    if (!state.switchN && this.options.ecmaVersion >= 9 && state.groupNames.length > 0) {
      state.switchN = true;
      this.regexp_pattern(state);
    }
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-Pattern
  pp$1.regexp_pattern = function(state) {
    state.pos = 0;
    state.lastIntValue = 0;
    state.lastStringValue = "";
    state.lastAssertionIsQuantifiable = false;
    state.numCapturingParens = 0;
    state.maxBackReference = 0;
    state.groupNames.length = 0;
    state.backReferenceNames.length = 0;

    this.regexp_disjunction(state);

    if (state.pos !== state.source.length) {
      // Make the same messages as V8.
      if (state.eat(0x29 /* ) */)) {
        state.raise("Unmatched ')'");
      }
      if (state.eat(0x5D /* ] */) || state.eat(0x7D /* } */)) {
        state.raise("Lone quantifier brackets");
      }
    }
    if (state.maxBackReference > state.numCapturingParens) {
      state.raise("Invalid escape");
    }
    for (var i = 0, list = state.backReferenceNames; i < list.length; i += 1) {
      var name = list[i];

      if (state.groupNames.indexOf(name) === -1) {
        state.raise("Invalid named capture referenced");
      }
    }
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-Disjunction
  pp$1.regexp_disjunction = function(state) {
    this.regexp_alternative(state);
    while (state.eat(0x7C /* | */)) {
      this.regexp_alternative(state);
    }

    // Make the same message as V8.
    if (this.regexp_eatQuantifier(state, true)) {
      state.raise("Nothing to repeat");
    }
    if (state.eat(0x7B /* { */)) {
      state.raise("Lone quantifier brackets");
    }
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-Alternative
  pp$1.regexp_alternative = function(state) {
    while (state.pos < state.source.length && this.regexp_eatTerm(state))
      { }
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-Term
  pp$1.regexp_eatTerm = function(state) {
    if (this.regexp_eatAssertion(state)) {
      // Handle `QuantifiableAssertion Quantifier` alternative.
      // `state.lastAssertionIsQuantifiable` is true if the last eaten Assertion
      // is a QuantifiableAssertion.
      if (state.lastAssertionIsQuantifiable && this.regexp_eatQuantifier(state)) {
        // Make the same message as V8.
        if (state.switchU) {
          state.raise("Invalid quantifier");
        }
      }
      return true
    }

    if (state.switchU ? this.regexp_eatAtom(state) : this.regexp_eatExtendedAtom(state)) {
      this.regexp_eatQuantifier(state);
      return true
    }

    return false
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-Assertion
  pp$1.regexp_eatAssertion = function(state) {
    var start = state.pos;
    state.lastAssertionIsQuantifiable = false;

    // ^, $
    if (state.eat(0x5E /* ^ */) || state.eat(0x24 /* $ */)) {
      return true
    }

    // \b \B
    if (state.eat(0x5C /* \ */)) {
      if (state.eat(0x42 /* B */) || state.eat(0x62 /* b */)) {
        return true
      }
      state.pos = start;
    }

    // Lookahead / Lookbehind
    if (state.eat(0x28 /* ( */) && state.eat(0x3F /* ? */)) {
      var lookbehind = false;
      if (this.options.ecmaVersion >= 9) {
        lookbehind = state.eat(0x3C /* < */);
      }
      if (state.eat(0x3D /* = */) || state.eat(0x21 /* ! */)) {
        this.regexp_disjunction(state);
        if (!state.eat(0x29 /* ) */)) {
          state.raise("Unterminated group");
        }
        state.lastAssertionIsQuantifiable = !lookbehind;
        return true
      }
    }

    state.pos = start;
    return false
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-Quantifier
  pp$1.regexp_eatQuantifier = function(state, noError) {
    if ( noError === void 0 ) noError = false;

    if (this.regexp_eatQuantifierPrefix(state, noError)) {
      state.eat(0x3F /* ? */);
      return true
    }
    return false
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-QuantifierPrefix
  pp$1.regexp_eatQuantifierPrefix = function(state, noError) {
    return (
      state.eat(0x2A /* * */) ||
      state.eat(0x2B /* + */) ||
      state.eat(0x3F /* ? */) ||
      this.regexp_eatBracedQuantifier(state, noError)
    )
  };
  pp$1.regexp_eatBracedQuantifier = function(state, noError) {
    var start = state.pos;
    if (state.eat(0x7B /* { */)) {
      var min = 0, max = -1;
      if (this.regexp_eatDecimalDigits(state)) {
        min = state.lastIntValue;
        if (state.eat(0x2C /* , */) && this.regexp_eatDecimalDigits(state)) {
          max = state.lastIntValue;
        }
        if (state.eat(0x7D /* } */)) {
          // SyntaxError in https://www.ecma-international.org/ecma-262/8.0/#sec-term
          if (max !== -1 && max < min && !noError) {
            state.raise("numbers out of order in {} quantifier");
          }
          return true
        }
      }
      if (state.switchU && !noError) {
        state.raise("Incomplete quantifier");
      }
      state.pos = start;
    }
    return false
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-Atom
  pp$1.regexp_eatAtom = function(state) {
    return (
      this.regexp_eatPatternCharacters(state) ||
      state.eat(0x2E /* . */) ||
      this.regexp_eatReverseSolidusAtomEscape(state) ||
      this.regexp_eatCharacterClass(state) ||
      this.regexp_eatUncapturingGroup(state) ||
      this.regexp_eatCapturingGroup(state)
    )
  };
  pp$1.regexp_eatReverseSolidusAtomEscape = function(state) {
    var start = state.pos;
    if (state.eat(0x5C /* \ */)) {
      if (this.regexp_eatAtomEscape(state)) {
        return true
      }
      state.pos = start;
    }
    return false
  };
  pp$1.regexp_eatUncapturingGroup = function(state) {
    var start = state.pos;
    if (state.eat(0x28 /* ( */)) {
      if (state.eat(0x3F /* ? */) && state.eat(0x3A /* : */)) {
        this.regexp_disjunction(state);
        if (state.eat(0x29 /* ) */)) {
          return true
        }
        state.raise("Unterminated group");
      }
      state.pos = start;
    }
    return false
  };
  pp$1.regexp_eatCapturingGroup = function(state) {
    if (state.eat(0x28 /* ( */)) {
      if (this.options.ecmaVersion >= 9) {
        this.regexp_groupSpecifier(state);
      } else if (state.current() === 0x3F /* ? */) {
        state.raise("Invalid group");
      }
      this.regexp_disjunction(state);
      if (state.eat(0x29 /* ) */)) {
        state.numCapturingParens += 1;
        return true
      }
      state.raise("Unterminated group");
    }
    return false
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-ExtendedAtom
  pp$1.regexp_eatExtendedAtom = function(state) {
    return (
      state.eat(0x2E /* . */) ||
      this.regexp_eatReverseSolidusAtomEscape(state) ||
      this.regexp_eatCharacterClass(state) ||
      this.regexp_eatUncapturingGroup(state) ||
      this.regexp_eatCapturingGroup(state) ||
      this.regexp_eatInvalidBracedQuantifier(state) ||
      this.regexp_eatExtendedPatternCharacter(state)
    )
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-InvalidBracedQuantifier
  pp$1.regexp_eatInvalidBracedQuantifier = function(state) {
    if (this.regexp_eatBracedQuantifier(state, true)) {
      state.raise("Nothing to repeat");
    }
    return false
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-SyntaxCharacter
  pp$1.regexp_eatSyntaxCharacter = function(state) {
    var ch = state.current();
    if (isSyntaxCharacter(ch)) {
      state.lastIntValue = ch;
      state.advance();
      return true
    }
    return false
  };
  function isSyntaxCharacter(ch) {
    return (
      ch === 0x24 /* $ */ ||
      ch >= 0x28 /* ( */ && ch <= 0x2B /* + */ ||
      ch === 0x2E /* . */ ||
      ch === 0x3F /* ? */ ||
      ch >= 0x5B /* [ */ && ch <= 0x5E /* ^ */ ||
      ch >= 0x7B /* { */ && ch <= 0x7D /* } */
    )
  }

  // https://www.ecma-international.org/ecma-262/8.0/#prod-PatternCharacter
  // But eat eager.
  pp$1.regexp_eatPatternCharacters = function(state) {
    var start = state.pos;
    var ch = 0;
    while ((ch = state.current()) !== -1 && !isSyntaxCharacter(ch)) {
      state.advance();
    }
    return state.pos !== start
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-ExtendedPatternCharacter
  pp$1.regexp_eatExtendedPatternCharacter = function(state) {
    var ch = state.current();
    if (
      ch !== -1 &&
      ch !== 0x24 /* $ */ &&
      !(ch >= 0x28 /* ( */ && ch <= 0x2B /* + */) &&
      ch !== 0x2E /* . */ &&
      ch !== 0x3F /* ? */ &&
      ch !== 0x5B /* [ */ &&
      ch !== 0x5E /* ^ */ &&
      ch !== 0x7C /* | */
    ) {
      state.advance();
      return true
    }
    return false
  };

  // GroupSpecifier ::
  //   [empty]
  //   `?` GroupName
  pp$1.regexp_groupSpecifier = function(state) {
    if (state.eat(0x3F /* ? */)) {
      if (this.regexp_eatGroupName(state)) {
        if (state.groupNames.indexOf(state.lastStringValue) !== -1) {
          state.raise("Duplicate capture group name");
        }
        state.groupNames.push(state.lastStringValue);
        return
      }
      state.raise("Invalid group");
    }
  };

  // GroupName ::
  //   `<` RegExpIdentifierName `>`
  // Note: this updates `state.lastStringValue` property with the eaten name.
  pp$1.regexp_eatGroupName = function(state) {
    state.lastStringValue = "";
    if (state.eat(0x3C /* < */)) {
      if (this.regexp_eatRegExpIdentifierName(state) && state.eat(0x3E /* > */)) {
        return true
      }
      state.raise("Invalid capture group name");
    }
    return false
  };

  // RegExpIdentifierName ::
  //   RegExpIdentifierStart
  //   RegExpIdentifierName RegExpIdentifierPart
  // Note: this updates `state.lastStringValue` property with the eaten name.
  pp$1.regexp_eatRegExpIdentifierName = function(state) {
    state.lastStringValue = "";
    if (this.regexp_eatRegExpIdentifierStart(state)) {
      state.lastStringValue += codePointToString(state.lastIntValue);
      while (this.regexp_eatRegExpIdentifierPart(state)) {
        state.lastStringValue += codePointToString(state.lastIntValue);
      }
      return true
    }
    return false
  };

  // RegExpIdentifierStart ::
  //   UnicodeIDStart
  //   `$`
  //   `_`
  //   `\` RegExpUnicodeEscapeSequence[+U]
  pp$1.regexp_eatRegExpIdentifierStart = function(state) {
    var start = state.pos;
    var forceU = this.options.ecmaVersion >= 11;
    var ch = state.current(forceU);
    state.advance(forceU);

    if (ch === 0x5C /* \ */ && this.regexp_eatRegExpUnicodeEscapeSequence(state, forceU)) {
      ch = state.lastIntValue;
    }
    if (isRegExpIdentifierStart(ch)) {
      state.lastIntValue = ch;
      return true
    }

    state.pos = start;
    return false
  };
  function isRegExpIdentifierStart(ch) {
    return isIdentifierStart(ch, true) || ch === 0x24 /* $ */ || ch === 0x5F /* _ */
  }

  // RegExpIdentifierPart ::
  //   UnicodeIDContinue
  //   `$`
  //   `_`
  //   `\` RegExpUnicodeEscapeSequence[+U]
  //   <ZWNJ>
  //   <ZWJ>
  pp$1.regexp_eatRegExpIdentifierPart = function(state) {
    var start = state.pos;
    var forceU = this.options.ecmaVersion >= 11;
    var ch = state.current(forceU);
    state.advance(forceU);

    if (ch === 0x5C /* \ */ && this.regexp_eatRegExpUnicodeEscapeSequence(state, forceU)) {
      ch = state.lastIntValue;
    }
    if (isRegExpIdentifierPart(ch)) {
      state.lastIntValue = ch;
      return true
    }

    state.pos = start;
    return false
  };
  function isRegExpIdentifierPart(ch) {
    return isIdentifierChar(ch, true) || ch === 0x24 /* $ */ || ch === 0x5F /* _ */ || ch === 0x200C /* <ZWNJ> */ || ch === 0x200D /* <ZWJ> */
  }

  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-AtomEscape
  pp$1.regexp_eatAtomEscape = function(state) {
    if (
      this.regexp_eatBackReference(state) ||
      this.regexp_eatCharacterClassEscape(state) ||
      this.regexp_eatCharacterEscape(state) ||
      (state.switchN && this.regexp_eatKGroupName(state))
    ) {
      return true
    }
    if (state.switchU) {
      // Make the same message as V8.
      if (state.current() === 0x63 /* c */) {
        state.raise("Invalid unicode escape");
      }
      state.raise("Invalid escape");
    }
    return false
  };
  pp$1.regexp_eatBackReference = function(state) {
    var start = state.pos;
    if (this.regexp_eatDecimalEscape(state)) {
      var n = state.lastIntValue;
      if (state.switchU) {
        // For SyntaxError in https://www.ecma-international.org/ecma-262/8.0/#sec-atomescape
        if (n > state.maxBackReference) {
          state.maxBackReference = n;
        }
        return true
      }
      if (n <= state.numCapturingParens) {
        return true
      }
      state.pos = start;
    }
    return false
  };
  pp$1.regexp_eatKGroupName = function(state) {
    if (state.eat(0x6B /* k */)) {
      if (this.regexp_eatGroupName(state)) {
        state.backReferenceNames.push(state.lastStringValue);
        return true
      }
      state.raise("Invalid named reference");
    }
    return false
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-CharacterEscape
  pp$1.regexp_eatCharacterEscape = function(state) {
    return (
      this.regexp_eatControlEscape(state) ||
      this.regexp_eatCControlLetter(state) ||
      this.regexp_eatZero(state) ||
      this.regexp_eatHexEscapeSequence(state) ||
      this.regexp_eatRegExpUnicodeEscapeSequence(state, false) ||
      (!state.switchU && this.regexp_eatLegacyOctalEscapeSequence(state)) ||
      this.regexp_eatIdentityEscape(state)
    )
  };
  pp$1.regexp_eatCControlLetter = function(state) {
    var start = state.pos;
    if (state.eat(0x63 /* c */)) {
      if (this.regexp_eatControlLetter(state)) {
        return true
      }
      state.pos = start;
    }
    return false
  };
  pp$1.regexp_eatZero = function(state) {
    if (state.current() === 0x30 /* 0 */ && !isDecimalDigit(state.lookahead())) {
      state.lastIntValue = 0;
      state.advance();
      return true
    }
    return false
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-ControlEscape
  pp$1.regexp_eatControlEscape = function(state) {
    var ch = state.current();
    if (ch === 0x74 /* t */) {
      state.lastIntValue = 0x09; /* \t */
      state.advance();
      return true
    }
    if (ch === 0x6E /* n */) {
      state.lastIntValue = 0x0A; /* \n */
      state.advance();
      return true
    }
    if (ch === 0x76 /* v */) {
      state.lastIntValue = 0x0B; /* \v */
      state.advance();
      return true
    }
    if (ch === 0x66 /* f */) {
      state.lastIntValue = 0x0C; /* \f */
      state.advance();
      return true
    }
    if (ch === 0x72 /* r */) {
      state.lastIntValue = 0x0D; /* \r */
      state.advance();
      return true
    }
    return false
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-ControlLetter
  pp$1.regexp_eatControlLetter = function(state) {
    var ch = state.current();
    if (isControlLetter(ch)) {
      state.lastIntValue = ch % 0x20;
      state.advance();
      return true
    }
    return false
  };
  function isControlLetter(ch) {
    return (
      (ch >= 0x41 /* A */ && ch <= 0x5A /* Z */) ||
      (ch >= 0x61 /* a */ && ch <= 0x7A /* z */)
    )
  }

  // https://www.ecma-international.org/ecma-262/8.0/#prod-RegExpUnicodeEscapeSequence
  pp$1.regexp_eatRegExpUnicodeEscapeSequence = function(state, forceU) {
    if ( forceU === void 0 ) forceU = false;

    var start = state.pos;
    var switchU = forceU || state.switchU;

    if (state.eat(0x75 /* u */)) {
      if (this.regexp_eatFixedHexDigits(state, 4)) {
        var lead = state.lastIntValue;
        if (switchU && lead >= 0xD800 && lead <= 0xDBFF) {
          var leadSurrogateEnd = state.pos;
          if (state.eat(0x5C /* \ */) && state.eat(0x75 /* u */) && this.regexp_eatFixedHexDigits(state, 4)) {
            var trail = state.lastIntValue;
            if (trail >= 0xDC00 && trail <= 0xDFFF) {
              state.lastIntValue = (lead - 0xD800) * 0x400 + (trail - 0xDC00) + 0x10000;
              return true
            }
          }
          state.pos = leadSurrogateEnd;
          state.lastIntValue = lead;
        }
        return true
      }
      if (
        switchU &&
        state.eat(0x7B /* { */) &&
        this.regexp_eatHexDigits(state) &&
        state.eat(0x7D /* } */) &&
        isValidUnicode(state.lastIntValue)
      ) {
        return true
      }
      if (switchU) {
        state.raise("Invalid unicode escape");
      }
      state.pos = start;
    }

    return false
  };
  function isValidUnicode(ch) {
    return ch >= 0 && ch <= 0x10FFFF
  }

  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-IdentityEscape
  pp$1.regexp_eatIdentityEscape = function(state) {
    if (state.switchU) {
      if (this.regexp_eatSyntaxCharacter(state)) {
        return true
      }
      if (state.eat(0x2F /* / */)) {
        state.lastIntValue = 0x2F; /* / */
        return true
      }
      return false
    }

    var ch = state.current();
    if (ch !== 0x63 /* c */ && (!state.switchN || ch !== 0x6B /* k */)) {
      state.lastIntValue = ch;
      state.advance();
      return true
    }

    return false
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-DecimalEscape
  pp$1.regexp_eatDecimalEscape = function(state) {
    state.lastIntValue = 0;
    var ch = state.current();
    if (ch >= 0x31 /* 1 */ && ch <= 0x39 /* 9 */) {
      do {
        state.lastIntValue = 10 * state.lastIntValue + (ch - 0x30 /* 0 */);
        state.advance();
      } while ((ch = state.current()) >= 0x30 /* 0 */ && ch <= 0x39 /* 9 */)
      return true
    }
    return false
  };

  // Return values used by character set parsing methods, needed to
  // forbid negation of sets that can match strings.
  var CharSetNone = 0; // Nothing parsed
  var CharSetOk = 1; // Construct parsed, cannot contain strings
  var CharSetString = 2; // Construct parsed, can contain strings

  // https://www.ecma-international.org/ecma-262/8.0/#prod-CharacterClassEscape
  pp$1.regexp_eatCharacterClassEscape = function(state) {
    var ch = state.current();

    if (isCharacterClassEscape(ch)) {
      state.lastIntValue = -1;
      state.advance();
      return CharSetOk
    }

    var negate = false;
    if (
      state.switchU &&
      this.options.ecmaVersion >= 9 &&
      ((negate = ch === 0x50 /* P */) || ch === 0x70 /* p */)
    ) {
      state.lastIntValue = -1;
      state.advance();
      var result;
      if (
        state.eat(0x7B /* { */) &&
        (result = this.regexp_eatUnicodePropertyValueExpression(state)) &&
        state.eat(0x7D /* } */)
      ) {
        if (negate && result === CharSetString) { state.raise("Invalid property name"); }
        return result
      }
      state.raise("Invalid property name");
    }

    return CharSetNone
  };

  function isCharacterClassEscape(ch) {
    return (
      ch === 0x64 /* d */ ||
      ch === 0x44 /* D */ ||
      ch === 0x73 /* s */ ||
      ch === 0x53 /* S */ ||
      ch === 0x77 /* w */ ||
      ch === 0x57 /* W */
    )
  }

  // UnicodePropertyValueExpression ::
  //   UnicodePropertyName `=` UnicodePropertyValue
  //   LoneUnicodePropertyNameOrValue
  pp$1.regexp_eatUnicodePropertyValueExpression = function(state) {
    var start = state.pos;

    // UnicodePropertyName `=` UnicodePropertyValue
    if (this.regexp_eatUnicodePropertyName(state) && state.eat(0x3D /* = */)) {
      var name = state.lastStringValue;
      if (this.regexp_eatUnicodePropertyValue(state)) {
        var value = state.lastStringValue;
        this.regexp_validateUnicodePropertyNameAndValue(state, name, value);
        return CharSetOk
      }
    }
    state.pos = start;

    // LoneUnicodePropertyNameOrValue
    if (this.regexp_eatLoneUnicodePropertyNameOrValue(state)) {
      var nameOrValue = state.lastStringValue;
      return this.regexp_validateUnicodePropertyNameOrValue(state, nameOrValue)
    }
    return CharSetNone
  };

  pp$1.regexp_validateUnicodePropertyNameAndValue = function(state, name, value) {
    if (!hasOwn(state.unicodeProperties.nonBinary, name))
      { state.raise("Invalid property name"); }
    if (!state.unicodeProperties.nonBinary[name].test(value))
      { state.raise("Invalid property value"); }
  };

  pp$1.regexp_validateUnicodePropertyNameOrValue = function(state, nameOrValue) {
    if (state.unicodeProperties.binary.test(nameOrValue)) { return CharSetOk }
    if (state.switchV && state.unicodeProperties.binaryOfStrings.test(nameOrValue)) { return CharSetString }
    state.raise("Invalid property name");
  };

  // UnicodePropertyName ::
  //   UnicodePropertyNameCharacters
  pp$1.regexp_eatUnicodePropertyName = function(state) {
    var ch = 0;
    state.lastStringValue = "";
    while (isUnicodePropertyNameCharacter(ch = state.current())) {
      state.lastStringValue += codePointToString(ch);
      state.advance();
    }
    return state.lastStringValue !== ""
  };

  function isUnicodePropertyNameCharacter(ch) {
    return isControlLetter(ch) || ch === 0x5F /* _ */
  }

  // UnicodePropertyValue ::
  //   UnicodePropertyValueCharacters
  pp$1.regexp_eatUnicodePropertyValue = function(state) {
    var ch = 0;
    state.lastStringValue = "";
    while (isUnicodePropertyValueCharacter(ch = state.current())) {
      state.lastStringValue += codePointToString(ch);
      state.advance();
    }
    return state.lastStringValue !== ""
  };
  function isUnicodePropertyValueCharacter(ch) {
    return isUnicodePropertyNameCharacter(ch) || isDecimalDigit(ch)
  }

  // LoneUnicodePropertyNameOrValue ::
  //   UnicodePropertyValueCharacters
  pp$1.regexp_eatLoneUnicodePropertyNameOrValue = function(state) {
    return this.regexp_eatUnicodePropertyValue(state)
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-CharacterClass
  pp$1.regexp_eatCharacterClass = function(state) {
    if (state.eat(0x5B /* [ */)) {
      var negate = state.eat(0x5E /* ^ */);
      var result = this.regexp_classContents(state);
      if (!state.eat(0x5D /* ] */))
        { state.raise("Unterminated character class"); }
      if (negate && result === CharSetString)
        { state.raise("Negated character class may contain strings"); }
      return true
    }
    return false
  };

  // https://tc39.es/ecma262/#prod-ClassContents
  // https://www.ecma-international.org/ecma-262/8.0/#prod-ClassRanges
  pp$1.regexp_classContents = function(state) {
    if (state.current() === 0x5D /* ] */) { return CharSetOk }
    if (state.switchV) { return this.regexp_classSetExpression(state) }
    this.regexp_nonEmptyClassRanges(state);
    return CharSetOk
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-NonemptyClassRanges
  // https://www.ecma-international.org/ecma-262/8.0/#prod-NonemptyClassRangesNoDash
  pp$1.regexp_nonEmptyClassRanges = function(state) {
    while (this.regexp_eatClassAtom(state)) {
      var left = state.lastIntValue;
      if (state.eat(0x2D /* - */) && this.regexp_eatClassAtom(state)) {
        var right = state.lastIntValue;
        if (state.switchU && (left === -1 || right === -1)) {
          state.raise("Invalid character class");
        }
        if (left !== -1 && right !== -1 && left > right) {
          state.raise("Range out of order in character class");
        }
      }
    }
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-ClassAtom
  // https://www.ecma-international.org/ecma-262/8.0/#prod-ClassAtomNoDash
  pp$1.regexp_eatClassAtom = function(state) {
    var start = state.pos;

    if (state.eat(0x5C /* \ */)) {
      if (this.regexp_eatClassEscape(state)) {
        return true
      }
      if (state.switchU) {
        // Make the same message as V8.
        var ch$1 = state.current();
        if (ch$1 === 0x63 /* c */ || isOctalDigit(ch$1)) {
          state.raise("Invalid class escape");
        }
        state.raise("Invalid escape");
      }
      state.pos = start;
    }

    var ch = state.current();
    if (ch !== 0x5D /* ] */) {
      state.lastIntValue = ch;
      state.advance();
      return true
    }

    return false
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-ClassEscape
  pp$1.regexp_eatClassEscape = function(state) {
    var start = state.pos;

    if (state.eat(0x62 /* b */)) {
      state.lastIntValue = 0x08; /* <BS> */
      return true
    }

    if (state.switchU && state.eat(0x2D /* - */)) {
      state.lastIntValue = 0x2D; /* - */
      return true
    }

    if (!state.switchU && state.eat(0x63 /* c */)) {
      if (this.regexp_eatClassControlLetter(state)) {
        return true
      }
      state.pos = start;
    }

    return (
      this.regexp_eatCharacterClassEscape(state) ||
      this.regexp_eatCharacterEscape(state)
    )
  };

  // https://tc39.es/ecma262/#prod-ClassSetExpression
  // https://tc39.es/ecma262/#prod-ClassUnion
  // https://tc39.es/ecma262/#prod-ClassIntersection
  // https://tc39.es/ecma262/#prod-ClassSubtraction
  pp$1.regexp_classSetExpression = function(state) {
    var result = CharSetOk, subResult;
    if (this.regexp_eatClassSetRange(state)) ; else if (subResult = this.regexp_eatClassSetOperand(state)) {
      if (subResult === CharSetString) { result = CharSetString; }
      // https://tc39.es/ecma262/#prod-ClassIntersection
      var start = state.pos;
      while (state.eatChars([0x26, 0x26] /* && */)) {
        if (
          state.current() !== 0x26 /* & */ &&
          (subResult = this.regexp_eatClassSetOperand(state))
        ) {
          if (subResult !== CharSetString) { result = CharSetOk; }
          continue
        }
        state.raise("Invalid character in character class");
      }
      if (start !== state.pos) { return result }
      // https://tc39.es/ecma262/#prod-ClassSubtraction
      while (state.eatChars([0x2D, 0x2D] /* -- */)) {
        if (this.regexp_eatClassSetOperand(state)) { continue }
        state.raise("Invalid character in character class");
      }
      if (start !== state.pos) { return result }
    } else {
      state.raise("Invalid character in character class");
    }
    // https://tc39.es/ecma262/#prod-ClassUnion
    for (;;) {
      if (this.regexp_eatClassSetRange(state)) { continue }
      subResult = this.regexp_eatClassSetOperand(state);
      if (!subResult) { return result }
      if (subResult === CharSetString) { result = CharSetString; }
    }
  };

  // https://tc39.es/ecma262/#prod-ClassSetRange
  pp$1.regexp_eatClassSetRange = function(state) {
    var start = state.pos;
    if (this.regexp_eatClassSetCharacter(state)) {
      var left = state.lastIntValue;
      if (state.eat(0x2D /* - */) && this.regexp_eatClassSetCharacter(state)) {
        var right = state.lastIntValue;
        if (left !== -1 && right !== -1 && left > right) {
          state.raise("Range out of order in character class");
        }
        return true
      }
      state.pos = start;
    }
    return false
  };

  // https://tc39.es/ecma262/#prod-ClassSetOperand
  pp$1.regexp_eatClassSetOperand = function(state) {
    if (this.regexp_eatClassSetCharacter(state)) { return CharSetOk }
    return this.regexp_eatClassStringDisjunction(state) || this.regexp_eatNestedClass(state)
  };

  // https://tc39.es/ecma262/#prod-NestedClass
  pp$1.regexp_eatNestedClass = function(state) {
    var start = state.pos;
    if (state.eat(0x5B /* [ */)) {
      var negate = state.eat(0x5E /* ^ */);
      var result = this.regexp_classContents(state);
      if (state.eat(0x5D /* ] */)) {
        if (negate && result === CharSetString) {
          state.raise("Negated character class may contain strings");
        }
        return result
      }
      state.pos = start;
    }
    if (state.eat(0x5C /* \ */)) {
      var result$1 = this.regexp_eatCharacterClassEscape(state);
      if (result$1) {
        return result$1
      }
      state.pos = start;
    }
    return null
  };

  // https://tc39.es/ecma262/#prod-ClassStringDisjunction
  pp$1.regexp_eatClassStringDisjunction = function(state) {
    var start = state.pos;
    if (state.eatChars([0x5C, 0x71] /* \q */)) {
      if (state.eat(0x7B /* { */)) {
        var result = this.regexp_classStringDisjunctionContents(state);
        if (state.eat(0x7D /* } */)) {
          return result
        }
      } else {
        // Make the same message as V8.
        state.raise("Invalid escape");
      }
      state.pos = start;
    }
    return null
  };

  // https://tc39.es/ecma262/#prod-ClassStringDisjunctionContents
  pp$1.regexp_classStringDisjunctionContents = function(state) {
    var result = this.regexp_classString(state);
    while (state.eat(0x7C /* | */)) {
      if (this.regexp_classString(state) === CharSetString) { result = CharSetString; }
    }
    return result
  };

  // https://tc39.es/ecma262/#prod-ClassString
  // https://tc39.es/ecma262/#prod-NonEmptyClassString
  pp$1.regexp_classString = function(state) {
    var count = 0;
    while (this.regexp_eatClassSetCharacter(state)) { count++; }
    return count === 1 ? CharSetOk : CharSetString
  };

  // https://tc39.es/ecma262/#prod-ClassSetCharacter
  pp$1.regexp_eatClassSetCharacter = function(state) {
    var start = state.pos;
    if (state.eat(0x5C /* \ */)) {
      if (
        this.regexp_eatCharacterEscape(state) ||
        this.regexp_eatClassSetReservedPunctuator(state)
      ) {
        return true
      }
      if (state.eat(0x62 /* b */)) {
        state.lastIntValue = 0x08; /* <BS> */
        return true
      }
      state.pos = start;
      return false
    }
    var ch = state.current();
    if (ch < 0 || ch === state.lookahead() && isClassSetReservedDoublePunctuatorCharacter(ch)) { return false }
    if (isClassSetSyntaxCharacter(ch)) { return false }
    state.advance();
    state.lastIntValue = ch;
    return true
  };

  // https://tc39.es/ecma262/#prod-ClassSetReservedDoublePunctuator
  function isClassSetReservedDoublePunctuatorCharacter(ch) {
    return (
      ch === 0x21 /* ! */ ||
      ch >= 0x23 /* # */ && ch <= 0x26 /* & */ ||
      ch >= 0x2A /* * */ && ch <= 0x2C /* , */ ||
      ch === 0x2E /* . */ ||
      ch >= 0x3A /* : */ && ch <= 0x40 /* @ */ ||
      ch === 0x5E /* ^ */ ||
      ch === 0x60 /* ` */ ||
      ch === 0x7E /* ~ */
    )
  }

  // https://tc39.es/ecma262/#prod-ClassSetSyntaxCharacter
  function isClassSetSyntaxCharacter(ch) {
    return (
      ch === 0x28 /* ( */ ||
      ch === 0x29 /* ) */ ||
      ch === 0x2D /* - */ ||
      ch === 0x2F /* / */ ||
      ch >= 0x5B /* [ */ && ch <= 0x5D /* ] */ ||
      ch >= 0x7B /* { */ && ch <= 0x7D /* } */
    )
  }

  // https://tc39.es/ecma262/#prod-ClassSetReservedPunctuator
  pp$1.regexp_eatClassSetReservedPunctuator = function(state) {
    var ch = state.current();
    if (isClassSetReservedPunctuator(ch)) {
      state.lastIntValue = ch;
      state.advance();
      return true
    }
    return false
  };

  // https://tc39.es/ecma262/#prod-ClassSetReservedPunctuator
  function isClassSetReservedPunctuator(ch) {
    return (
      ch === 0x21 /* ! */ ||
      ch === 0x23 /* # */ ||
      ch === 0x25 /* % */ ||
      ch === 0x26 /* & */ ||
      ch === 0x2C /* , */ ||
      ch === 0x2D /* - */ ||
      ch >= 0x3A /* : */ && ch <= 0x3E /* > */ ||
      ch === 0x40 /* @ */ ||
      ch === 0x60 /* ` */ ||
      ch === 0x7E /* ~ */
    )
  }

  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-ClassControlLetter
  pp$1.regexp_eatClassControlLetter = function(state) {
    var ch = state.current();
    if (isDecimalDigit(ch) || ch === 0x5F /* _ */) {
      state.lastIntValue = ch % 0x20;
      state.advance();
      return true
    }
    return false
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-HexEscapeSequence
  pp$1.regexp_eatHexEscapeSequence = function(state) {
    var start = state.pos;
    if (state.eat(0x78 /* x */)) {
      if (this.regexp_eatFixedHexDigits(state, 2)) {
        return true
      }
      if (state.switchU) {
        state.raise("Invalid escape");
      }
      state.pos = start;
    }
    return false
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-DecimalDigits
  pp$1.regexp_eatDecimalDigits = function(state) {
    var start = state.pos;
    var ch = 0;
    state.lastIntValue = 0;
    while (isDecimalDigit(ch = state.current())) {
      state.lastIntValue = 10 * state.lastIntValue + (ch - 0x30 /* 0 */);
      state.advance();
    }
    return state.pos !== start
  };
  function isDecimalDigit(ch) {
    return ch >= 0x30 /* 0 */ && ch <= 0x39 /* 9 */
  }

  // https://www.ecma-international.org/ecma-262/8.0/#prod-HexDigits
  pp$1.regexp_eatHexDigits = function(state) {
    var start = state.pos;
    var ch = 0;
    state.lastIntValue = 0;
    while (isHexDigit(ch = state.current())) {
      state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch);
      state.advance();
    }
    return state.pos !== start
  };
  function isHexDigit(ch) {
    return (
      (ch >= 0x30 /* 0 */ && ch <= 0x39 /* 9 */) ||
      (ch >= 0x41 /* A */ && ch <= 0x46 /* F */) ||
      (ch >= 0x61 /* a */ && ch <= 0x66 /* f */)
    )
  }
  function hexToInt(ch) {
    if (ch >= 0x41 /* A */ && ch <= 0x46 /* F */) {
      return 10 + (ch - 0x41 /* A */)
    }
    if (ch >= 0x61 /* a */ && ch <= 0x66 /* f */) {
      return 10 + (ch - 0x61 /* a */)
    }
    return ch - 0x30 /* 0 */
  }

  // https://www.ecma-international.org/ecma-262/8.0/#prod-annexB-LegacyOctalEscapeSequence
  // Allows only 0-377(octal) i.e. 0-255(decimal).
  pp$1.regexp_eatLegacyOctalEscapeSequence = function(state) {
    if (this.regexp_eatOctalDigit(state)) {
      var n1 = state.lastIntValue;
      if (this.regexp_eatOctalDigit(state)) {
        var n2 = state.lastIntValue;
        if (n1 <= 3 && this.regexp_eatOctalDigit(state)) {
          state.lastIntValue = n1 * 64 + n2 * 8 + state.lastIntValue;
        } else {
          state.lastIntValue = n1 * 8 + n2;
        }
      } else {
        state.lastIntValue = n1;
      }
      return true
    }
    return false
  };

  // https://www.ecma-international.org/ecma-262/8.0/#prod-OctalDigit
  pp$1.regexp_eatOctalDigit = function(state) {
    var ch = state.current();
    if (isOctalDigit(ch)) {
      state.lastIntValue = ch - 0x30; /* 0 */
      state.advance();
      return true
    }
    state.lastIntValue = 0;
    return false
  };
  function isOctalDigit(ch) {
    return ch >= 0x30 /* 0 */ && ch <= 0x37 /* 7 */
  }

  // https://www.ecma-international.org/ecma-262/8.0/#prod-Hex4Digits
  // https://www.ecma-international.org/ecma-262/8.0/#prod-HexDigit
  // And HexDigit HexDigit in https://www.ecma-international.org/ecma-262/8.0/#prod-HexEscapeSequence
  pp$1.regexp_eatFixedHexDigits = function(state, length) {
    var start = state.pos;
    state.lastIntValue = 0;
    for (var i = 0; i < length; ++i) {
      var ch = state.current();
      if (!isHexDigit(ch)) {
        state.pos = start;
        return false
      }
      state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch);
      state.advance();
    }
    return true
  };

  // Object type used to represent tokens. Note that normally, tokens
  // simply exist as properties on the parser object. This is only
  // used for the onToken callback and the external tokenizer.

  var Token = function Token(p) {
    this.type = p.type;
    this.value = p.value;
    this.start = p.start;
    this.end = p.end;
    if (p.options.locations)
      { this.loc = new SourceLocation(p, p.startLoc, p.endLoc); }
    if (p.options.ranges)
      { this.range = [p.start, p.end]; }
  };

  // ## Tokenizer

  var pp = Parser.prototype;

  // Move to the next token

  pp.next = function(ignoreEscapeSequenceInKeyword) {
    if (!ignoreEscapeSequenceInKeyword && this.type.keyword && this.containsEsc)
      { this.raiseRecoverable(this.start, "Escape sequence in keyword " + this.type.keyword); }
    if (this.options.onToken)
      { this.options.onToken(new Token(this)); }

    this.lastTokEnd = this.end;
    this.lastTokStart = this.start;
    this.lastTokEndLoc = this.endLoc;
    this.lastTokStartLoc = this.startLoc;
    this.nextToken();
  };

  pp.getToken = function() {
    this.next();
    return new Token(this)
  };

  // If we're in an ES6 environment, make parsers iterable
  if (typeof Symbol !== "undefined")
    { pp[Symbol.iterator] = function() {
      var this$1$1 = this;

      return {
        next: function () {
          var token = this$1$1.getToken();
          return {
            done: token.type === types$1.eof,
            value: token
          }
        }
      }
    }; }

  // Toggle strict mode. Re-reads the next number or string to please
  // pedantic tests (`"use strict"; 010;` should fail).

  // Read a single token, updating the parser object's token-related
  // properties.

  pp.nextToken = function() {
    var curContext = this.curContext();
    if (!curContext || !curContext.preserveSpace) { this.skipSpace(); }

    this.start = this.pos;
    if (this.options.locations) { this.startLoc = this.curPosition(); }
    if (this.pos >= this.input.length) { return this.finishToken(types$1.eof) }

    if (curContext.override) { return curContext.override(this) }
    else { this.readToken(this.fullCharCodeAtPos()); }
  };

  pp.readToken = function(code) {
    // Identifier or keyword. '\uXXXX' sequences are allowed in
    // identifiers, so '\' also dispatches to that.
    if (isIdentifierStart(code, this.options.ecmaVersion >= 6) || code === 92 /* '\' */)
      { return this.readWord() }

    return this.getTokenFromCode(code)
  };

  pp.fullCharCodeAtPos = function() {
    var code = this.input.charCodeAt(this.pos);
    if (code <= 0xd7ff || code >= 0xdc00) { return code }
    var next = this.input.charCodeAt(this.pos + 1);
    return next <= 0xdbff || next >= 0xe000 ? code : (code << 10) + next - 0x35fdc00
  };

  pp.skipBlockComment = function() {
    var startLoc = this.options.onComment && this.curPosition();
    var start = this.pos, end = this.input.indexOf("*/", this.pos += 2);
    if (end === -1) { this.raise(this.pos - 2, "Unterminated comment"); }
    this.pos = end + 2;
    if (this.options.locations) {
      for (var nextBreak = (void 0), pos = start; (nextBreak = nextLineBreak(this.input, pos, this.pos)) > -1;) {
        ++this.curLine;
        pos = this.lineStart = nextBreak;
      }
    }
    if (this.options.onComment)
      { this.options.onComment(true, this.input.slice(start + 2, end), start, this.pos,
                             startLoc, this.curPosition()); }
  };

  pp.skipLineComment = function(startSkip) {
    var start = this.pos;
    var startLoc = this.options.onComment && this.curPosition();
    var ch = this.input.charCodeAt(this.pos += startSkip);
    while (this.pos < this.input.length && !isNewLine(ch)) {
      ch = this.input.charCodeAt(++this.pos);
    }
    if (this.options.onComment)
      { this.options.onComment(false, this.input.slice(start + startSkip, this.pos), start, this.pos,
                             startLoc, this.curPosition()); }
  };

  // Called at the start of the parse and after every token. Skips
  // whitespace and comments, and.

  pp.skipSpace = function() {
    loop: while (this.pos < this.input.length) {
      var ch = this.input.charCodeAt(this.pos);
      switch (ch) {
      case 32: case 160: // ' '
        ++this.pos;
        break
      case 13:
        if (this.input.charCodeAt(this.pos + 1) === 10) {
          ++this.pos;
        }
      case 10: case 8232: case 8233:
        ++this.pos;
        if (this.options.locations) {
          ++this.curLine;
          this.lineStart = this.pos;
        }
        break
      case 47: // '/'
        switch (this.input.charCodeAt(this.pos + 1)) {
        case 42: // '*'
          this.skipBlockComment();
          break
        case 47:
          this.skipLineComment(2);
          break
        default:
          break loop
        }
        break
      default:
        if (ch > 8 && ch < 14 || ch >= 5760 && nonASCIIwhitespace.test(String.fromCharCode(ch))) {
          ++this.pos;
        } else {
          break loop
        }
      }
    }
  };

  // Called at the end of every token. Sets `end`, `val`, and
  // maintains `context` and `exprAllowed`, and skips the space after
  // the token, so that the next one's `start` will point at the
  // right position.

  pp.finishToken = function(type, val) {
    this.end = this.pos;
    if (this.options.locations) { this.endLoc = this.curPosition(); }
    var prevType = this.type;
    this.type = type;
    this.value = val;

    this.updateContext(prevType);
  };

  // ### Token reading

  // This is the function that is called to fetch the next token. It
  // is somewhat obscure, because it works in character codes rather
  // than characters, and because operator parsing has been inlined
  // into it.
  //
  // All in the name of speed.
  //
  pp.readToken_dot = function() {
    var next = this.input.charCodeAt(this.pos + 1);
    if (next >= 48 && next <= 57) { return this.readNumber(true) }
    var next2 = this.input.charCodeAt(this.pos + 2);
    if (this.options.ecmaVersion >= 6 && next === 46 && next2 === 46) { // 46 = dot '.'
      this.pos += 3;
      return this.finishToken(types$1.ellipsis)
    } else {
      ++this.pos;
      return this.finishToken(types$1.dot)
    }
  };

  pp.readToken_slash = function() { // '/'
    var next = this.input.charCodeAt(this.pos + 1);
    if (this.exprAllowed) { ++this.pos; return this.readRegexp() }
    if (next === 61) { return this.finishOp(types$1.assign, 2) }
    return this.finishOp(types$1.slash, 1)
  };

  pp.readToken_mult_modulo_exp = function(code) { // '%*'
    var next = this.input.charCodeAt(this.pos + 1);
    var size = 1;
    var tokentype = code === 42 ? types$1.star : types$1.modulo;

    // exponentiation operator ** and **=
    if (this.options.ecmaVersion >= 7 && code === 42 && next === 42) {
      ++size;
      tokentype = types$1.starstar;
      next = this.input.charCodeAt(this.pos + 2);
    }

    if (next === 61) { return this.finishOp(types$1.assign, size + 1) }
    return this.finishOp(tokentype, size)
  };

  pp.readToken_pipe_amp = function(code) { // '|&'
    var next = this.input.charCodeAt(this.pos + 1);
    if (next === code) {
      if (this.options.ecmaVersion >= 12) {
        var next2 = this.input.charCodeAt(this.pos + 2);
        if (next2 === 61) { return this.finishOp(types$1.assign, 3) }
      }
      return this.finishOp(code === 124 ? types$1.logicalOR : types$1.logicalAND, 2)
    }
    if (next === 61) { return this.finishOp(types$1.assign, 2) }
    return this.finishOp(code === 124 ? types$1.bitwiseOR : types$1.bitwiseAND, 1)
  };

  pp.readToken_caret = function() { // '^'
    var next = this.input.charCodeAt(this.pos + 1);
    if (next === 61) { return this.finishOp(types$1.assign, 2) }
    return this.finishOp(types$1.bitwiseXOR, 1)
  };

  pp.readToken_plus_min = function(code) { // '+-'
    var next = this.input.charCodeAt(this.pos + 1);
    if (next === code) {
      if (next === 45 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 62 &&
          (this.lastTokEnd === 0 || lineBreak.test(this.input.slice(this.lastTokEnd, this.pos)))) {
        // A `-->` line comment
        this.skipLineComment(3);
        this.skipSpace();
        return this.nextToken()
      }
      return this.finishOp(types$1.incDec, 2)
    }
    if (next === 61) { return this.finishOp(types$1.assign, 2) }
    return this.finishOp(types$1.plusMin, 1)
  };

  pp.readToken_lt_gt = function(code) { // '<>'
    var next = this.input.charCodeAt(this.pos + 1);
    var size = 1;
    if (next === code) {
      size = code === 62 && this.input.charCodeAt(this.pos + 2) === 62 ? 3 : 2;
      if (this.input.charCodeAt(this.pos + size) === 61) { return this.finishOp(types$1.assign, size + 1) }
      return this.finishOp(types$1.bitShift, size)
    }
    if (next === 33 && code === 60 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 45 &&
        this.input.charCodeAt(this.pos + 3) === 45) {
      // `<!--`, an XML-style comment that should be interpreted as a line comment
      this.skipLineComment(4);
      this.skipSpace();
      return this.nextToken()
    }
    if (next === 61) { size = 2; }
    return this.finishOp(types$1.relational, size)
  };

  pp.readToken_eq_excl = function(code) { // '=!'
    var next = this.input.charCodeAt(this.pos + 1);
    if (next === 61) { return this.finishOp(types$1.equality, this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2) }
    if (code === 61 && next === 62 && this.options.ecmaVersion >= 6) { // '=>'
      this.pos += 2;
      return this.finishToken(types$1.arrow)
    }
    return this.finishOp(code === 61 ? types$1.eq : types$1.prefix, 1)
  };

  pp.readToken_question = function() { // '?'
    var ecmaVersion = this.options.ecmaVersion;
    if (ecmaVersion >= 11) {
      var next = this.input.charCodeAt(this.pos + 1);
      if (next === 46) {
        var next2 = this.input.charCodeAt(this.pos + 2);
        if (next2 < 48 || next2 > 57) { return this.finishOp(types$1.questionDot, 2) }
      }
      if (next === 63) {
        if (ecmaVersion >= 12) {
          var next2$1 = this.input.charCodeAt(this.pos + 2);
          if (next2$1 === 61) { return this.finishOp(types$1.assign, 3) }
        }
        return this.finishOp(types$1.coalesce, 2)
      }
    }
    return this.finishOp(types$1.question, 1)
  };

  pp.readToken_numberSign = function() { // '#'
    var ecmaVersion = this.options.ecmaVersion;
    var code = 35; // '#'
    if (ecmaVersion >= 13) {
      ++this.pos;
      code = this.fullCharCodeAtPos();
      if (isIdentifierStart(code, true) || code === 92 /* '\' */) {
        return this.finishToken(types$1.privateId, this.readWord1())
      }
    }

    this.raise(this.pos, "Unexpected character '" + codePointToString(code) + "'");
  };

  pp.getTokenFromCode = function(code) {
    switch (code) {
    // The interpretation of a dot depends on whether it is followed
    // by a digit or another two dots.
    case 46: // '.'
      return this.readToken_dot()

    // Punctuation tokens.
    case 40: ++this.pos; return this.finishToken(types$1.parenL)
    case 41: ++this.pos; return this.finishToken(types$1.parenR)
    case 59: ++this.pos; return this.finishToken(types$1.semi)
    case 44: ++this.pos; return this.finishToken(types$1.comma)
    case 91: ++this.pos; return this.finishToken(types$1.bracketL)
    case 93: ++this.pos; return this.finishToken(types$1.bracketR)
    case 123: ++this.pos; return this.finishToken(types$1.braceL)
    case 125: ++this.pos; return this.finishToken(types$1.braceR)
    case 58: ++this.pos; return this.finishToken(types$1.colon)

    case 96: // '`'
      if (this.options.ecmaVersion < 6) { break }
      ++this.pos;
      return this.finishToken(types$1.backQuote)

    case 48: // '0'
      var next = this.input.charCodeAt(this.pos + 1);
      if (next === 120 || next === 88) { return this.readRadixNumber(16) } // '0x', '0X' - hex number
      if (this.options.ecmaVersion >= 6) {
        if (next === 111 || next === 79) { return this.readRadixNumber(8) } // '0o', '0O' - octal number
        if (next === 98 || next === 66) { return this.readRadixNumber(2) } // '0b', '0B' - binary number
      }

    // Anything else beginning with a digit is an integer, octal
    // number, or float.
    case 49: case 50: case 51: case 52: case 53: case 54: case 55: case 56: case 57: // 1-9
      return this.readNumber(false)

    // Quotes produce strings.
    case 34: case 39: // '"', "'"
      return this.readString(code)

    // Operators are parsed inline in tiny state machines. '=' (61) is
    // often referred to. `finishOp` simply skips the amount of
    // characters it is given as second argument, and returns a token
    // of the type given by its first argument.
    case 47: // '/'
      return this.readToken_slash()

    case 37: case 42: // '%*'
      return this.readToken_mult_modulo_exp(code)

    case 124: case 38: // '|&'
      return this.readToken_pipe_amp(code)

    case 94: // '^'
      return this.readToken_caret()

    case 43: case 45: // '+-'
      return this.readToken_plus_min(code)

    case 60: case 62: // '<>'
      return this.readToken_lt_gt(code)

    case 61: case 33: // '=!'
      return this.readToken_eq_excl(code)

    case 63: // '?'
      return this.readToken_question()

    case 126: // '~'
      return this.finishOp(types$1.prefix, 1)

    case 35: // '#'
      return this.readToken_numberSign()
    }

    this.raise(this.pos, "Unexpected character '" + codePointToString(code) + "'");
  };

  pp.finishOp = function(type, size) {
    var str = this.input.slice(this.pos, this.pos + size);
    this.pos += size;
    return this.finishToken(type, str)
  };

  pp.readRegexp = function() {
    var escaped, inClass, start = this.pos;
    for (;;) {
      if (this.pos >= this.input.length) { this.raise(start, "Unterminated regular expression"); }
      var ch = this.input.charAt(this.pos);
      if (lineBreak.test(ch)) { this.raise(start, "Unterminated regular expression"); }
      if (!escaped) {
        if (ch === "[") { inClass = true; }
        else if (ch === "]" && inClass) { inClass = false; }
        else if (ch === "/" && !inClass) { break }
        escaped = ch === "\\";
      } else { escaped = false; }
      ++this.pos;
    }
    var pattern = this.input.slice(start, this.pos);
    ++this.pos;
    var flagsStart = this.pos;
    var flags = this.readWord1();
    if (this.containsEsc) { this.unexpected(flagsStart); }

    // Validate pattern
    var state = this.regexpState || (this.regexpState = new RegExpValidationState(this));
    state.reset(start, pattern, flags);
    this.validateRegExpFlags(state);
    this.validateRegExpPattern(state);

    // Create Literal#value property value.
    var value = null;
    try {
      value = new RegExp(pattern, flags);
    } catch (e) {
      // ESTree requires null if it failed to instantiate RegExp object.
      // https://github.com/estree/estree/blob/a27003adf4fd7bfad44de9cef372a2eacd527b1c/es5.md#regexpliteral
    }

    return this.finishToken(types$1.regexp, {pattern: pattern, flags: flags, value: value})
  };

  // Read an integer in the given radix. Return null if zero digits
  // were read, the integer value otherwise. When `len` is given, this
  // will return `null` unless the integer has exactly `len` digits.

  pp.readInt = function(radix, len, maybeLegacyOctalNumericLiteral) {
    // `len` is used for character escape sequences. In that case, disallow separators.
    var allowSeparators = this.options.ecmaVersion >= 12 && len === undefined;

    // `maybeLegacyOctalNumericLiteral` is true if it doesn't have prefix (0x,0o,0b)
    // and isn't fraction part nor exponent part. In that case, if the first digit
    // is zero then disallow separators.
    var isLegacyOctalNumericLiteral = maybeLegacyOctalNumericLiteral && this.input.charCodeAt(this.pos) === 48;

    var start = this.pos, total = 0, lastCode = 0;
    for (var i = 0, e = len == null ? Infinity : len; i < e; ++i, ++this.pos) {
      var code = this.input.charCodeAt(this.pos), val = (void 0);

      if (allowSeparators && code === 95) {
        if (isLegacyOctalNumericLiteral) { this.raiseRecoverable(this.pos, "Numeric separator is not allowed in legacy octal numeric literals"); }
        if (lastCode === 95) { this.raiseRecoverable(this.pos, "Numeric separator must be exactly one underscore"); }
        if (i === 0) { this.raiseRecoverable(this.pos, "Numeric separator is not allowed at the first of digits"); }
        lastCode = code;
        continue
      }

      if (code >= 97) { val = code - 97 + 10; } // a
      else if (code >= 65) { val = code - 65 + 10; } // A
      else if (code >= 48 && code <= 57) { val = code - 48; } // 0-9
      else { val = Infinity; }
      if (val >= radix) { break }
      lastCode = code;
      total = total * radix + val;
    }

    if (allowSeparators && lastCode === 95) { this.raiseRecoverable(this.pos - 1, "Numeric separator is not allowed at the last of digits"); }
    if (this.pos === start || len != null && this.pos - start !== len) { return null }

    return total
  };

  function stringToNumber(str, isLegacyOctalNumericLiteral) {
    if (isLegacyOctalNumericLiteral) {
      return parseInt(str, 8)
    }

    // `parseFloat(value)` stops parsing at the first numeric separator then returns a wrong value.
    return parseFloat(str.replace(/_/g, ""))
  }

  function stringToBigInt(str) {
    if (typeof BigInt !== "function") {
      return null
    }

    // `BigInt(value)` throws syntax error if the string contains numeric separators.
    return BigInt(str.replace(/_/g, ""))
  }

  pp.readRadixNumber = function(radix) {
    var start = this.pos;
    this.pos += 2; // 0x
    var val = this.readInt(radix);
    if (val == null) { this.raise(this.start + 2, "Expected number in radix " + radix); }
    if (this.options.ecmaVersion >= 11 && this.input.charCodeAt(this.pos) === 110) {
      val = stringToBigInt(this.input.slice(start, this.pos));
      ++this.pos;
    } else if (isIdentifierStart(this.fullCharCodeAtPos())) { this.raise(this.pos, "Identifier directly after number"); }
    return this.finishToken(types$1.num, val)
  };

  // Read an integer, octal integer, or floating-point number.

  pp.readNumber = function(startsWithDot) {
    var start = this.pos;
    if (!startsWithDot && this.readInt(10, undefined, true) === null) { this.raise(start, "Invalid number"); }
    var octal = this.pos - start >= 2 && this.input.charCodeAt(start) === 48;
    if (octal && this.strict) { this.raise(start, "Invalid number"); }
    var next = this.input.charCodeAt(this.pos);
    if (!octal && !startsWithDot && this.options.ecmaVersion >= 11 && next === 110) {
      var val$1 = stringToBigInt(this.input.slice(start, this.pos));
      ++this.pos;
      if (isIdentifierStart(this.fullCharCodeAtPos())) { this.raise(this.pos, "Identifier directly after number"); }
      return this.finishToken(types$1.num, val$1)
    }
    if (octal && /[89]/.test(this.input.slice(start, this.pos))) { octal = false; }
    if (next === 46 && !octal) { // '.'
      ++this.pos;
      this.readInt(10);
      next = this.input.charCodeAt(this.pos);
    }
    if ((next === 69 || next === 101) && !octal) { // 'eE'
      next = this.input.charCodeAt(++this.pos);
      if (next === 43 || next === 45) { ++this.pos; } // '+-'
      if (this.readInt(10) === null) { this.raise(start, "Invalid number"); }
    }
    if (isIdentifierStart(this.fullCharCodeAtPos())) { this.raise(this.pos, "Identifier directly after number"); }

    var val = stringToNumber(this.input.slice(start, this.pos), octal);
    return this.finishToken(types$1.num, val)
  };

  // Read a string value, interpreting backslash-escapes.

  pp.readCodePoint = function() {
    var ch = this.input.charCodeAt(this.pos), code;

    if (ch === 123) { // '{'
      if (this.options.ecmaVersion < 6) { this.unexpected(); }
      var codePos = ++this.pos;
      code = this.readHexChar(this.input.indexOf("}", this.pos) - this.pos);
      ++this.pos;
      if (code > 0x10FFFF) { this.invalidStringToken(codePos, "Code point out of bounds"); }
    } else {
      code = this.readHexChar(4);
    }
    return code
  };

  pp.readString = function(quote) {
    var out = "", chunkStart = ++this.pos;
    for (;;) {
      if (this.pos >= this.input.length) { this.raise(this.start, "Unterminated string constant"); }
      var ch = this.input.charCodeAt(this.pos);
      if (ch === quote) { break }
      if (ch === 92) { // '\'
        out += this.input.slice(chunkStart, this.pos);
        out += this.readEscapedChar(false);
        chunkStart = this.pos;
      } else if (ch === 0x2028 || ch === 0x2029) {
        if (this.options.ecmaVersion < 10) { this.raise(this.start, "Unterminated string constant"); }
        ++this.pos;
        if (this.options.locations) {
          this.curLine++;
          this.lineStart = this.pos;
        }
      } else {
        if (isNewLine(ch)) { this.raise(this.start, "Unterminated string constant"); }
        ++this.pos;
      }
    }
    out += this.input.slice(chunkStart, this.pos++);
    return this.finishToken(types$1.string, out)
  };

  // Reads template string tokens.

  var INVALID_TEMPLATE_ESCAPE_ERROR = {};

  pp.tryReadTemplateToken = function() {
    this.inTemplateElement = true;
    try {
      this.readTmplToken();
    } catch (err) {
      if (err === INVALID_TEMPLATE_ESCAPE_ERROR) {
        this.readInvalidTemplateToken();
      } else {
        throw err
      }
    }

    this.inTemplateElement = false;
  };

  pp.invalidStringToken = function(position, message) {
    if (this.inTemplateElement && this.options.ecmaVersion >= 9) {
      throw INVALID_TEMPLATE_ESCAPE_ERROR
    } else {
      this.raise(position, message);
    }
  };

  pp.readTmplToken = function() {
    var out = "", chunkStart = this.pos;
    for (;;) {
      if (this.pos >= this.input.length) { this.raise(this.start, "Unterminated template"); }
      var ch = this.input.charCodeAt(this.pos);
      if (ch === 96 || ch === 36 && this.input.charCodeAt(this.pos + 1) === 123) { // '`', '${'
        if (this.pos === this.start && (this.type === types$1.template || this.type === types$1.invalidTemplate)) {
          if (ch === 36) {
            this.pos += 2;
            return this.finishToken(types$1.dollarBraceL)
          } else {
            ++this.pos;
            return this.finishToken(types$1.backQuote)
          }
        }
        out += this.input.slice(chunkStart, this.pos);
        return this.finishToken(types$1.template, out)
      }
      if (ch === 92) { // '\'
        out += this.input.slice(chunkStart, this.pos);
        out += this.readEscapedChar(true);
        chunkStart = this.pos;
      } else if (isNewLine(ch)) {
        out += this.input.slice(chunkStart, this.pos);
        ++this.pos;
        switch (ch) {
        case 13:
          if (this.input.charCodeAt(this.pos) === 10) { ++this.pos; }
        case 10:
          out += "\n";
          break
        default:
          out += String.fromCharCode(ch);
          break
        }
        if (this.options.locations) {
          ++this.curLine;
          this.lineStart = this.pos;
        }
        chunkStart = this.pos;
      } else {
        ++this.pos;
      }
    }
  };

  // Reads a template token to search for the end, without validating any escape sequences
  pp.readInvalidTemplateToken = function() {
    for (; this.pos < this.input.length; this.pos++) {
      switch (this.input[this.pos]) {
      case "\\":
        ++this.pos;
        break

      case "$":
        if (this.input[this.pos + 1] !== "{") {
          break
        }

      // falls through
      case "`":
        return this.finishToken(types$1.invalidTemplate, this.input.slice(this.start, this.pos))

      // no default
      }
    }
    this.raise(this.start, "Unterminated template");
  };

  // Used to read escaped characters

  pp.readEscapedChar = function(inTemplate) {
    var ch = this.input.charCodeAt(++this.pos);
    ++this.pos;
    switch (ch) {
    case 110: return "\n" // 'n' -> '\n'
    case 114: return "\r" // 'r' -> '\r'
    case 120: return String.fromCharCode(this.readHexChar(2)) // 'x'
    case 117: return codePointToString(this.readCodePoint()) // 'u'
    case 116: return "\t" // 't' -> '\t'
    case 98: return "\b" // 'b' -> '\b'
    case 118: return "\u000b" // 'v' -> '\u000b'
    case 102: return "\f" // 'f' -> '\f'
    case 13: if (this.input.charCodeAt(this.pos) === 10) { ++this.pos; } // '\r\n'
    case 10: // ' \n'
      if (this.options.locations) { this.lineStart = this.pos; ++this.curLine; }
      return ""
    case 56:
    case 57:
      if (this.strict) {
        this.invalidStringToken(
          this.pos - 1,
          "Invalid escape sequence"
        );
      }
      if (inTemplate) {
        var codePos = this.pos - 1;

        this.invalidStringToken(
          codePos,
          "Invalid escape sequence in template string"
        );
      }
    default:
      if (ch >= 48 && ch <= 55) {
        var octalStr = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0];
        var octal = parseInt(octalStr, 8);
        if (octal > 255) {
          octalStr = octalStr.slice(0, -1);
          octal = parseInt(octalStr, 8);
        }
        this.pos += octalStr.length - 1;
        ch = this.input.charCodeAt(this.pos);
        if ((octalStr !== "0" || ch === 56 || ch === 57) && (this.strict || inTemplate)) {
          this.invalidStringToken(
            this.pos - 1 - octalStr.length,
            inTemplate
              ? "Octal literal in template string"
              : "Octal literal in strict mode"
          );
        }
        return String.fromCharCode(octal)
      }
      if (isNewLine(ch)) {
        // Unicode new line characters after \ get removed from output in both
        // template literals and strings
        return ""
      }
      return String.fromCharCode(ch)
    }
  };

  // Used to read character escape sequences ('\x', '\u', '\U').

  pp.readHexChar = function(len) {
    var codePos = this.pos;
    var n = this.readInt(16, len);
    if (n === null) { this.invalidStringToken(codePos, "Bad character escape sequence"); }
    return n
  };

  // Read an identifier, and return it as a string. Sets `this.containsEsc`
  // to whether the word contained a '\u' escape.
  //
  // Incrementally adds only escaped chars, adding other chunks as-is
  // as a micro-optimization.

  pp.readWord1 = function() {
    this.containsEsc = false;
    var word = "", first = true, chunkStart = this.pos;
    var astral = this.options.ecmaVersion >= 6;
    while (this.pos < this.input.length) {
      var ch = this.fullCharCodeAtPos();
      if (isIdentifierChar(ch, astral)) {
        this.pos += ch <= 0xffff ? 1 : 2;
      } else if (ch === 92) { // "\"
        this.containsEsc = true;
        word += this.input.slice(chunkStart, this.pos);
        var escStart = this.pos;
        if (this.input.charCodeAt(++this.pos) !== 117) // "u"
          { this.invalidStringToken(this.pos, "Expecting Unicode escape sequence \\uXXXX"); }
        ++this.pos;
        var esc = this.readCodePoint();
        if (!(first ? isIdentifierStart : isIdentifierChar)(esc, astral))
          { this.invalidStringToken(escStart, "Invalid Unicode escape"); }
        word += codePointToString(esc);
        chunkStart = this.pos;
      } else {
        break
      }
      first = false;
    }
    return word + this.input.slice(chunkStart, this.pos)
  };

  // Read an identifier or keyword token. Will check for reserved
  // words when necessary.

  pp.readWord = function() {
    var word = this.readWord1();
    var type = types$1.name;
    if (this.keywords.test(word)) {
      type = keywords[word];
    }
    return this.finishToken(type, word)
  };

  // Acorn is a tiny, fast JavaScript parser written in JavaScript.
  //
  // Acorn was written by Marijn Haverbeke, Ingvar Stepanyan, and
  // various contributors and released under an MIT license.
  //
  // Git repositories for Acorn are available at
  //
  //     http://marijnhaverbeke.nl/git/acorn
  //     https://github.com/acornjs/acorn.git
  //
  // Please use the [github bug tracker][ghbt] to report issues.
  //
  // [ghbt]: https://github.com/acornjs/acorn/issues
  //
  // [walk]: util/walk.js


  var version = "8.10.0";

  Parser.acorn = {
    Parser: Parser,
    version: version,
    defaultOptions: defaultOptions,
    Position: Position,
    SourceLocation: SourceLocation,
    getLineInfo: getLineInfo,
    Node: Node,
    TokenType: TokenType,
    tokTypes: types$1,
    keywordTypes: keywords,
    TokContext: TokContext,
    tokContexts: types,
    isIdentifierChar: isIdentifierChar,
    isIdentifierStart: isIdentifierStart,
    Token: Token,
    isNewLine: isNewLine,
    lineBreak: lineBreak,
    lineBreakG: lineBreakG,
    nonASCIIwhitespace: nonASCIIwhitespace
  };

  // The main exported interface (under `self.acorn` when in the
  // browser) is a `parse` function that takes a code string and
  // returns an abstract syntax tree as specified by [Mozilla parser
  // API][api].
  //
  // [api]: https://developer.mozilla.org/en-US/docs/SpiderMonkey/Parser_API

  function parse(input, options) {
    return Parser.parse(input, options)
  }

  // This function tries to parse a single expression at a given
  // offset in a string. Useful for parsing mixed-language formats
  // that embed JavaScript expressions.

  function parseExpressionAt(input, pos, options) {
    return Parser.parseExpressionAt(input, pos, options)
  }

  // Acorn is organized as a tokenizer and a recursive-descent parser.
  // The `tokenizer` export provides an interface to the tokenizer.

  function tokenizer(input, options) {
    return Parser.tokenizer(input, options)
  }

  exports.Node = Node;
  exports.Parser = Parser;
  exports.Position = Position;
  exports.SourceLocation = SourceLocation;
  exports.TokContext = TokContext;
  exports.Token = Token;
  exports.TokenType = TokenType;
  exports.defaultOptions = defaultOptions;
  exports.getLineInfo = getLineInfo;
  exports.isIdentifierChar = isIdentifierChar;
  exports.isIdentifierStart = isIdentifierStart;
  exports.isNewLine = isNewLine;
  exports.keywordTypes = keywords;
  exports.lineBreak = lineBreak;
  exports.lineBreakG = lineBreakG;
  exports.nonASCIIwhitespace = nonASCIIwhitespace;
  exports.parse = parse;
  exports.parseExpressionAt = parseExpressionAt;
  exports.tokContexts = types;
  exports.tokTypes = types$1;
  exports.tokenizer = tokenizer;
  exports.version = version;

}));


/***/ }),

/***/ 9482:
/***/ ((module) => {

const flagSymbol = Symbol('arg flag');

function arg(opts, {argv = process.argv.slice(2), permissive = false, stopAtPositional = false} = {}) {
	if (!opts) {
		throw new Error('Argument specification object is required');
	}

	const result = {_: []};

	const aliases = {};
	const handlers = {};

	for (const key of Object.keys(opts)) {
		if (!key) {
			throw new TypeError('Argument key cannot be an empty string');
		}

		if (key[0] !== '-') {
			throw new TypeError(`Argument key must start with '-' but found: '${key}'`);
		}

		if (key.length === 1) {
			throw new TypeError(`Argument key must have a name; singular '-' keys are not allowed: ${key}`);
		}

		if (typeof opts[key] === 'string') {
			aliases[key] = opts[key];
			continue;
		}

		let type = opts[key];
		let isFlag = false;

		if (Array.isArray(type) && type.length === 1 && typeof type[0] === 'function') {
			const [fn] = type;
			type = (value, name, prev = []) => {
				prev.push(fn(value, name, prev[prev.length - 1]));
				return prev;
			};
			isFlag = fn === Boolean || fn[flagSymbol] === true;
		} else if (typeof type === 'function') {
			isFlag = type === Boolean || type[flagSymbol] === true;
		} else {
			throw new TypeError(`Type missing or not a function or valid array type: ${key}`);
		}

		if (key[1] !== '-' && key.length > 2) {
			throw new TypeError(`Short argument keys (with a single hyphen) must have only one character: ${key}`);
		}

		handlers[key] = [type, isFlag];
	}

	for (let i = 0, len = argv.length; i < len; i++) {
		const wholeArg = argv[i];

		if (stopAtPositional && result._.length > 0) {
			result._ = result._.concat(argv.slice(i));
			break;
		}

		if (wholeArg === '--') {
			result._ = result._.concat(argv.slice(i + 1));
			break;
		}

		if (wholeArg.length > 1 && wholeArg[0] === '-') {
			/* eslint-disable operator-linebreak */
			const separatedArguments = (wholeArg[1] === '-' || wholeArg.length === 2)
				? [wholeArg]
				: wholeArg.slice(1).split('').map(a => `-${a}`);
			/* eslint-enable operator-linebreak */

			for (let j = 0; j < separatedArguments.length; j++) {
				const arg = separatedArguments[j];
				const [originalArgName, argStr] = arg[1] === '-' ? arg.split(/=(.*)/, 2) : [arg, undefined];

				let argName = originalArgName;
				while (argName in aliases) {
					argName = aliases[argName];
				}

				if (!(argName in handlers)) {
					if (permissive) {
						result._.push(arg);
						continue;
					} else {
						const err = new Error(`Unknown or unexpected option: ${originalArgName}`);
						err.code = 'ARG_UNKNOWN_OPTION';
						throw err;
					}
				}

				const [type, isFlag] = handlers[argName];

				if (!isFlag && ((j + 1) < separatedArguments.length)) {
					throw new TypeError(`Option requires argument (but was followed by another short argument): ${originalArgName}`);
				}

				if (isFlag) {
					result[argName] = type(true, argName, result[argName]);
				} else if (argStr === undefined) {
					if (
						argv.length < i + 2 ||
						(
							argv[i + 1].length > 1 &&
							(argv[i + 1][0] === '-') &&
							!(
								argv[i + 1].match(/^-?\d*(\.(?=\d))?\d*$/) &&
								(
									type === Number ||
									// eslint-disable-next-line no-undef
									(typeof BigInt !== 'undefined' && type === BigInt)
								)
							)
						)
					) {
						const extended = originalArgName === argName ? '' : ` (alias for ${argName})`;
						throw new Error(`Option requires argument: ${originalArgName}${extended}`);
					}

					result[argName] = type(argv[i + 1], argName, result[argName]);
					++i;
				} else {
					result[argName] = type(argStr, argName, result[argName]);
				}
			}
		} else {
			result._.push(wholeArg);
		}
	}

	return result;
}

arg.flag = fn => {
	fn[flagSymbol] = true;
	return fn;
};

// Utility types
arg.COUNT = arg.flag((v, name, existingCount) => (existingCount || 0) + 1);

module.exports = arg;


/***/ }),

/***/ 5830:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const nativeModule = __nccwpck_require__(8188)
const path = __nccwpck_require__(1017)
const fs = __nccwpck_require__(7147)

function createRequire (filename) {
  // Fallback to process.cwd() if no filename passed
  if (!filename) {
    filename = process.cwd()
  }

  // If filename is dir, createRequire goes with parent directory, so we need fakepath
  if (isDir(filename)) {
    filename = path.join(filename, 'index.js')
  }

  // Added in Node v12.2.0
  if (nativeModule.createRequire) {
    return nativeModule.createRequire(filename)
  }

  // Added in Node v10.12.0 and deprecated since Node v12.2.0
  if (nativeModule.createRequireFromPath) {
    return nativeModule.createRequireFromPath(filename)
  }

  // Polyfill
  return _createRequire(filename)
}

// Polyfill
function _createRequire (filename) {
  const mod = new nativeModule.Module(filename, null)
  mod.filename = filename
  mod.paths = nativeModule.Module._nodeModulePaths(path.dirname(filename))
  mod._compile('module.exports = require;', filename)
  return mod.exports
}

function isDir (path) {
  try {
    const stat = fs.lstatSync(path)
    return stat.isDirectory()
  } catch (e) {
    // lstatSync throws an error if path doesn't exist
    return false
  }
}

module.exports = createRequire


/***/ }),

/***/ 2859:
/***/ ((__unused_webpack_module, exports) => {

/*istanbul ignore start*/


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.convertChangesToDMP = convertChangesToDMP;

/*istanbul ignore end*/
// See: http://code.google.com/p/google-diff-match-patch/wiki/API
function convertChangesToDMP(changes) {
  var ret = [],
      change,
      operation;

  for (var i = 0; i < changes.length; i++) {
    change = changes[i];

    if (change.added) {
      operation = 1;
    } else if (change.removed) {
      operation = -1;
    } else {
      operation = 0;
    }

    ret.push([operation, change.value]);
  }

  return ret;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb252ZXJ0L2RtcC5qcyJdLCJuYW1lcyI6WyJjb252ZXJ0Q2hhbmdlc1RvRE1QIiwiY2hhbmdlcyIsInJldCIsImNoYW5nZSIsIm9wZXJhdGlvbiIsImkiLCJsZW5ndGgiLCJhZGRlZCIsInJlbW92ZWQiLCJwdXNoIiwidmFsdWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ08sU0FBU0EsbUJBQVQsQ0FBNkJDLE9BQTdCLEVBQXNDO0FBQzNDLE1BQUlDLEdBQUcsR0FBRyxFQUFWO0FBQUEsTUFDSUMsTUFESjtBQUFBLE1BRUlDLFNBRko7O0FBR0EsT0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHSixPQUFPLENBQUNLLE1BQTVCLEVBQW9DRCxDQUFDLEVBQXJDLEVBQXlDO0FBQ3ZDRixJQUFBQSxNQUFNLEdBQUdGLE9BQU8sQ0FBQ0ksQ0FBRCxDQUFoQjs7QUFDQSxRQUFJRixNQUFNLENBQUNJLEtBQVgsRUFBa0I7QUFDaEJILE1BQUFBLFNBQVMsR0FBRyxDQUFaO0FBQ0QsS0FGRCxNQUVPLElBQUlELE1BQU0sQ0FBQ0ssT0FBWCxFQUFvQjtBQUN6QkosTUFBQUEsU0FBUyxHQUFHLENBQUMsQ0FBYjtBQUNELEtBRk0sTUFFQTtBQUNMQSxNQUFBQSxTQUFTLEdBQUcsQ0FBWjtBQUNEOztBQUVERixJQUFBQSxHQUFHLENBQUNPLElBQUosQ0FBUyxDQUFDTCxTQUFELEVBQVlELE1BQU0sQ0FBQ08sS0FBbkIsQ0FBVDtBQUNEOztBQUNELFNBQU9SLEdBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIFNlZTogaHR0cDovL2NvZGUuZ29vZ2xlLmNvbS9wL2dvb2dsZS1kaWZmLW1hdGNoLXBhdGNoL3dpa2kvQVBJXG5leHBvcnQgZnVuY3Rpb24gY29udmVydENoYW5nZXNUb0RNUChjaGFuZ2VzKSB7XG4gIGxldCByZXQgPSBbXSxcbiAgICAgIGNoYW5nZSxcbiAgICAgIG9wZXJhdGlvbjtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGFuZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgY2hhbmdlID0gY2hhbmdlc1tpXTtcbiAgICBpZiAoY2hhbmdlLmFkZGVkKSB7XG4gICAgICBvcGVyYXRpb24gPSAxO1xuICAgIH0gZWxzZSBpZiAoY2hhbmdlLnJlbW92ZWQpIHtcbiAgICAgIG9wZXJhdGlvbiA9IC0xO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcGVyYXRpb24gPSAwO1xuICAgIH1cblxuICAgIHJldC5wdXNoKFtvcGVyYXRpb24sIGNoYW5nZS52YWx1ZV0pO1xuICB9XG4gIHJldHVybiByZXQ7XG59XG4iXX0=


/***/ }),

/***/ 6982:
/***/ ((__unused_webpack_module, exports) => {

/*istanbul ignore start*/


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.convertChangesToXML = convertChangesToXML;

/*istanbul ignore end*/
function convertChangesToXML(changes) {
  var ret = [];

  for (var i = 0; i < changes.length; i++) {
    var change = changes[i];

    if (change.added) {
      ret.push('<ins>');
    } else if (change.removed) {
      ret.push('<del>');
    }

    ret.push(escapeHTML(change.value));

    if (change.added) {
      ret.push('</ins>');
    } else if (change.removed) {
      ret.push('</del>');
    }
  }

  return ret.join('');
}

function escapeHTML(s) {
  var n = s;
  n = n.replace(/&/g, '&amp;');
  n = n.replace(/</g, '&lt;');
  n = n.replace(/>/g, '&gt;');
  n = n.replace(/"/g, '&quot;');
  return n;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb252ZXJ0L3htbC5qcyJdLCJuYW1lcyI6WyJjb252ZXJ0Q2hhbmdlc1RvWE1MIiwiY2hhbmdlcyIsInJldCIsImkiLCJsZW5ndGgiLCJjaGFuZ2UiLCJhZGRlZCIsInB1c2giLCJyZW1vdmVkIiwiZXNjYXBlSFRNTCIsInZhbHVlIiwiam9pbiIsInMiLCJuIiwicmVwbGFjZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQU8sU0FBU0EsbUJBQVQsQ0FBNkJDLE9BQTdCLEVBQXNDO0FBQzNDLE1BQUlDLEdBQUcsR0FBRyxFQUFWOztBQUNBLE9BQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0YsT0FBTyxDQUFDRyxNQUE1QixFQUFvQ0QsQ0FBQyxFQUFyQyxFQUF5QztBQUN2QyxRQUFJRSxNQUFNLEdBQUdKLE9BQU8sQ0FBQ0UsQ0FBRCxDQUFwQjs7QUFDQSxRQUFJRSxNQUFNLENBQUNDLEtBQVgsRUFBa0I7QUFDaEJKLE1BQUFBLEdBQUcsQ0FBQ0ssSUFBSixDQUFTLE9BQVQ7QUFDRCxLQUZELE1BRU8sSUFBSUYsTUFBTSxDQUFDRyxPQUFYLEVBQW9CO0FBQ3pCTixNQUFBQSxHQUFHLENBQUNLLElBQUosQ0FBUyxPQUFUO0FBQ0Q7O0FBRURMLElBQUFBLEdBQUcsQ0FBQ0ssSUFBSixDQUFTRSxVQUFVLENBQUNKLE1BQU0sQ0FBQ0ssS0FBUixDQUFuQjs7QUFFQSxRQUFJTCxNQUFNLENBQUNDLEtBQVgsRUFBa0I7QUFDaEJKLE1BQUFBLEdBQUcsQ0FBQ0ssSUFBSixDQUFTLFFBQVQ7QUFDRCxLQUZELE1BRU8sSUFBSUYsTUFBTSxDQUFDRyxPQUFYLEVBQW9CO0FBQ3pCTixNQUFBQSxHQUFHLENBQUNLLElBQUosQ0FBUyxRQUFUO0FBQ0Q7QUFDRjs7QUFDRCxTQUFPTCxHQUFHLENBQUNTLElBQUosQ0FBUyxFQUFULENBQVA7QUFDRDs7QUFFRCxTQUFTRixVQUFULENBQW9CRyxDQUFwQixFQUF1QjtBQUNyQixNQUFJQyxDQUFDLEdBQUdELENBQVI7QUFDQUMsRUFBQUEsQ0FBQyxHQUFHQSxDQUFDLENBQUNDLE9BQUYsQ0FBVSxJQUFWLEVBQWdCLE9BQWhCLENBQUo7QUFDQUQsRUFBQUEsQ0FBQyxHQUFHQSxDQUFDLENBQUNDLE9BQUYsQ0FBVSxJQUFWLEVBQWdCLE1BQWhCLENBQUo7QUFDQUQsRUFBQUEsQ0FBQyxHQUFHQSxDQUFDLENBQUNDLE9BQUYsQ0FBVSxJQUFWLEVBQWdCLE1BQWhCLENBQUo7QUFDQUQsRUFBQUEsQ0FBQyxHQUFHQSxDQUFDLENBQUNDLE9BQUYsQ0FBVSxJQUFWLEVBQWdCLFFBQWhCLENBQUo7QUFFQSxTQUFPRCxDQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gY29udmVydENoYW5nZXNUb1hNTChjaGFuZ2VzKSB7XG4gIGxldCByZXQgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGFuZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IGNoYW5nZSA9IGNoYW5nZXNbaV07XG4gICAgaWYgKGNoYW5nZS5hZGRlZCkge1xuICAgICAgcmV0LnB1c2goJzxpbnM+Jyk7XG4gICAgfSBlbHNlIGlmIChjaGFuZ2UucmVtb3ZlZCkge1xuICAgICAgcmV0LnB1c2goJzxkZWw+Jyk7XG4gICAgfVxuXG4gICAgcmV0LnB1c2goZXNjYXBlSFRNTChjaGFuZ2UudmFsdWUpKTtcblxuICAgIGlmIChjaGFuZ2UuYWRkZWQpIHtcbiAgICAgIHJldC5wdXNoKCc8L2lucz4nKTtcbiAgICB9IGVsc2UgaWYgKGNoYW5nZS5yZW1vdmVkKSB7XG4gICAgICByZXQucHVzaCgnPC9kZWw+Jyk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXQuam9pbignJyk7XG59XG5cbmZ1bmN0aW9uIGVzY2FwZUhUTUwocykge1xuICBsZXQgbiA9IHM7XG4gIG4gPSBuLnJlcGxhY2UoLyYvZywgJyZhbXA7Jyk7XG4gIG4gPSBuLnJlcGxhY2UoLzwvZywgJyZsdDsnKTtcbiAgbiA9IG4ucmVwbGFjZSgvPi9nLCAnJmd0OycpO1xuICBuID0gbi5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7Jyk7XG5cbiAgcmV0dXJuIG47XG59XG4iXX0=


/***/ }),

/***/ 546:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

/*istanbul ignore start*/


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.diffArrays = diffArrays;
exports.arrayDiff = void 0;

/*istanbul ignore end*/
var
/*istanbul ignore start*/
_base = _interopRequireDefault(__nccwpck_require__(1653))
/*istanbul ignore end*/
;

/*istanbul ignore start*/ function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*istanbul ignore end*/
var arrayDiff = new
/*istanbul ignore start*/
_base
/*istanbul ignore end*/
.
/*istanbul ignore start*/
default
/*istanbul ignore end*/
();

/*istanbul ignore start*/
exports.arrayDiff = arrayDiff;

/*istanbul ignore end*/
arrayDiff.tokenize = function (value) {
  return value.slice();
};

arrayDiff.join = arrayDiff.removeEmpty = function (value) {
  return value;
};

function diffArrays(oldArr, newArr, callback) {
  return arrayDiff.diff(oldArr, newArr, callback);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaWZmL2FycmF5LmpzIl0sIm5hbWVzIjpbImFycmF5RGlmZiIsIkRpZmYiLCJ0b2tlbml6ZSIsInZhbHVlIiwic2xpY2UiLCJqb2luIiwicmVtb3ZlRW1wdHkiLCJkaWZmQXJyYXlzIiwib2xkQXJyIiwibmV3QXJyIiwiY2FsbGJhY2siLCJkaWZmIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7QUFFTyxJQUFNQSxTQUFTLEdBQUc7QUFBSUM7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQUE7QUFBSjtBQUFBLEVBQWxCOzs7Ozs7QUFDUEQsU0FBUyxDQUFDRSxRQUFWLEdBQXFCLFVBQVNDLEtBQVQsRUFBZ0I7QUFDbkMsU0FBT0EsS0FBSyxDQUFDQyxLQUFOLEVBQVA7QUFDRCxDQUZEOztBQUdBSixTQUFTLENBQUNLLElBQVYsR0FBaUJMLFNBQVMsQ0FBQ00sV0FBVixHQUF3QixVQUFTSCxLQUFULEVBQWdCO0FBQ3ZELFNBQU9BLEtBQVA7QUFDRCxDQUZEOztBQUlPLFNBQVNJLFVBQVQsQ0FBb0JDLE1BQXBCLEVBQTRCQyxNQUE1QixFQUFvQ0MsUUFBcEMsRUFBOEM7QUFBRSxTQUFPVixTQUFTLENBQUNXLElBQVYsQ0FBZUgsTUFBZixFQUF1QkMsTUFBdkIsRUFBK0JDLFFBQS9CLENBQVA7QUFBa0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRGlmZiBmcm9tICcuL2Jhc2UnO1xuXG5leHBvcnQgY29uc3QgYXJyYXlEaWZmID0gbmV3IERpZmYoKTtcbmFycmF5RGlmZi50b2tlbml6ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZS5zbGljZSgpO1xufTtcbmFycmF5RGlmZi5qb2luID0gYXJyYXlEaWZmLnJlbW92ZUVtcHR5ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGRpZmZBcnJheXMob2xkQXJyLCBuZXdBcnIsIGNhbGxiYWNrKSB7IHJldHVybiBhcnJheURpZmYuZGlmZihvbGRBcnIsIG5ld0FyciwgY2FsbGJhY2spOyB9XG4iXX0=


/***/ }),

/***/ 1653:
/***/ ((__unused_webpack_module, exports) => {

/*istanbul ignore start*/


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = Diff;

/*istanbul ignore end*/
function Diff() {}

Diff.prototype = {
  /*istanbul ignore start*/

  /*istanbul ignore end*/
  diff: function diff(oldString, newString) {
    /*istanbul ignore start*/
    var
    /*istanbul ignore end*/
    options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var callback = options.callback;

    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    this.options = options;
    var self = this;

    function done(value) {
      if (callback) {
        setTimeout(function () {
          callback(undefined, value);
        }, 0);
        return true;
      } else {
        return value;
      }
    } // Allow subclasses to massage the input prior to running


    oldString = this.castInput(oldString);
    newString = this.castInput(newString);
    oldString = this.removeEmpty(this.tokenize(oldString));
    newString = this.removeEmpty(this.tokenize(newString));
    var newLen = newString.length,
        oldLen = oldString.length;
    var editLength = 1;
    var maxEditLength = newLen + oldLen;
    var bestPath = [{
      newPos: -1,
      components: []
    }]; // Seed editLength = 0, i.e. the content starts with the same values

    var oldPos = this.extractCommon(bestPath[0], newString, oldString, 0);

    if (bestPath[0].newPos + 1 >= newLen && oldPos + 1 >= oldLen) {
      // Identity per the equality and tokenizer
      return done([{
        value: this.join(newString),
        count: newString.length
      }]);
    } // Main worker method. checks all permutations of a given edit length for acceptance.


    function execEditLength() {
      for (var diagonalPath = -1 * editLength; diagonalPath <= editLength; diagonalPath += 2) {
        var basePath =
        /*istanbul ignore start*/
        void 0
        /*istanbul ignore end*/
        ;

        var addPath = bestPath[diagonalPath - 1],
            removePath = bestPath[diagonalPath + 1],
            _oldPos = (removePath ? removePath.newPos : 0) - diagonalPath;

        if (addPath) {
          // No one else is going to attempt to use this value, clear it
          bestPath[diagonalPath - 1] = undefined;
        }

        var canAdd = addPath && addPath.newPos + 1 < newLen,
            canRemove = removePath && 0 <= _oldPos && _oldPos < oldLen;

        if (!canAdd && !canRemove) {
          // If this path is a terminal then prune
          bestPath[diagonalPath] = undefined;
          continue;
        } // Select the diagonal that we want to branch from. We select the prior
        // path whose position in the new string is the farthest from the origin
        // and does not pass the bounds of the diff graph


        if (!canAdd || canRemove && addPath.newPos < removePath.newPos) {
          basePath = clonePath(removePath);
          self.pushComponent(basePath.components, undefined, true);
        } else {
          basePath = addPath; // No need to clone, we've pulled it from the list

          basePath.newPos++;
          self.pushComponent(basePath.components, true, undefined);
        }

        _oldPos = self.extractCommon(basePath, newString, oldString, diagonalPath); // If we have hit the end of both strings, then we are done

        if (basePath.newPos + 1 >= newLen && _oldPos + 1 >= oldLen) {
          return done(buildValues(self, basePath.components, newString, oldString, self.useLongestToken));
        } else {
          // Otherwise track this path as a potential candidate and continue.
          bestPath[diagonalPath] = basePath;
        }
      }

      editLength++;
    } // Performs the length of edit iteration. Is a bit fugly as this has to support the
    // sync and async mode which is never fun. Loops over execEditLength until a value
    // is produced.


    if (callback) {
      (function exec() {
        setTimeout(function () {
          // This should not happen, but we want to be safe.

          /* istanbul ignore next */
          if (editLength > maxEditLength) {
            return callback();
          }

          if (!execEditLength()) {
            exec();
          }
        }, 0);
      })();
    } else {
      while (editLength <= maxEditLength) {
        var ret = execEditLength();

        if (ret) {
          return ret;
        }
      }
    }
  },

  /*istanbul ignore start*/

  /*istanbul ignore end*/
  pushComponent: function pushComponent(components, added, removed) {
    var last = components[components.length - 1];

    if (last && last.added === added && last.removed === removed) {
      // We need to clone here as the component clone operation is just
      // as shallow array clone
      components[components.length - 1] = {
        count: last.count + 1,
        added: added,
        removed: removed
      };
    } else {
      components.push({
        count: 1,
        added: added,
        removed: removed
      });
    }
  },

  /*istanbul ignore start*/

  /*istanbul ignore end*/
  extractCommon: function extractCommon(basePath, newString, oldString, diagonalPath) {
    var newLen = newString.length,
        oldLen = oldString.length,
        newPos = basePath.newPos,
        oldPos = newPos - diagonalPath,
        commonCount = 0;

    while (newPos + 1 < newLen && oldPos + 1 < oldLen && this.equals(newString[newPos + 1], oldString[oldPos + 1])) {
      newPos++;
      oldPos++;
      commonCount++;
    }

    if (commonCount) {
      basePath.components.push({
        count: commonCount
      });
    }

    basePath.newPos = newPos;
    return oldPos;
  },

  /*istanbul ignore start*/

  /*istanbul ignore end*/
  equals: function equals(left, right) {
    if (this.options.comparator) {
      return this.options.comparator(left, right);
    } else {
      return left === right || this.options.ignoreCase && left.toLowerCase() === right.toLowerCase();
    }
  },

  /*istanbul ignore start*/

  /*istanbul ignore end*/
  removeEmpty: function removeEmpty(array) {
    var ret = [];

    for (var i = 0; i < array.length; i++) {
      if (array[i]) {
        ret.push(array[i]);
      }
    }

    return ret;
  },

  /*istanbul ignore start*/

  /*istanbul ignore end*/
  castInput: function castInput(value) {
    return value;
  },

  /*istanbul ignore start*/

  /*istanbul ignore end*/
  tokenize: function tokenize(value) {
    return value.split('');
  },

  /*istanbul ignore start*/

  /*istanbul ignore end*/
  join: function join(chars) {
    return chars.join('');
  }
};

function buildValues(diff, components, newString, oldString, useLongestToken) {
  var componentPos = 0,
      componentLen = components.length,
      newPos = 0,
      oldPos = 0;

  for (; componentPos < componentLen; componentPos++) {
    var component = components[componentPos];

    if (!component.removed) {
      if (!component.added && useLongestToken) {
        var value = newString.slice(newPos, newPos + component.count);
        value = value.map(function (value, i) {
          var oldValue = oldString[oldPos + i];
          return oldValue.length > value.length ? oldValue : value;
        });
        component.value = diff.join(value);
      } else {
        component.value = diff.join(newString.slice(newPos, newPos + component.count));
      }

      newPos += component.count; // Common case

      if (!component.added) {
        oldPos += component.count;
      }
    } else {
      component.value = diff.join(oldString.slice(oldPos, oldPos + component.count));
      oldPos += component.count; // Reverse add and remove so removes are output first to match common convention
      // The diffing algorithm is tied to add then remove output and this is the simplest
      // route to get the desired output with minimal overhead.

      if (componentPos && components[componentPos - 1].added) {
        var tmp = components[componentPos - 1];
        components[componentPos - 1] = components[componentPos];
        components[componentPos] = tmp;
      }
    }
  } // Special case handle for when one terminal is ignored (i.e. whitespace).
  // For this case we merge the terminal into the prior string and drop the change.
  // This is only available for string mode.


  var lastComponent = components[componentLen - 1];

  if (componentLen > 1 && typeof lastComponent.value === 'string' && (lastComponent.added || lastComponent.removed) && diff.equals('', lastComponent.value)) {
    components[componentLen - 2].value += lastComponent.value;
    components.pop();
  }

  return components;
}

function clonePath(path) {
  return {
    newPos: path.newPos,
    components: path.components.slice(0)
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaWZmL2Jhc2UuanMiXSwibmFtZXMiOlsiRGlmZiIsInByb3RvdHlwZSIsImRpZmYiLCJvbGRTdHJpbmciLCJuZXdTdHJpbmciLCJvcHRpb25zIiwiY2FsbGJhY2siLCJzZWxmIiwiZG9uZSIsInZhbHVlIiwic2V0VGltZW91dCIsInVuZGVmaW5lZCIsImNhc3RJbnB1dCIsInJlbW92ZUVtcHR5IiwidG9rZW5pemUiLCJuZXdMZW4iLCJsZW5ndGgiLCJvbGRMZW4iLCJlZGl0TGVuZ3RoIiwibWF4RWRpdExlbmd0aCIsImJlc3RQYXRoIiwibmV3UG9zIiwiY29tcG9uZW50cyIsIm9sZFBvcyIsImV4dHJhY3RDb21tb24iLCJqb2luIiwiY291bnQiLCJleGVjRWRpdExlbmd0aCIsImRpYWdvbmFsUGF0aCIsImJhc2VQYXRoIiwiYWRkUGF0aCIsInJlbW92ZVBhdGgiLCJjYW5BZGQiLCJjYW5SZW1vdmUiLCJjbG9uZVBhdGgiLCJwdXNoQ29tcG9uZW50IiwiYnVpbGRWYWx1ZXMiLCJ1c2VMb25nZXN0VG9rZW4iLCJleGVjIiwicmV0IiwiYWRkZWQiLCJyZW1vdmVkIiwibGFzdCIsInB1c2giLCJjb21tb25Db3VudCIsImVxdWFscyIsImxlZnQiLCJyaWdodCIsImNvbXBhcmF0b3IiLCJpZ25vcmVDYXNlIiwidG9Mb3dlckNhc2UiLCJhcnJheSIsImkiLCJzcGxpdCIsImNoYXJzIiwiY29tcG9uZW50UG9zIiwiY29tcG9uZW50TGVuIiwiY29tcG9uZW50Iiwic2xpY2UiLCJtYXAiLCJvbGRWYWx1ZSIsInRtcCIsImxhc3RDb21wb25lbnQiLCJwb3AiLCJwYXRoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBZSxTQUFTQSxJQUFULEdBQWdCLENBQUU7O0FBRWpDQSxJQUFJLENBQUNDLFNBQUwsR0FBaUI7QUFBQTs7QUFBQTtBQUNmQyxFQUFBQSxJQURlLGdCQUNWQyxTQURVLEVBQ0NDLFNBREQsRUFDMEI7QUFBQTtBQUFBO0FBQUE7QUFBZEMs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QUcsQ0FBZixJQUNHLE9BQU9NLGFBQWEsQ0FBQ3JELEtBQXJCLEtBQStCLFFBRGxDLEtBRUlxRCxhQUFhLENBQUN0QixLQUFkLElBQXVCc0IsYUFBYSxDQUFDckIsT0FGekMsS0FHR3ZDLElBQUksQ0FBQzJDLE1BQUwsQ0FBWSxFQUFaLEVBQWdCaUIsYUFBYSxDQUFDckQsS0FBOUIsQ0FIUCxFQUc2QztBQUMzQ2EsSUFBQUEsVUFBVSxDQUFDa0MsWUFBWSxHQUFHLENBQWhCLENBQVYsQ0FBNkIvQyxLQUE3QixJQUFzQ3FELGFBQWEsQ0FBQ3JELEtBQXBEO0FBQ0FhLElBQUFBLFVBQVUsQ0FBQ3lDLEdBQVg7QUFDRDs7QUFFRCxTQUFPekMsVUFBUDtBQUNEOztBQUVELFNBQVNZLFNBQVQsQ0FBbUI4QixJQUFuQixFQUF5QjtBQUN2QixTQUFPO0FBQUUzQyxJQUFBQSxNQUFNLEVBQUUyQyxJQUFJLENBQUMzQyxNQUFmO0FBQXVCQyxJQUFBQSxVQUFVLEVBQUUwQyxJQUFJLENBQUMxQyxVQUFMLENBQWdCb0MsS0FBaEIsQ0FBc0IsQ0FBdEI7QUFBbkMsR0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRGlmZigpIHt9XG5cbkRpZmYucHJvdG90eXBlID0ge1xuICBkaWZmKG9sZFN0cmluZywgbmV3U3RyaW5nLCBvcHRpb25zID0ge30pIHtcbiAgICBsZXQgY2FsbGJhY2sgPSBvcHRpb25zLmNhbGxiYWNrO1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY2FsbGJhY2sgPSBvcHRpb25zO1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXG4gICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgZnVuY3Rpb24gZG9uZSh2YWx1ZSkge1xuICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IGNhbGxiYWNrKHVuZGVmaW5lZCwgdmFsdWUpOyB9LCAwKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQWxsb3cgc3ViY2xhc3NlcyB0byBtYXNzYWdlIHRoZSBpbnB1dCBwcmlvciB0byBydW5uaW5nXG4gICAgb2xkU3RyaW5nID0gdGhpcy5jYXN0SW5wdXQob2xkU3RyaW5nKTtcbiAgICBuZXdTdHJpbmcgPSB0aGlzLmNhc3RJbnB1dChuZXdTdHJpbmcpO1xuXG4gICAgb2xkU3RyaW5nID0gdGhpcy5yZW1vdmVFbXB0eSh0aGlzLnRva2VuaXplKG9sZFN0cmluZykpO1xuICAgIG5ld1N0cmluZyA9IHRoaXMucmVtb3ZlRW1wdHkodGhpcy50b2tlbml6ZShuZXdTdHJpbmcpKTtcblxuICAgIGxldCBuZXdMZW4gPSBuZXdTdHJpbmcubGVuZ3RoLCBvbGRMZW4gPSBvbGRTdHJpbmcubGVuZ3RoO1xuICAgIGxldCBlZGl0TGVuZ3RoID0gMTtcbiAgICBsZXQgbWF4RWRpdExlbmd0aCA9IG5ld0xlbiArIG9sZExlbjtcbiAgICBsZXQgYmVzdFBhdGggPSBbeyBuZXdQb3M6IC0xLCBjb21wb25lbnRzOiBbXSB9XTtcblxuICAgIC8vIFNlZWQgZWRpdExlbmd0aCA9IDAsIGkuZS4gdGhlIGNvbnRlbnQgc3RhcnRzIHdpdGggdGhlIHNhbWUgdmFsdWVzXG4gICAgbGV0IG9sZFBvcyA9IHRoaXMuZXh0cmFjdENvbW1vbihiZXN0UGF0aFswXSwgbmV3U3RyaW5nLCBvbGRTdHJpbmcsIDApO1xuICAgIGlmIChiZXN0UGF0aFswXS5uZXdQb3MgKyAxID49IG5ld0xlbiAmJiBvbGRQb3MgKyAxID49IG9sZExlbikge1xuICAgICAgLy8gSWRlbnRpdHkgcGVyIHRoZSBlcXVhbGl0eSBhbmQgdG9rZW5pemVyXG4gICAgICByZXR1cm4gZG9uZShbe3ZhbHVlOiB0aGlzLmpvaW4obmV3U3RyaW5nKSwgY291bnQ6IG5ld1N0cmluZy5sZW5ndGh9XSk7XG4gICAgfVxuXG4gICAgLy8gTWFpbiB3b3JrZXIgbWV0aG9kLiBjaGVja3MgYWxsIHBlcm11dGF0aW9ucyBvZiBhIGdpdmVuIGVkaXQgbGVuZ3RoIGZvciBhY2NlcHRhbmNlLlxuICAgIGZ1bmN0aW9uIGV4ZWNFZGl0TGVuZ3RoKCkge1xuICAgICAgZm9yIChsZXQgZGlhZ29uYWxQYXRoID0gLTEgKiBlZGl0TGVuZ3RoOyBkaWFnb25hbFBhdGggPD0gZWRpdExlbmd0aDsgZGlhZ29uYWxQYXRoICs9IDIpIHtcbiAgICAgICAgbGV0IGJhc2VQYXRoO1xuICAgICAgICBsZXQgYWRkUGF0aCA9IGJlc3RQYXRoW2RpYWdvbmFsUGF0aCAtIDFdLFxuICAgICAgICAgICAgcmVtb3ZlUGF0aCA9IGJlc3RQYXRoW2RpYWdvbmFsUGF0aCArIDFdLFxuICAgICAgICAgICAgb2xkUG9zID0gKHJlbW92ZVBhdGggPyByZW1vdmVQYXRoLm5ld1BvcyA6IDApIC0gZGlhZ29uYWxQYXRoO1xuICAgICAgICBpZiAoYWRkUGF0aCkge1xuICAgICAgICAgIC8vIE5vIG9uZSBlbHNlIGlzIGdvaW5nIHRvIGF0dGVtcHQgdG8gdXNlIHRoaXMgdmFsdWUsIGNsZWFyIGl0XG4gICAgICAgICAgYmVzdFBhdGhbZGlhZ29uYWxQYXRoIC0gMV0gPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY2FuQWRkID0gYWRkUGF0aCAmJiBhZGRQYXRoLm5ld1BvcyArIDEgPCBuZXdMZW4sXG4gICAgICAgICAgICBjYW5SZW1vdmUgPSByZW1vdmVQYXRoICYmIDAgPD0gb2xkUG9zICYmIG9sZFBvcyA8IG9sZExlbjtcbiAgICAgICAgaWYgKCFjYW5BZGQgJiYgIWNhblJlbW92ZSkge1xuICAgICAgICAgIC8vIElmIHRoaXMgcGF0aCBpcyBhIHRlcm1pbmFsIHRoZW4gcHJ1bmVcbiAgICAgICAgICBiZXN0UGF0aFtkaWFnb25hbFBhdGhdID0gdW5kZWZpbmVkO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2VsZWN0IHRoZSBkaWFnb25hbCB0aGF0IHdlIHdhbnQgdG8gYnJhbmNoIGZyb20uIFdlIHNlbGVjdCB0aGUgcHJpb3JcbiAgICAgICAgLy8gcGF0aCB3aG9zZSBwb3NpdGlvbiBpbiB0aGUgbmV3IHN0cmluZyBpcyB0aGUgZmFydGhlc3QgZnJvbSB0aGUgb3JpZ2luXG4gICAgICAgIC8vIGFuZCBkb2VzIG5vdCBwYXNzIHRoZSBib3VuZHMgb2YgdGhlIGRpZmYgZ3JhcGhcbiAgICAgICAgaWYgKCFjYW5BZGQgfHwgKGNhblJlbW92ZSAmJiBhZGRQYXRoLm5ld1BvcyA8IHJlbW92ZVBhdGgubmV3UG9zKSkge1xuICAgICAgICAgIGJhc2VQYXRoID0gY2xvbmVQYXRoKHJlbW92ZVBhdGgpO1xuICAgICAgICAgIHNlbGYucHVzaENvbXBvbmVudChiYXNlUGF0aC5jb21wb25lbnRzLCB1bmRlZmluZWQsIHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJhc2VQYXRoID0gYWRkUGF0aDsgLy8gTm8gbmVlZCB0byBjbG9uZSwgd2UndmUgcHVsbGVkIGl0IGZyb20gdGhlIGxpc3RcbiAgICAgICAgICBiYXNlUGF0aC5uZXdQb3MrKztcbiAgICAgICAgICBzZWxmLnB1c2hDb21wb25lbnQoYmFzZVBhdGguY29tcG9uZW50cywgdHJ1ZSwgdW5kZWZpbmVkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9sZFBvcyA9IHNlbGYuZXh0cmFjdENvbW1vbihiYXNlUGF0aCwgbmV3U3RyaW5nLCBvbGRTdHJpbmcsIGRpYWdvbmFsUGF0aCk7XG5cbiAgICAgICAgLy8gSWYgd2UgaGF2ZSBoaXQgdGhlIGVuZCBvZiBib3RoIHN0cmluZ3MsIHRoZW4gd2UgYXJlIGRvbmVcbiAgICAgICAgaWYgKGJhc2VQYXRoLm5ld1BvcyArIDEgPj0gbmV3TGVuICYmIG9sZFBvcyArIDEgPj0gb2xkTGVuKSB7XG4gICAgICAgICAgcmV0dXJuIGRvbmUoYnVpbGRWYWx1ZXMoc2VsZiwgYmFzZVBhdGguY29tcG9uZW50cywgbmV3U3RyaW5nLCBvbGRTdHJpbmcsIHNlbGYudXNlTG9uZ2VzdFRva2VuKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gT3RoZXJ3aXNlIHRyYWNrIHRoaXMgcGF0aCBhcyBhIHBvdGVudGlhbCBjYW5kaWRhdGUgYW5kIGNvbnRpbnVlLlxuICAgICAgICAgIGJlc3RQYXRoW2RpYWdvbmFsUGF0aF0gPSBiYXNlUGF0aDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBlZGl0TGVuZ3RoKys7XG4gICAgfVxuXG4gICAgLy8gUGVyZm9ybXMgdGhlIGxlbmd0aCBvZiBlZGl0IGl0ZXJhdGlvbi4gSXMgYSBiaXQgZnVnbHkgYXMgdGhpcyBoYXMgdG8gc3VwcG9ydCB0aGVcbiAgICAvLyBzeW5jIGFuZCBhc3luYyBtb2RlIHdoaWNoIGlzIG5ldmVyIGZ1bi4gTG9vcHMgb3ZlciBleGVjRWRpdExlbmd0aCB1bnRpbCBhIHZhbHVlXG4gICAgLy8gaXMgcHJvZHVjZWQuXG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAoZnVuY3Rpb24gZXhlYygpIHtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAvLyBUaGlzIHNob3VsZCBub3QgaGFwcGVuLCBidXQgd2Ugd2FudCB0byBiZSBzYWZlLlxuICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICAgICAgaWYgKGVkaXRMZW5ndGggPiBtYXhFZGl0TGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIWV4ZWNFZGl0TGVuZ3RoKCkpIHtcbiAgICAgICAgICAgIGV4ZWMoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIDApO1xuICAgICAgfSgpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgd2hpbGUgKGVkaXRMZW5ndGggPD0gbWF4RWRpdExlbmd0aCkge1xuICAgICAgICBsZXQgcmV0ID0gZXhlY0VkaXRMZW5ndGgoKTtcbiAgICAgICAgaWYgKHJldCkge1xuICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgcHVzaENvbXBvbmVudChjb21wb25lbnRzLCBhZGRlZCwgcmVtb3ZlZCkge1xuICAgIGxldCBsYXN0ID0gY29tcG9uZW50c1tjb21wb25lbnRzLmxlbmd0aCAtIDFdO1xuICAgIGlmIChsYXN0ICYmIGxhc3QuYWRkZWQgPT09IGFkZGVkICYmIGxhc3QucmVtb3ZlZCA9PT0gcmVtb3ZlZCkge1xuICAgICAgLy8gV2UgbmVlZCB0byBjbG9uZSBoZXJlIGFzIHRoZSBjb21wb25lbnQgY2xvbmUgb3BlcmF0aW9uIGlzIGp1c3RcbiAgICAgIC8vIGFzIHNoYWxsb3cgYXJyYXkgY2xvbmVcbiAgICAgIGNvbXBvbmVudHNbY29tcG9uZW50cy5sZW5ndGggLSAxXSA9IHtjb3VudDogbGFzdC5jb3VudCArIDEsIGFkZGVkOiBhZGRlZCwgcmVtb3ZlZDogcmVtb3ZlZCB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBjb21wb25lbnRzLnB1c2goe2NvdW50OiAxLCBhZGRlZDogYWRkZWQsIHJlbW92ZWQ6IHJlbW92ZWQgfSk7XG4gICAgfVxuICB9LFxuICBleHRyYWN0Q29tbW9uKGJhc2VQYXRoLCBuZXdTdHJpbmcsIG9sZFN0cmluZywgZGlhZ29uYWxQYXRoKSB7XG4gICAgbGV0IG5ld0xlbiA9IG5ld1N0cmluZy5sZW5ndGgsXG4gICAgICAgIG9sZExlbiA9IG9sZFN0cmluZy5sZW5ndGgsXG4gICAgICAgIG5ld1BvcyA9IGJhc2VQYXRoLm5ld1BvcyxcbiAgICAgICAgb2xkUG9zID0gbmV3UG9zIC0gZGlhZ29uYWxQYXRoLFxuXG4gICAgICAgIGNvbW1vbkNvdW50ID0gMDtcbiAgICB3aGlsZSAobmV3UG9zICsgMSA8IG5ld0xlbiAmJiBvbGRQb3MgKyAxIDwgb2xkTGVuICYmIHRoaXMuZXF1YWxzKG5ld1N0cmluZ1tuZXdQb3MgKyAxXSwgb2xkU3RyaW5nW29sZFBvcyArIDFdKSkge1xuICAgICAgbmV3UG9zKys7XG4gICAgICBvbGRQb3MrKztcbiAgICAgIGNvbW1vbkNvdW50Kys7XG4gICAgfVxuXG4gICAgaWYgKGNvbW1vbkNvdW50KSB7XG4gICAgICBiYXNlUGF0aC5jb21wb25lbnRzLnB1c2goe2NvdW50OiBjb21tb25Db3VudH0pO1xuICAgIH1cblxuICAgIGJhc2VQYXRoLm5ld1BvcyA9IG5ld1BvcztcbiAgICByZXR1cm4gb2xkUG9zO1xuICB9LFxuXG4gIGVxdWFscyhsZWZ0LCByaWdodCkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuY29tcGFyYXRvcikge1xuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5jb21wYXJhdG9yKGxlZnQsIHJpZ2h0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGxlZnQgPT09IHJpZ2h0XG4gICAgICAgIHx8ICh0aGlzLm9wdGlvbnMuaWdub3JlQ2FzZSAmJiBsZWZ0LnRvTG93ZXJDYXNlKCkgPT09IHJpZ2h0LnRvTG93ZXJDYXNlKCkpO1xuICAgIH1cbiAgfSxcbiAgcmVtb3ZlRW1wdHkoYXJyYXkpIHtcbiAgICBsZXQgcmV0ID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGFycmF5W2ldKSB7XG4gICAgICAgIHJldC5wdXNoKGFycmF5W2ldKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfSxcbiAgY2FzdElucHV0KHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9LFxuICB0b2tlbml6ZSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZS5zcGxpdCgnJyk7XG4gIH0sXG4gIGpvaW4oY2hhcnMpIHtcbiAgICByZXR1cm4gY2hhcnMuam9pbignJyk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGJ1aWxkVmFsdWVzKGRpZmYsIGNvbXBvbmVudHMsIG5ld1N0cmluZywgb2xkU3RyaW5nLCB1c2VMb25nZXN0VG9rZW4pIHtcbiAgbGV0IGNvbXBvbmVudFBvcyA9IDAsXG4gICAgICBjb21wb25lbnRMZW4gPSBjb21wb25lbnRzLmxlbmd0aCxcbiAgICAgIG5ld1BvcyA9IDAsXG4gICAgICBvbGRQb3MgPSAwO1xuXG4gIGZvciAoOyBjb21wb25lbnRQb3MgPCBjb21wb25lbnRMZW47IGNvbXBvbmVudFBvcysrKSB7XG4gICAgbGV0IGNvbXBvbmVudCA9IGNvbXBvbmVudHNbY29tcG9uZW50UG9zXTtcbiAgICBpZiAoIWNvbXBvbmVudC5yZW1vdmVkKSB7XG4gICAgICBpZiAoIWNvbXBvbmVudC5hZGRlZCAmJiB1c2VMb25nZXN0VG9rZW4pIHtcbiAgICAgICAgbGV0IHZhbHVlID0gbmV3U3RyaW5nLnNsaWNlKG5ld1BvcywgbmV3UG9zICsgY29tcG9uZW50LmNvdW50KTtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5tYXAoZnVuY3Rpb24odmFsdWUsIGkpIHtcbiAgICAgICAgICBsZXQgb2xkVmFsdWUgPSBvbGRTdHJpbmdbb2xkUG9zICsgaV07XG4gICAgICAgICAgcmV0dXJuIG9sZFZhbHVlLmxlbmd0aCA+IHZhbHVlLmxlbmd0aCA/IG9sZFZhbHVlIDogdmFsdWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbXBvbmVudC52YWx1ZSA9IGRpZmYuam9pbih2YWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb21wb25lbnQudmFsdWUgPSBkaWZmLmpvaW4obmV3U3RyaW5nLnNsaWNlKG5ld1BvcywgbmV3UG9zICsgY29tcG9uZW50LmNvdW50KSk7XG4gICAgICB9XG4gICAgICBuZXdQb3MgKz0gY29tcG9uZW50LmNvdW50O1xuXG4gICAgICAvLyBDb21tb24gY2FzZVxuICAgICAgaWYgKCFjb21wb25lbnQuYWRkZWQpIHtcbiAgICAgICAgb2xkUG9zICs9IGNvbXBvbmVudC5jb3VudDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29tcG9uZW50LnZhbHVlID0gZGlmZi5qb2luKG9sZFN0cmluZy5zbGljZShvbGRQb3MsIG9sZFBvcyArIGNvbXBvbmVudC5jb3VudCkpO1xuICAgICAgb2xkUG9zICs9IGNvbXBvbmVudC5jb3VudDtcblxuICAgICAgLy8gUmV2ZXJzZSBhZGQgYW5kIHJlbW92ZSBzbyByZW1vdmVzIGFyZSBvdXRwdXQgZmlyc3QgdG8gbWF0Y2ggY29tbW9uIGNvbnZlbnRpb25cbiAgICAgIC8vIFRoZSBkaWZmaW5nIGFsZ29yaXRobSBpcyB0aWVkIHRvIGFkZCB0aGVuIHJlbW92ZSBvdXRwdXQgYW5kIHRoaXMgaXMgdGhlIHNpbXBsZXN0XG4gICAgICAvLyByb3V0ZSB0byBnZXQgdGhlIGRlc2lyZWQgb3V0cHV0IHdpdGggbWluaW1hbCBvdmVyaGVhZC5cbiAgICAgIGlmIChjb21wb25lbnRQb3MgJiYgY29tcG9uZW50c1tjb21wb25lbnRQb3MgLSAxXS5hZGRlZCkge1xuICAgICAgICBsZXQgdG1wID0gY29tcG9uZW50c1tjb21wb25lbnRQb3MgLSAxXTtcbiAgICAgICAgY29tcG9uZW50c1tjb21wb25lbnRQb3MgLSAxXSA9IGNvbXBvbmVudHNbY29tcG9uZW50UG9zXTtcbiAgICAgICAgY29tcG9uZW50c1tjb21wb25lbnRQb3NdID0gdG1wO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFNwZWNpYWwgY2FzZSBoYW5kbGUgZm9yIHdoZW4gb25lIHRlcm1pbmFsIGlzIGlnbm9yZWQgKGkuZS4gd2hpdGVzcGFjZSkuXG4gIC8vIEZvciB0aGlzIGNhc2Ugd2UgbWVyZ2UgdGhlIHRlcm1pbmFsIGludG8gdGhlIHByaW9yIHN0cmluZyBhbmQgZHJvcCB0aGUgY2hhbmdlLlxuICAvLyBUaGlzIGlzIG9ubHkgYXZhaWxhYmxlIGZvciBzdHJpbmcgbW9kZS5cbiAgbGV0IGxhc3RDb21wb25lbnQgPSBjb21wb25lbnRzW2NvbXBvbmVudExlbiAtIDFdO1xuICBpZiAoY29tcG9uZW50TGVuID4gMVxuICAgICAgJiYgdHlwZW9mIGxhc3RDb21wb25lbnQudmFsdWUgPT09ICdzdHJpbmcnXG4gICAgICAmJiAobGFzdENvbXBvbmVudC5hZGRlZCB8fCBsYXN0Q29tcG9uZW50LnJlbW92ZWQpXG4gICAgICAmJiBkaWZmLmVxdWFscygnJywgbGFzdENvbXBvbmVudC52YWx1ZSkpIHtcbiAgICBjb21wb25lbnRzW2NvbXBvbmVudExlbiAtIDJdLnZhbHVlICs9IGxhc3RDb21wb25lbnQudmFsdWU7XG4gICAgY29tcG9uZW50cy5wb3AoKTtcbiAgfVxuXG4gIHJldHVybiBjb21wb25lbnRzO1xufVxuXG5mdW5jdGlvbiBjbG9uZVBhdGgocGF0aCkge1xuICByZXR1cm4geyBuZXdQb3M6IHBhdGgubmV3UG9zLCBjb21wb25lbnRzOiBwYXRoLmNvbXBvbmVudHMuc2xpY2UoMCkgfTtcbn1cbiJdfQ==


/***/ }),

/***/ 2081:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

/*istanbul ignore start*/


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.diffChars = diffChars;
exports.characterDiff = void 0;

/*istanbul ignore end*/
var
/*istanbul ignore start*/
_base = _interopRequireDefault(__nccwpck_require__(1653))
/*istanbul ignore end*/
;

/*istanbul ignore start*/ function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*istanbul ignore end*/
var characterDiff = new
/*istanbul ignore start*/
_base
/*istanbul ignore end*/
.
/*istanbul ignore start*/
default
/*istanbul ignore end*/
();

/*istanbul ignore start*/
exports.characterDiff = characterDiff;

/*istanbul ignore end*/
function diffChars(oldStr, newStr, options) {
  return characterDiff.diff(oldStr, newStr, options);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaWZmL2NoYXJhY3Rlci5qcyJdLCJuYW1lcyI6WyJjaGFyYWN0ZXJEaWZmIiwiRGlmZiIsImRpZmZDaGFycyIsIm9sZFN0ciIsIm5ld1N0ciIsIm9wdGlvbnMiLCJkaWZmIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7QUFFTyxJQUFNQSxhQUFhLEdBQUc7QUFBSUM7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQUE7QUFBSjtBQUFBLEVBQXRCOzs7Ozs7QUFDQSxTQUFTQyxTQUFULENBQW1CQyxNQUFuQixFQUEyQkMsTUFBM0IsRUFBbUNDLE9BQW5DLEVBQTRDO0FBQUUsU0FBT0wsYUFBYSxDQUFDTSxJQUFkLENBQW1CSCxNQUFuQixFQUEyQkMsTUFBM0IsRUFBbUNDLE9BQW5DLENBQVA7QUFBcUQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRGlmZiBmcm9tICcuL2Jhc2UnO1xuXG5leHBvcnQgY29uc3QgY2hhcmFjdGVyRGlmZiA9IG5ldyBEaWZmKCk7XG5leHBvcnQgZnVuY3Rpb24gZGlmZkNoYXJzKG9sZFN0ciwgbmV3U3RyLCBvcHRpb25zKSB7IHJldHVybiBjaGFyYWN0ZXJEaWZmLmRpZmYob2xkU3RyLCBuZXdTdHIsIG9wdGlvbnMpOyB9XG4iXX0=


/***/ }),

/***/ 8941:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

/*istanbul ignore start*/


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.diffCss = diffCss;
exports.cssDiff = void 0;

/*istanbul ignore end*/
var
/*istanbul ignore start*/
_base = _interopRequireDefault(__nccwpck_require__(1653))
/*istanbul ignore end*/
;

/*istanbul ignore start*/ function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*istanbul ignore end*/
var cssDiff = new
/*istanbul ignore start*/
_base
/*istanbul ignore end*/
.
/*istanbul ignore start*/
default
/*istanbul ignore end*/
();

/*istanbul ignore start*/
exports.cssDiff = cssDiff;

/*istanbul ignore end*/
cssDiff.tokenize = function (value) {
  return value.split(/([{}:;,]|\s+)/);
};

function diffCss(oldStr, newStr, callback) {
  return cssDiff.diff(oldStr, newStr, callback);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaWZmL2Nzcy5qcyJdLCJuYW1lcyI6WyJjc3NEaWZmIiwiRGlmZiIsInRva2VuaXplIiwidmFsdWUiLCJzcGxpdCIsImRpZmZDc3MiLCJvbGRTdHIiLCJuZXdTdHIiLCJjYWxsYmFjayIsImRpZmYiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7OztBQUVPLElBQU1BLE9BQU8sR0FBRztBQUFJQztBQUFBQTtBQUFBQTtBQUFBQTtBQUFBQTtBQUFBQTtBQUFKO0FBQUEsRUFBaEI7Ozs7OztBQUNQRCxPQUFPLENBQUNFLFFBQVIsR0FBbUIsVUFBU0MsS0FBVCxFQUFnQjtBQUNqQyxTQUFPQSxLQUFLLENBQUNDLEtBQU4sQ0FBWSxlQUFaLENBQVA7QUFDRCxDQUZEOztBQUlPLFNBQVNDLE9BQVQsQ0FBaUJDLE1BQWpCLEVBQXlCQyxNQUF6QixFQUFpQ0MsUUFBakMsRUFBMkM7QUFBRSxTQUFPUixPQUFPLENBQUNTLElBQVIsQ0FBYUgsTUFBYixFQUFxQkMsTUFBckIsRUFBNkJDLFFBQTdCLENBQVA7QUFBZ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRGlmZiBmcm9tICcuL2Jhc2UnO1xuXG5leHBvcnQgY29uc3QgY3NzRGlmZiA9IG5ldyBEaWZmKCk7XG5jc3NEaWZmLnRva2VuaXplID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlLnNwbGl0KC8oW3t9OjssXXxcXHMrKS8pO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGRpZmZDc3Mob2xkU3RyLCBuZXdTdHIsIGNhbGxiYWNrKSB7IHJldHVybiBjc3NEaWZmLmRpZmYob2xkU3RyLCBuZXdTdHIsIGNhbGxiYWNrKTsgfVxuIl19


/***/ }),

/***/ 6335:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

/*istanbul ignore start*/


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.diffJson = diffJson;
exports.canonicalize = canonicalize;
exports.jsonDiff = void 0;

/*istanbul ignore end*/
var
/*istanbul ignore start*/
_base = _interopRequireDefault(__nccwpck_require__(1653))
/*istanbul ignore end*/
;

var
/*istanbul ignore start*/
_line = __nccwpck_require__(1591)
/*istanbul ignore end*/
;

/*istanbul ignore start*/ function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*istanbul ignore end*/
var objectPrototypeToString = Object.prototype.toString;
var jsonDiff = new
/*istanbul ignore start*/
_base
/*istanbul ignore end*/
.
/*istanbul ignore start*/
default
/*istanbul ignore end*/
(); // Discriminate between two lines of pretty-printed, serialized JSON where one of them has a
// dangling comma and the other doesn't. Turns out including the dangling comma yields the nicest output:

/*istanbul ignore start*/
exports.jsonDiff = jsonDiff;

/*istanbul ignore end*/
jsonDiff.useLongestToken = true;
jsonDiff.tokenize =
/*istanbul ignore start*/
_line
/*istanbul ignore end*/
.
/*istanbul ignore start*/
lineDiff
/*istanbul ignore end*/
.tokenize;

jsonDiff.castInput = function (value) {
  /*istanbul ignore start*/
  var _this$options =
  /*istanbul ignore end*/
  this.options,
      undefinedReplacement = _this$options.undefinedReplacement,
      _this$options$stringi = _this$options.stringifyReplacer,
      stringifyReplacer = _this$options$stringi === void 0 ? function (k, v)
  /*istanbul ignore start*/
  {
    return (
      /*istanbul ignore end*/
      typeof v === 'undefined' ? undefinedReplacement : v
    );
  } : _this$options$stringi;
  return typeof value === 'string' ? value : JSON.stringify(canonicalize(value, null, null, stringifyReplacer), stringifyReplacer, '  ');
};

jsonDiff.equals = function (left, right) {
  return (
    /*istanbul ignore start*/
    _base
    /*istanbul ignore end*/
    .
    /*istanbul ignore start*/
    default
    /*istanbul ignore end*/
    .prototype.equals.call(jsonDiff, left.replace(/,([\r\n])/g, '$1'), right.replace(/,([\r\n])/g, '$1'))
  );
};

function diffJson(oldObj, newObj, options) {
  return jsonDiff.diff(oldObj, newObj, options);
} // This function handles the presence of circular references by bailing out when encountering an
// object that is already on the "stack" of items being processed. Accepts an optional replacer


function canonicalize(obj, stack, replacementStack, replacer, key) {
  stack = stack || [];
  replacementStack = replacementStack || [];

  if (replacer) {
    obj = replacer(key, obj);
  }

  var i;

  for (i = 0; i < stack.length; i += 1) {
    if (stack[i] === obj) {
      return replacementStack[i];
    }
  }

  var canonicalizedObj;

  if ('[object Array]' === objectPrototypeToString.call(obj)) {
    stack.push(obj);
    canonicalizedObj = new Array(obj.length);
    replacementStack.push(canonicalizedObj);

    for (i = 0; i < obj.length; i += 1) {
      canonicalizedObj[i] = canonicalize(obj[i], stack, replacementStack, replacer, key);
    }

    stack.pop();
    replacementStack.pop();
    return canonicalizedObj;
  }

  if (obj && obj.toJSON) {
    obj = obj.toJSON();
  }

  if (
  /*istanbul ignore start*/
  _typeof(
  /*istanbul ignore end*/
  obj) === 'object' && obj !== null) {
    stack.push(obj);
    canonicalizedObj = {};
    replacementStack.push(canonicalizedObj);

    var sortedKeys = [],
        _key;

    for (_key in obj) {
      /* istanbul ignore else */
      if (obj.hasOwnProperty(_key)) {
        sortedKeys.push(_key);
      }
    }

    sortedKeys.sort();

    for (i = 0; i < sortedKeys.length; i += 1) {
      _key = sortedKeys[i];
      canonicalizedObj[_key] = canonicalize(obj[_key], stack, replacementStack, replacer, _key);
    }

    stack.pop();
    replacementStack.pop();
  } else {
    canonicalizedObj = obj;
  }

  return canonicalizedObj;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaWZmL2pzb24uanMiXSwibmFtZXMiOlsib2JqZWN0UHJvdG90eXBlVG9TdHJpbmciLCJPYmplY3QiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImpzb25EaWZmIiwiRGlmZiIsInVzZUxvbmdlc3RUb2tlbiIsInRva2VuaXplIiwibGluZURpZmYiLCJjYXN0SW5wdXQiLCJ2YWx1ZSIsIm9wdGlvbnMiLCJ1bmRlZmluZWRSZXBsYWNlbWVudCIsInN0cmluZ2lmeVJlcGxhY2VyIiwiayIsInYiLCJKU09OIiwic3RyaW5naWZ5IiwiY2Fub25pY2FsaXplIiwiZXF1YWxzIiwibGVmdCIsInJpZ2h0IiwiY2FsbCIsInJlcGxhY2UiLCJkaWZmSnNvbiIsIm9sZE9iaiIsIm5ld09iaiIsImRpZmYiLCJvYmoiLCJzdGFjayIsInJlcGxhY2VtZW50U3RhY2siLCJyZXBsYWNlciIsImtleSIsImkiLCJsZW5ndGgiLCJjYW5vbmljYWxpemVkT2JqIiwicHVzaCIsIkFycmF5IiwicG9wIiwidG9KU09OIiwic29ydGVkS2V5cyIsImhhc093blByb3BlcnR5Iiwic29ydCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7QUFFQSxJQUFNQSx1QkFBdUIsR0FBR0MsTUFBTSxDQUFDQyxTQUFQLENBQWlCQyxRQUFqRDtBQUdPLElBQU1DLFFBQVEsR0FBRztBQUFJQztBQUFBQTtBQUFBQTtBQUFBQTtBQUFBQTtBQUFBQTtBQUFKO0FBQUEsRUFBakIsQyxDQUNQO0FBQ0E7Ozs7OztBQUNBRCxRQUFRLENBQUNFLGVBQVQsR0FBMkIsSUFBM0I7QUFFQUYsUUFBUSxDQUFDRyxRQUFUO0FBQW9CQztBQUFBQTtBQUFBQTtBQUFBQTtBQUFBQTtBQUFBQTtBQUFBO0FBQUEsQ0FBU0QsUUFBN0I7O0FBQ0FILFFBQVEsQ0FBQ0ssU0FBVCxHQUFxQixVQUFTQyxLQUFULEVBQWdC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R0FBbkI7QUFDRDs7QUFDRCxTQUFPTyxnQkFBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERpZmYgZnJvbSAnLi9iYXNlJztcbmltcG9ydCB7bGluZURpZmZ9IGZyb20gJy4vbGluZSc7XG5cbmNvbnN0IG9iamVjdFByb3RvdHlwZVRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuXG5leHBvcnQgY29uc3QganNvbkRpZmYgPSBuZXcgRGlmZigpO1xuLy8gRGlzY3JpbWluYXRlIGJldHdlZW4gdHdvIGxpbmVzIG9mIHByZXR0eS1wcmludGVkLCBzZXJpYWxpemVkIEpTT04gd2hlcmUgb25lIG9mIHRoZW0gaGFzIGFcbi8vIGRhbmdsaW5nIGNvbW1hIGFuZCB0aGUgb3RoZXIgZG9lc24ndC4gVHVybnMgb3V0IGluY2x1ZGluZyB0aGUgZGFuZ2xpbmcgY29tbWEgeWllbGRzIHRoZSBuaWNlc3Qgb3V0cHV0OlxuanNvbkRpZmYudXNlTG9uZ2VzdFRva2VuID0gdHJ1ZTtcblxuanNvbkRpZmYudG9rZW5pemUgPSBsaW5lRGlmZi50b2tlbml6ZTtcbmpzb25EaWZmLmNhc3RJbnB1dCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIGNvbnN0IHt1bmRlZmluZWRSZXBsYWNlbWVudCwgc3RyaW5naWZ5UmVwbGFjZXIgPSAoaywgdikgPT4gdHlwZW9mIHYgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkUmVwbGFjZW1lbnQgOiB2fSA9IHRoaXMub3B0aW9ucztcblxuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyA/IHZhbHVlIDogSlNPTi5zdHJpbmdpZnkoY2Fub25pY2FsaXplKHZhbHVlLCBudWxsLCBudWxsLCBzdHJpbmdpZnlSZXBsYWNlciksIHN0cmluZ2lmeVJlcGxhY2VyLCAnICAnKTtcbn07XG5qc29uRGlmZi5lcXVhbHMgPSBmdW5jdGlvbihsZWZ0LCByaWdodCkge1xuICByZXR1cm4gRGlmZi5wcm90b3R5cGUuZXF1YWxzLmNhbGwoanNvbkRpZmYsIGxlZnQucmVwbGFjZSgvLChbXFxyXFxuXSkvZywgJyQxJyksIHJpZ2h0LnJlcGxhY2UoLywoW1xcclxcbl0pL2csICckMScpKTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBkaWZmSnNvbihvbGRPYmosIG5ld09iaiwgb3B0aW9ucykgeyByZXR1cm4ganNvbkRpZmYuZGlmZihvbGRPYmosIG5ld09iaiwgb3B0aW9ucyk7IH1cblxuLy8gVGhpcyBmdW5jdGlvbiBoYW5kbGVzIHRoZSBwcmVzZW5jZSBvZiBjaXJjdWxhciByZWZlcmVuY2VzIGJ5IGJhaWxpbmcgb3V0IHdoZW4gZW5jb3VudGVyaW5nIGFuXG4vLyBvYmplY3QgdGhhdCBpcyBhbHJlYWR5IG9uIHRoZSBcInN0YWNrXCIgb2YgaXRlbXMgYmVpbmcgcHJvY2Vzc2VkLiBBY2NlcHRzIGFuIG9wdGlvbmFsIHJlcGxhY2VyXG5leHBvcnQgZnVuY3Rpb24gY2Fub25pY2FsaXplKG9iaiwgc3RhY2ssIHJlcGxhY2VtZW50U3RhY2ssIHJlcGxhY2VyLCBrZXkpIHtcbiAgc3RhY2sgPSBzdGFjayB8fCBbXTtcbiAgcmVwbGFjZW1lbnRTdGFjayA9IHJlcGxhY2VtZW50U3RhY2sgfHwgW107XG5cbiAgaWYgKHJlcGxhY2VyKSB7XG4gICAgb2JqID0gcmVwbGFjZXIoa2V5LCBvYmopO1xuICB9XG5cbiAgbGV0IGk7XG5cbiAgZm9yIChpID0gMDsgaSA8IHN0YWNrLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgaWYgKHN0YWNrW2ldID09PSBvYmopIHtcbiAgICAgIHJldHVybiByZXBsYWNlbWVudFN0YWNrW2ldO1xuICAgIH1cbiAgfVxuXG4gIGxldCBjYW5vbmljYWxpemVkT2JqO1xuXG4gIGlmICgnW29iamVjdCBBcnJheV0nID09PSBvYmplY3RQcm90b3R5cGVUb1N0cmluZy5jYWxsKG9iaikpIHtcbiAgICBzdGFjay5wdXNoKG9iaik7XG4gICAgY2Fub25pY2FsaXplZE9iaiA9IG5ldyBBcnJheShvYmoubGVuZ3RoKTtcbiAgICByZXBsYWNlbWVudFN0YWNrLnB1c2goY2Fub25pY2FsaXplZE9iaik7XG4gICAgZm9yIChpID0gMDsgaSA8IG9iai5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgY2Fub25pY2FsaXplZE9ialtpXSA9IGNhbm9uaWNhbGl6ZShvYmpbaV0sIHN0YWNrLCByZXBsYWNlbWVudFN0YWNrLCByZXBsYWNlciwga2V5KTtcbiAgICB9XG4gICAgc3RhY2sucG9wKCk7XG4gICAgcmVwbGFjZW1lbnRTdGFjay5wb3AoKTtcbiAgICByZXR1cm4gY2Fub25pY2FsaXplZE9iajtcbiAgfVxuXG4gIGlmIChvYmogJiYgb2JqLnRvSlNPTikge1xuICAgIG9iaiA9IG9iai50b0pTT04oKTtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyAmJiBvYmogIT09IG51bGwpIHtcbiAgICBzdGFjay5wdXNoKG9iaik7XG4gICAgY2Fub25pY2FsaXplZE9iaiA9IHt9O1xuICAgIHJlcGxhY2VtZW50U3RhY2sucHVzaChjYW5vbmljYWxpemVkT2JqKTtcbiAgICBsZXQgc29ydGVkS2V5cyA9IFtdLFxuICAgICAgICBrZXk7XG4gICAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIHNvcnRlZEtleXMucHVzaChrZXkpO1xuICAgICAgfVxuICAgIH1cbiAgICBzb3J0ZWRLZXlzLnNvcnQoKTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgc29ydGVkS2V5cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAga2V5ID0gc29ydGVkS2V5c1tpXTtcbiAgICAgIGNhbm9uaWNhbGl6ZWRPYmpba2V5XSA9IGNhbm9uaWNhbGl6ZShvYmpba2V5XSwgc3RhY2ssIHJlcGxhY2VtZW50U3RhY2ssIHJlcGxhY2VyLCBrZXkpO1xuICAgIH1cbiAgICBzdGFjay5wb3AoKTtcbiAgICByZXBsYWNlbWVudFN0YWNrLnBvcCgpO1xuICB9IGVsc2Uge1xuICAgIGNhbm9uaWNhbGl6ZWRPYmogPSBvYmo7XG4gIH1cbiAgcmV0dXJuIGNhbm9uaWNhbGl6ZWRPYmo7XG59XG4iXX0=


/***/ }),

/***/ 1591:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

/*istanbul ignore start*/


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.diffLines = diffLines;
exports.diffTrimmedLines = diffTrimmedLines;
exports.lineDiff = void 0;

/*istanbul ignore end*/
var
/*istanbul ignore start*/
_base = _interopRequireDefault(__nccwpck_require__(1653))
/*istanbul ignore end*/
;

var
/*istanbul ignore start*/
_params = __nccwpck_require__(5704)
/*istanbul ignore end*/
;

/*istanbul ignore start*/ function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*istanbul ignore end*/
var lineDiff = new
/*istanbul ignore start*/
_base
/*istanbul ignore end*/
.
/*istanbul ignore start*/
default
/*istanbul ignore end*/
();

/*istanbul ignore start*/
exports.lineDiff = lineDiff;

/*istanbul ignore end*/
lineDiff.tokenize = function (value) {
  var retLines = [],
      linesAndNewlines = value.split(/(\n|\r\n)/); // Ignore the final empty token that occurs if the string ends with a new line

  if (!linesAndNewlines[linesAndNewlines.length - 1]) {
    linesAndNewlines.pop();
  } // Merge the content and line separators into single tokens


  for (var i = 0; i < linesAndNewlines.length; i++) {
    var line = linesAndNewlines[i];

    if (i % 2 && !this.options.newlineIsToken) {
      retLines[retLines.length - 1] += line;
    } else {
      if (this.options.ignoreWhitespace) {
        line = line.trim();
      }

      retLines.push(line);
    }
  }

  return retLines;
};

function diffLines(oldStr, newStr, callback) {
  return lineDiff.diff(oldStr, newStr, callback);
}

function diffTrimmedLines(oldStr, newStr, callback) {
  var options =
  /*istanbul ignore start*/
  (0,
  /*istanbul ignore end*/

  /*istanbul ignore start*/
  _params
  /*istanbul ignore end*/
  .
  /*istanbul ignore start*/
  generateOptions)
  /*istanbul ignore end*/
  (callback, {
    ignoreWhitespace: true
  });
  return lineDiff.diff(oldStr, newStr, options);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaWZmL2xpbmUuanMiXSwibmFtZXMiOlsibGluZURpZmYiLCJEaWZmIiwidG9rZW5pemUiLCJ2YWx1ZSIsInJldExpbmVzIiwibGluZXNBbmROZXdsaW5lcyIsInNwbGl0IiwibGVuZ3RoIiwicG9wIiwiaSIsImxpbmUiLCJvcHRpb25zIiwibmV3bGluZUlzVG9rZW4iLCJpZ25vcmVXaGl0ZXNwYWNlIiwidHJpbSIsInB1c2giLCJkaWZmTGluZXMiLCJvbGRTdHIiLCJuZXdTdHIiLCJjYWxsYmFjayIsImRpZmYiLCJkaWZmVHJpbW1lZExpbmVzIiwiZ2VuZXJhdGVPcHRpb25zIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7QUFFTyxJQUFNQSxRQUFRLEdBQUc7QUFBSUM7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQUE7QUFBSjtBQUFBLEVBQWpCOzs7Ozs7QUFDUEQsUUFBUSxDQUFDRSxRQUFULEdBQW9CLFVBQVNDLEtBQVQsRUFBZ0I7QUFDbEMsTUFBSUMsUUFBUSxHQUFHLEVBQWY7QUFBQSxNQUNJQyxnQkFBZ0IsR0FBR0YsS0FBSyxDQUFDRyxLQUFOLENBQVksV0FBWixDQUR2QixDQURrQyxDQUlsQzs7QUFDQSxNQUFJLENBQUNELGdCQUFnQixDQUFDQSxnQkFBZ0IsQ0FBQ0UsTUFBakIsR0FBMEIsQ0FBM0IsQ0FBckIsRUFBb0Q7QUFDbERGLElBQUFBLGdCQUFnQixDQUFDRyxHQUFqQjtBQUNELEdBUGlDLENBU2xDOzs7QUFDQSxPQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdKLGdCQUFnQixDQUFDRSxNQUFyQyxFQUE2Q0UsQ0FBQyxFQUE5QyxFQUFrRDtBQUNoRCxRQUFJQyxJQUFJLEdBQUdMLGdCQUFnQixDQUFDSSxDQUFELENBQTNCOztBQUVBLFFBQUlBLENBQUMsR0FBRyxDQUFKLElBQVMsQ0FBQyxLQUFLRSxPQUFMLENBQWFDLGNBQTNCLEVBQTJDO0FBQ3pDUixNQUFBQSxRQUFRLENBQUNBLFFBQVEsQ0FBQ0csTUFBVCxHQUFrQixDQUFuQixDQUFSLElBQWlDRyxJQUFqQztBQUNELEtBRkQsTUFFTztBQUNMLFVBQUksS0FBS0MsT0FBTCxDQUFhRSxnQkFBakIsRUFBbUM7QUFDakNILFFBQUFBLElBQUksR0FBR0EsSUFBSSxDQUFDSSxJQUFMLEVBQVA7QUFDRDs7QUFDRFYsTUFBQUEsUUFBUSxDQUFDVyxJQUFULENBQWNMLElBQWQ7QUFDRDtBQUNGOztBQUVELFNBQU9OLFFBQVA7QUFDRCxDQXhCRDs7QUEwQk8sU0FBU1ksU0FBVCxDQUFtQkMsTUFBbkIsRUFBMkJDLE1BQTNCLEVBQW1DQyxRQUFuQyxFQUE2QztBQUFFLFNBQU9uQixRQUFRLENBQUNvQixJQUFULENBQWNILE1BQWQsRUFBc0JDLE1BQXRCLEVBQThCQyxRQUE5QixDQUFQO0FBQWlEOztBQUNoRyxTQUFTRSxnQkFBVCxDQUEwQkosTUFBMUIsRUFBa0NDLE1BQWxDLEVBQTBDQyxRQUExQyxFQUFvRDtBQUN6RCxNQUFJUixPQUFPO0FBQUc7QUFBQTtBQUFBOztBQUFBVztBQUFBQTtBQUFBQTtBQUFBQTtBQUFBQTtBQUFBQTtBQUFBO0FBQUEsR0FBZ0JILFFBQWhCLEVBQTBCO0FBQUNOLElBQUFBLGdCQUFnQixFQUFFO0FBQW5CLEdBQTFCLENBQWQ7QUFDQSxTQUFPYixRQUFRLENBQUNvQixJQUFULENBQWNILE1BQWQsRUFBc0JDLE1BQXRCLEVBQThCUCxPQUE5QixDQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRGlmZiBmcm9tICcuL2Jhc2UnO1xuaW1wb3J0IHtnZW5lcmF0ZU9wdGlvbnN9IGZyb20gJy4uL3V0aWwvcGFyYW1zJztcblxuZXhwb3J0IGNvbnN0IGxpbmVEaWZmID0gbmV3IERpZmYoKTtcbmxpbmVEaWZmLnRva2VuaXplID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgbGV0IHJldExpbmVzID0gW10sXG4gICAgICBsaW5lc0FuZE5ld2xpbmVzID0gdmFsdWUuc3BsaXQoLyhcXG58XFxyXFxuKS8pO1xuXG4gIC8vIElnbm9yZSB0aGUgZmluYWwgZW1wdHkgdG9rZW4gdGhhdCBvY2N1cnMgaWYgdGhlIHN0cmluZyBlbmRzIHdpdGggYSBuZXcgbGluZVxuICBpZiAoIWxpbmVzQW5kTmV3bGluZXNbbGluZXNBbmROZXdsaW5lcy5sZW5ndGggLSAxXSkge1xuICAgIGxpbmVzQW5kTmV3bGluZXMucG9wKCk7XG4gIH1cblxuICAvLyBNZXJnZSB0aGUgY29udGVudCBhbmQgbGluZSBzZXBhcmF0b3JzIGludG8gc2luZ2xlIHRva2Vuc1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbmVzQW5kTmV3bGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICBsZXQgbGluZSA9IGxpbmVzQW5kTmV3bGluZXNbaV07XG5cbiAgICBpZiAoaSAlIDIgJiYgIXRoaXMub3B0aW9ucy5uZXdsaW5lSXNUb2tlbikge1xuICAgICAgcmV0TGluZXNbcmV0TGluZXMubGVuZ3RoIC0gMV0gKz0gbGluZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5pZ25vcmVXaGl0ZXNwYWNlKSB7XG4gICAgICAgIGxpbmUgPSBsaW5lLnRyaW0oKTtcbiAgICAgIH1cbiAgICAgIHJldExpbmVzLnB1c2gobGluZSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJldExpbmVzO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGRpZmZMaW5lcyhvbGRTdHIsIG5ld1N0ciwgY2FsbGJhY2spIHsgcmV0dXJuIGxpbmVEaWZmLmRpZmYob2xkU3RyLCBuZXdTdHIsIGNhbGxiYWNrKTsgfVxuZXhwb3J0IGZ1bmN0aW9uIGRpZmZUcmltbWVkTGluZXMob2xkU3RyLCBuZXdTdHIsIGNhbGxiYWNrKSB7XG4gIGxldCBvcHRpb25zID0gZ2VuZXJhdGVPcHRpb25zKGNhbGxiYWNrLCB7aWdub3JlV2hpdGVzcGFjZTogdHJ1ZX0pO1xuICByZXR1cm4gbGluZURpZmYuZGlmZihvbGRTdHIsIG5ld1N0ciwgb3B0aW9ucyk7XG59XG4iXX0=


/***/ }),

/***/ 3577:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

/*istanbul ignore start*/


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.diffSentences = diffSentences;
exports.sentenceDiff = void 0;

/*istanbul ignore end*/
var
/*istanbul ignore start*/
_base = _interopRequireDefault(__nccwpck_require__(1653))
/*istanbul ignore end*/
;

/*istanbul ignore start*/ function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*istanbul ignore end*/
var sentenceDiff = new
/*istanbul ignore start*/
_base
/*istanbul ignore end*/
.
/*istanbul ignore start*/
default
/*istanbul ignore end*/
();

/*istanbul ignore start*/
exports.sentenceDiff = sentenceDiff;

/*istanbul ignore end*/
sentenceDiff.tokenize = function (value) {
  return value.split(/(\S.+?[.!?])(?=\s+|$)/);
};

function diffSentences(oldStr, newStr, callback) {
  return sentenceDiff.diff(oldStr, newStr, callback);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaWZmL3NlbnRlbmNlLmpzIl0sIm5hbWVzIjpbInNlbnRlbmNlRGlmZiIsIkRpZmYiLCJ0b2tlbml6ZSIsInZhbHVlIiwic3BsaXQiLCJkaWZmU2VudGVuY2VzIiwib2xkU3RyIiwibmV3U3RyIiwiY2FsbGJhY2siLCJkaWZmIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7QUFHTyxJQUFNQSxZQUFZLEdBQUc7QUFBSUM7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQUE7QUFBSjtBQUFBLEVBQXJCOzs7Ozs7QUFDUEQsWUFBWSxDQUFDRSxRQUFiLEdBQXdCLFVBQVNDLEtBQVQsRUFBZ0I7QUFDdEMsU0FBT0EsS0FBSyxDQUFDQyxLQUFOLENBQVksdUJBQVosQ0FBUDtBQUNELENBRkQ7O0FBSU8sU0FBU0MsYUFBVCxDQUF1QkMsTUFBdkIsRUFBK0JDLE1BQS9CLEVBQXVDQyxRQUF2QyxFQUFpRDtBQUFFLFNBQU9SLFlBQVksQ0FBQ1MsSUFBYixDQUFrQkgsTUFBbEIsRUFBMEJDLE1BQTFCLEVBQWtDQyxRQUFsQyxDQUFQO0FBQXFEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERpZmYgZnJvbSAnLi9iYXNlJztcblxuXG5leHBvcnQgY29uc3Qgc2VudGVuY2VEaWZmID0gbmV3IERpZmYoKTtcbnNlbnRlbmNlRGlmZi50b2tlbml6ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZS5zcGxpdCgvKFxcUy4rP1suIT9dKSg/PVxccyt8JCkvKTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBkaWZmU2VudGVuY2VzKG9sZFN0ciwgbmV3U3RyLCBjYWxsYmFjaykgeyByZXR1cm4gc2VudGVuY2VEaWZmLmRpZmYob2xkU3RyLCBuZXdTdHIsIGNhbGxiYWNrKTsgfVxuIl19


/***/ }),

/***/ 6992:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

/*istanbul ignore start*/


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.diffWords = diffWords;
exports.diffWordsWithSpace = diffWordsWithSpace;
exports.wordDiff = void 0;

/*istanbul ignore end*/
var
/*istanbul ignore start*/
_base = _interopRequireDefault(__nccwpck_require__(1653))
/*istanbul ignore end*/
;

var
/*istanbul ignore start*/
_params = __nccwpck_require__(5704)
/*istanbul ignore end*/
;

/*istanbul ignore start*/ function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*istanbul ignore end*/
// Based on https://en.wikipedia.org/wiki/Latin_script_in_Unicode
//
// Ranges and exceptions:
// Latin-1 Supplement, 0080–00FF
//  - U+00D7  × Multiplication sign
//  - U+00F7  ÷ Division sign
// Latin Extended-A, 0100–017F
// Latin Extended-B, 0180–024F
// IPA Extensions, 0250–02AF
// Spacing Modifier Letters, 02B0–02FF
//  - U+02C7  ˇ &#711;  Caron
//  - U+02D8  ˘ &#728;  Breve
//  - U+02D9  ˙ &#729;  Dot Above
//  - U+02DA  ˚ &#730;  Ring Above
//  - U+02DB  ˛ &#731;  Ogonek
//  - U+02DC  ˜ &#732;  Small Tilde
//  - U+02DD  ˝ &#733;  Double Acute Accent
// Latin Extended Additional, 1E00–1EFF
var extendedWordChars = /^[A-Za-z\xC0-\u02C6\u02C8-\u02D7\u02DE-\u02FF\u1E00-\u1EFF]+$/;
var reWhitespace = /\S/;
var wordDiff = new
/*istanbul ignore start*/
_base
/*istanbul ignore end*/
.
/*istanbul ignore start*/
default
/*istanbul ignore end*/
();

/*istanbul ignore start*/
exports.wordDiff = wordDiff;

/*istanbul ignore end*/
wordDiff.equals = function (left, right) {
  if (this.options.ignoreCase) {
    left = left.toLowerCase();
    right = right.toLowerCase();
  }

  return left === right || this.options.ignoreWhitespace && !reWhitespace.test(left) && !reWhitespace.test(right);
};

wordDiff.tokenize = function (value) {
  var tokens = value.split(/(\s+|[()[\]{}'"]|\b)/); // Join the boundary splits that we do not consider to be boundaries. This is primarily the extended Latin character set.

  for (var i = 0; i < tokens.length - 1; i++) {
    // If we have an empty string in the next field and we have only word chars before and after, merge
    if (!tokens[i + 1] && tokens[i + 2] && extendedWordChars.test(tokens[i]) && extendedWordChars.test(tokens[i + 2])) {
      tokens[i] += tokens[i + 2];
      tokens.splice(i + 1, 2);
      i--;
    }
  }

  return tokens;
};

function diffWords(oldStr, newStr, options) {
  options =
  /*istanbul ignore start*/
  (0,
  /*istanbul ignore end*/

  /*istanbul ignore start*/
  _params
  /*istanbul ignore end*/
  .
  /*istanbul ignore start*/
  generateOptions)
  /*istanbul ignore end*/
  (options, {
    ignoreWhitespace: true
  });
  return wordDiff.diff(oldStr, newStr, options);
}

function diffWordsWithSpace(oldStr, newStr, options) {
  return wordDiff.diff(oldStr, newStr, options);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaWZmL3dvcmQuanMiXSwibmFtZXMiOlsiZXh0ZW5kZWRXb3JkQ2hhcnMiLCJyZVdoaXRlc3BhY2UiLCJ3b3JkRGlmZiIsIkRpZmYiLCJlcXVhbHMiLCJsZWZ0IiwicmlnaHQiLCJvcHRpb25zIiwiaWdub3JlQ2FzZSIsInRvTG93ZXJDYXNlIiwiaWdub3JlV2hpdGVzcGFjZSIsInRlc3QiLCJ0b2tlbml6ZSIsInZhbHVlIiwidG9rZW5zIiwic3BsaXQiLCJpIiwibGVuZ3RoIiwic3BsaWNlIiwiZGlmZldvcmRzIiwib2xkU3RyIiwibmV3U3RyIiwiZ2VuZXJhdGVPcHRpb25zIiwiZGlmZiIsImRpZmZXb3Jkc1dpdGhTcGFjZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7Ozs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTUEsaUJBQWlCLEdBQUcsK0RBQTFCO0FBRUEsSUFBTUMsWUFBWSxHQUFHLElBQXJCO0FBRU8sSUFBTUMsUUFBUSxHQUFHO0FBQUlDO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUo7QUFBQSxFQUFqQjs7Ozs7O0FBQ1BELFFBQVEsQ0FBQ0UsTUFBVCxHQUFrQixVQUFTQyxJQUFULEVBQWVDLEtBQWYsRUFBc0I7QUFDdEMsTUFBSSxLQUFLQyxPQUFMLENBQWFDLFVBQWpCLEVBQTZCO0FBQzNCSCxJQUFBQSxJQUFJLEdBQUdBLElBQUksQ0FBQ0ksV0FBTCxFQUFQO0FBQ0FILElBQUFBLEtBQUssR0FBR0EsS0FBSyxDQUFDRyxXQUFOLEVBQVI7QUFDRDs7QUFDRCxTQUFPSixJQUFJLEtBQUtDLEtBQVQsSUFBbUIsS0FBS0MsT0FBTCxDQUFhRyxnQkFBYixJQUFpQyxDQUFDVCxZQUFZLENBQUNVLElBQWIsQ0FBa0JOLElBQWxCLENBQWxDLElBQTZELENBQUNKLFlBQVksQ0FBQ1UsSUFBYixDQUFrQkwsS0FBbEIsQ0FBeEY7QUFDRCxDQU5EOztBQU9BSixRQUFRLENBQUNVLFFBQVQsR0FBb0IsVUFBU0MsS0FBVCxFQUFnQjtBQUNsQyxNQUFJQyxNQUFNLEdBQUdELEtBQUssQ0FBQ0UsS0FBTixDQUFZLHNCQUFaLENBQWIsQ0FEa0MsQ0FHbEM7O0FBQ0EsT0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHRixNQUFNLENBQUNHLE1BQVAsR0FBZ0IsQ0FBcEMsRUFBdUNELENBQUMsRUFBeEMsRUFBNEM7QUFDMUM7QUFDQSxRQUFJLENBQUNGLE1BQU0sQ0FBQ0UsQ0FBQyxHQUFHLENBQUwsQ0FBUCxJQUFrQkYsTUFBTSxDQUFDRSxDQUFDLEdBQUcsQ0FBTCxDQUF4QixJQUNLaEIsaUJBQWlCLENBQUNXLElBQWxCLENBQXVCRyxNQUFNLENBQUNFLENBQUQsQ0FBN0IsQ0FETCxJQUVLaEIsaUJBQWlCLENBQUNXLElBQWxCLENBQXVCRyxNQUFNLENBQUNFLENBQUMsR0FBRyxDQUFMLENBQTdCLENBRlQsRUFFZ0Q7QUFDOUNGLE1BQUFBLE1BQU0sQ0FBQ0UsQ0FBRCxDQUFOLElBQWFGLE1BQU0sQ0FBQ0UsQ0FBQyxHQUFHLENBQUwsQ0FBbkI7QUFDQUYsTUFBQUEsTUFBTSxDQUFDSSxNQUFQLENBQWNGLENBQUMsR0FBRyxDQUFsQixFQUFxQixDQUFyQjtBQUNBQSxNQUFBQSxDQUFDO0FBQ0Y7QUFDRjs7QUFFRCxTQUFPRixNQUFQO0FBQ0QsQ0FoQkQ7O0FBa0JPLFNBQVNLLFNBQVQsQ0FBbUJDLE1BQW5CLEVBQTJCQyxNQUEzQixFQUFtQ2QsT0FBbkMsRUFBNEM7QUFDakRBLEVBQUFBLE9BQU87QUFBRztBQUFBO0FBQUE7O0FBQUFlO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUE7QUFBQSxHQUFnQmYsT0FBaEIsRUFBeUI7QUFBQ0csSUFBQUEsZ0JBQWdCLEVBQUU7QUFBbkIsR0FBekIsQ0FBVjtBQUNBLFNBQU9SLFFBQVEsQ0FBQ3FCLElBQVQsQ0FBY0gsTUFBZCxFQUFzQkMsTUFBdEIsRUFBOEJkLE9BQTlCLENBQVA7QUFDRDs7QUFFTSxTQUFTaUIsa0JBQVQsQ0FBNEJKLE1BQTVCLEVBQW9DQyxNQUFwQyxFQUE0Q2QsT0FBNUMsRUFBcUQ7QUFDMUQsU0FBT0wsUUFBUSxDQUFDcUIsSUFBVCxDQUFjSCxNQUFkLEVBQXNCQyxNQUF0QixFQUE4QmQsT0FBOUIsQ0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERpZmYgZnJvbSAnLi9iYXNlJztcbmltcG9ydCB7Z2VuZXJhdGVPcHRpb25zfSBmcm9tICcuLi91dGlsL3BhcmFtcyc7XG5cbi8vIEJhc2VkIG9uIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0xhdGluX3NjcmlwdF9pbl9Vbmljb2RlXG4vL1xuLy8gUmFuZ2VzIGFuZCBleGNlcHRpb25zOlxuLy8gTGF0aW4tMSBTdXBwbGVtZW50LCAwMDgw4oCTMDBGRlxuLy8gIC0gVSswMEQ3ICDDlyBNdWx0aXBsaWNhdGlvbiBzaWduXG4vLyAgLSBVKzAwRjcgIMO3IERpdmlzaW9uIHNpZ25cbi8vIExhdGluIEV4dGVuZGVkLUEsIDAxMDDigJMwMTdGXG4vLyBMYXRpbiBFeHRlbmRlZC1CLCAwMTgw4oCTMDI0RlxuLy8gSVBBIEV4dGVuc2lvbnMsIDAyNTDigJMwMkFGXG4vLyBTcGFjaW5nIE1vZGlmaWVyIExldHRlcnMsIDAyQjDigJMwMkZGXG4vLyAgLSBVKzAyQzcgIMuHICYjNzExOyAgQ2Fyb25cbi8vICAtIFUrMDJEOCAgy5ggJiM3Mjg7ICBCcmV2ZVxuLy8gIC0gVSswMkQ5ICDLmSAmIzcyOTsgIERvdCBBYm92ZVxuLy8gIC0gVSswMkRBICDLmiAmIzczMDsgIFJpbmcgQWJvdmVcbi8vICAtIFUrMDJEQiAgy5sgJiM3MzE7ICBPZ29uZWtcbi8vICAtIFUrMDJEQyAgy5wgJiM3MzI7ICBTbWFsbCBUaWxkZVxuLy8gIC0gVSswMkREICDLnSAmIzczMzsgIERvdWJsZSBBY3V0ZSBBY2NlbnRcbi8vIExhdGluIEV4dGVuZGVkIEFkZGl0aW9uYWwsIDFFMDDigJMxRUZGXG5jb25zdCBleHRlbmRlZFdvcmRDaGFycyA9IC9eW2EtekEtWlxcdXtDMH0tXFx1e0ZGfVxcdXtEOH0tXFx1e0Y2fVxcdXtGOH0tXFx1ezJDNn1cXHV7MkM4fS1cXHV7MkQ3fVxcdXsyREV9LVxcdXsyRkZ9XFx1ezFFMDB9LVxcdXsxRUZGfV0rJC91O1xuXG5jb25zdCByZVdoaXRlc3BhY2UgPSAvXFxTLztcblxuZXhwb3J0IGNvbnN0IHdvcmREaWZmID0gbmV3IERpZmYoKTtcbndvcmREaWZmLmVxdWFscyA9IGZ1bmN0aW9uKGxlZnQsIHJpZ2h0KSB7XG4gIGlmICh0aGlzLm9wdGlvbnMuaWdub3JlQ2FzZSkge1xuICAgIGxlZnQgPSBsZWZ0LnRvTG93ZXJDYXNlKCk7XG4gICAgcmlnaHQgPSByaWdodC50b0xvd2VyQ2FzZSgpO1xuICB9XG4gIHJldHVybiBsZWZ0ID09PSByaWdodCB8fCAodGhpcy5vcHRpb25zLmlnbm9yZVdoaXRlc3BhY2UgJiYgIXJlV2hpdGVzcGFjZS50ZXN0KGxlZnQpICYmICFyZVdoaXRlc3BhY2UudGVzdChyaWdodCkpO1xufTtcbndvcmREaWZmLnRva2VuaXplID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgbGV0IHRva2VucyA9IHZhbHVlLnNwbGl0KC8oXFxzK3xbKClbXFxde30nXCJdfFxcYikvKTtcblxuICAvLyBKb2luIHRoZSBib3VuZGFyeSBzcGxpdHMgdGhhdCB3ZSBkbyBub3QgY29uc2lkZXIgdG8gYmUgYm91bmRhcmllcy4gVGhpcyBpcyBwcmltYXJpbHkgdGhlIGV4dGVuZGVkIExhdGluIGNoYXJhY3RlciBzZXQuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdG9rZW5zLmxlbmd0aCAtIDE7IGkrKykge1xuICAgIC8vIElmIHdlIGhhdmUgYW4gZW1wdHkgc3RyaW5nIGluIHRoZSBuZXh0IGZpZWxkIGFuZCB3ZSBoYXZlIG9ubHkgd29yZCBjaGFycyBiZWZvcmUgYW5kIGFmdGVyLCBtZXJnZVxuICAgIGlmICghdG9rZW5zW2kgKyAxXSAmJiB0b2tlbnNbaSArIDJdXG4gICAgICAgICAgJiYgZXh0ZW5kZWRXb3JkQ2hhcnMudGVzdCh0b2tlbnNbaV0pXG4gICAgICAgICAgJiYgZXh0ZW5kZWRXb3JkQ2hhcnMudGVzdCh0b2tlbnNbaSArIDJdKSkge1xuICAgICAgdG9rZW5zW2ldICs9IHRva2Vuc1tpICsgMl07XG4gICAgICB0b2tlbnMuc3BsaWNlKGkgKyAxLCAyKTtcbiAgICAgIGktLTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdG9rZW5zO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGRpZmZXb3JkcyhvbGRTdHIsIG5ld1N0ciwgb3B0aW9ucykge1xuICBvcHRpb25zID0gZ2VuZXJhdGVPcHRpb25zKG9wdGlvbnMsIHtpZ25vcmVXaGl0ZXNwYWNlOiB0cnVlfSk7XG4gIHJldHVybiB3b3JkRGlmZi5kaWZmKG9sZFN0ciwgbmV3U3RyLCBvcHRpb25zKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRpZmZXb3Jkc1dpdGhTcGFjZShvbGRTdHIsIG5ld1N0ciwgb3B0aW9ucykge1xuICByZXR1cm4gd29yZERpZmYuZGlmZihvbGRTdHIsIG5ld1N0ciwgb3B0aW9ucyk7XG59XG4iXX0=


/***/ }),

/***/ 1672:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

/*istanbul ignore start*/


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "Diff", ({
  enumerable: true,
  get: function get() {
    return _base.default;
  }
}));
Object.defineProperty(exports, "diffChars", ({
  enumerable: true,
  get: function get() {
    return _character.diffChars;
  }
}));
Object.defineProperty(exports, "diffWords", ({
  enumerable: true,
  get: function get() {
    return _word.diffWords;
  }
}));
Object.defineProperty(exports, "diffWordsWithSpace", ({
  enumerable: true,
  get: function get() {
    return _word.diffWordsWithSpace;
  }
}));
Object.defineProperty(exports, "diffLines", ({
  enumerable: true,
  get: function get() {
    return _line.diffLines;
  }
}));
Object.defineProperty(exports, "diffTrimmedLines", ({
  enumerable: true,
  get: function get() {
    return _line.diffTrimmedLines;
  }
}));
Object.defineProperty(exports, "diffSentences", ({
  enumerable: true,
  get: function get() {
    return _sentence.diffSentences;
  }
}));
Object.defineProperty(exports, "diffCss", ({
  enumerable: true,
  get: function get() {
    return _css.diffCss;
  }
}));
Object.defineProperty(exports, "diffJson", ({
  enumerable: true,
  get: function get() {
    return _json.diffJson;
  }
}));
Object.defineProperty(exports, "canonicalize", ({
  enumerable: true,
  get: function get() {
    return _json.canonicalize;
  }
}));
Object.defineProperty(exports, "diffArrays", ({
  enumerable: true,
  get: function get() {
    return _array.diffArrays;
  }
}));
Object.defineProperty(exports, "applyPatch", ({
  enumerable: true,
  get: function get() {
    return _apply.applyPatch;
  }
}));
Object.defineProperty(exports, "applyPatches", ({
  enumerable: true,
  get: function get() {
    return _apply.applyPatches;
  }
}));
Object.defineProperty(exports, "parsePatch", ({
  enumerable: true,
  get: function get() {
    return _parse.parsePatch;
  }
}));
Object.defineProperty(exports, "merge", ({
  enumerable: true,
  get: function get() {
    return _merge.merge;
  }
}));
Object.defineProperty(exports, "structuredPatch", ({
  enumerable: true,
  get: function get() {
    return _create.structuredPatch;
  }
}));
Object.defineProperty(exports, "createTwoFilesPatch", ({
  enumerable: true,
  get: function get() {
    return _create.createTwoFilesPatch;
  }
}));
Object.defineProperty(exports, "createPatch", ({
  enumerable: true,
  get: function get() {
    return _create.createPatch;
  }
}));
Object.defineProperty(exports, "convertChangesToDMP", ({
  enumerable: true,
  get: function get() {
    return _dmp.convertChangesToDMP;
  }
}));
Object.defineProperty(exports, "convertChangesToXML", ({
  enumerable: true,
  get: function get() {
    return _xml.convertChangesToXML;
  }
}));

/*istanbul ignore end*/
var
/*istanbul ignore start*/
_base = _interopRequireDefault(__nccwpck_require__(1653))
/*istanbul ignore end*/
;

var
/*istanbul ignore start*/
_character = __nccwpck_require__(2081)
/*istanbul ignore end*/
;

var
/*istanbul ignore start*/
_word = __nccwpck_require__(6992)
/*istanbul ignore end*/
;

var
/*istanbul ignore start*/
_line = __nccwpck_require__(1591)
/*istanbul ignore end*/
;

var
/*istanbul ignore start*/
_sentence = __nccwpck_require__(3577)
/*istanbul ignore end*/
;

var
/*istanbul ignore start*/
_css = __nccwpck_require__(8941)
/*istanbul ignore end*/
;

var
/*istanbul ignore start*/
_json = __nccwpck_require__(6335)
/*istanbul ignore end*/
;

var
/*istanbul ignore start*/
_array = __nccwpck_require__(546)
/*istanbul ignore end*/
;

var
/*istanbul ignore start*/
_apply = __nccwpck_require__(7429)
/*istanbul ignore end*/
;

var
/*istanbul ignore start*/
_parse = __nccwpck_require__(5870)
/*istanbul ignore end*/
;

var
/*istanbul ignore start*/
_merge = __nccwpck_require__(2640)
/*istanbul ignore end*/
;

var
/*istanbul ignore start*/
_create = __nccwpck_require__(4543)
/*istanbul ignore end*/
;

var
/*istanbul ignore start*/
_dmp = __nccwpck_require__(2859)
/*istanbul ignore end*/
;

var
/*istanbul ignore start*/
_xml = __nccwpck_require__(6982)
/*istanbul ignore end*/
;

/*istanbul ignore start*/ function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*istanbul ignore end*/
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWdCQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBRUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUVBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBRUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFFQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBTZWUgTElDRU5TRSBmaWxlIGZvciB0ZXJtcyBvZiB1c2UgKi9cblxuLypcbiAqIFRleHQgZGlmZiBpbXBsZW1lbnRhdGlvbi5cbiAqXG4gKiBUaGlzIGxpYnJhcnkgc3VwcG9ydHMgdGhlIGZvbGxvd2luZyBBUElTOlxuICogSnNEaWZmLmRpZmZDaGFyczogQ2hhcmFjdGVyIGJ5IGNoYXJhY3RlciBkaWZmXG4gKiBKc0RpZmYuZGlmZldvcmRzOiBXb3JkIChhcyBkZWZpbmVkIGJ5IFxcYiByZWdleCkgZGlmZiB3aGljaCBpZ25vcmVzIHdoaXRlc3BhY2VcbiAqIEpzRGlmZi5kaWZmTGluZXM6IExpbmUgYmFzZWQgZGlmZlxuICpcbiAqIEpzRGlmZi5kaWZmQ3NzOiBEaWZmIHRhcmdldGVkIGF0IENTUyBjb250ZW50XG4gKlxuICogVGhlc2UgbWV0aG9kcyBhcmUgYmFzZWQgb24gdGhlIGltcGxlbWVudGF0aW9uIHByb3Bvc2VkIGluXG4gKiBcIkFuIE8oTkQpIERpZmZlcmVuY2UgQWxnb3JpdGhtIGFuZCBpdHMgVmFyaWF0aW9uc1wiIChNeWVycywgMTk4NikuXG4gKiBodHRwOi8vY2l0ZXNlZXJ4LmlzdC5wc3UuZWR1L3ZpZXdkb2Mvc3VtbWFyeT9kb2k9MTAuMS4xLjQuNjkyN1xuICovXG5pbXBvcnQgRGlmZiBmcm9tICcuL2RpZmYvYmFzZSc7XG5pbXBvcnQge2RpZmZDaGFyc30gZnJvbSAnLi9kaWZmL2NoYXJhY3Rlcic7XG5pbXBvcnQge2RpZmZXb3JkcywgZGlmZldvcmRzV2l0aFNwYWNlfSBmcm9tICcuL2RpZmYvd29yZCc7XG5pbXBvcnQge2RpZmZMaW5lcywgZGlmZlRyaW1tZWRMaW5lc30gZnJvbSAnLi9kaWZmL2xpbmUnO1xuaW1wb3J0IHtkaWZmU2VudGVuY2VzfSBmcm9tICcuL2RpZmYvc2VudGVuY2UnO1xuXG5pbXBvcnQge2RpZmZDc3N9IGZyb20gJy4vZGlmZi9jc3MnO1xuaW1wb3J0IHtkaWZmSnNvbiwgY2Fub25pY2FsaXplfSBmcm9tICcuL2RpZmYvanNvbic7XG5cbmltcG9ydCB7ZGlmZkFycmF5c30gZnJvbSAnLi9kaWZmL2FycmF5JztcblxuaW1wb3J0IHthcHBseVBhdGNoLCBhcHBseVBhdGNoZXN9IGZyb20gJy4vcGF0Y2gvYXBwbHknO1xuaW1wb3J0IHtwYXJzZVBhdGNofSBmcm9tICcuL3BhdGNoL3BhcnNlJztcbmltcG9ydCB7bWVyZ2V9IGZyb20gJy4vcGF0Y2gvbWVyZ2UnO1xuaW1wb3J0IHtzdHJ1Y3R1cmVkUGF0Y2gsIGNyZWF0ZVR3b0ZpbGVzUGF0Y2gsIGNyZWF0ZVBhdGNofSBmcm9tICcuL3BhdGNoL2NyZWF0ZSc7XG5cbmltcG9ydCB7Y29udmVydENoYW5nZXNUb0RNUH0gZnJvbSAnLi9jb252ZXJ0L2RtcCc7XG5pbXBvcnQge2NvbnZlcnRDaGFuZ2VzVG9YTUx9IGZyb20gJy4vY29udmVydC94bWwnO1xuXG5leHBvcnQge1xuICBEaWZmLFxuXG4gIGRpZmZDaGFycyxcbiAgZGlmZldvcmRzLFxuICBkaWZmV29yZHNXaXRoU3BhY2UsXG4gIGRpZmZMaW5lcyxcbiAgZGlmZlRyaW1tZWRMaW5lcyxcbiAgZGlmZlNlbnRlbmNlcyxcblxuICBkaWZmQ3NzLFxuICBkaWZmSnNvbixcblxuICBkaWZmQXJyYXlzLFxuXG4gIHN0cnVjdHVyZWRQYXRjaCxcbiAgY3JlYXRlVHdvRmlsZXNQYXRjaCxcbiAgY3JlYXRlUGF0Y2gsXG4gIGFwcGx5UGF0Y2gsXG4gIGFwcGx5UGF0Y2hlcyxcbiAgcGFyc2VQYXRjaCxcbiAgbWVyZ2UsXG4gIGNvbnZlcnRDaGFuZ2VzVG9ETVAsXG4gIGNvbnZlcnRDaGFuZ2VzVG9YTUwsXG4gIGNhbm9uaWNhbGl6ZVxufTtcbiJdfQ==


/***/ }),

/***/ 7429:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

/*istanbul ignore start*/


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.applyPatch = applyPatch;
exports.applyPatches = applyPatches;

/*istanbul ignore end*/
var
/*istanbul ignore start*/
_parse = __nccwpck_require__(5870)
/*istanbul ignore end*/
;

var
/*istanbul ignore start*/
_distanceIterator = _interopRequireDefault(__nccwpck_require__(5512))
/*istanbul ignore end*/
;

/*istanbul ignore start*/ function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*istanbul ignore end*/
function applyPatch(source, uniDiff) {
  /*istanbul ignore start*/
  var
  /*istanbul ignore end*/
  options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (typeof uniDiff === 'string') {
    uniDiff =
    /*istanbul ignore start*/
    (0,
    /*istanbul ignore end*/

    /*istanbul ignore start*/
    _parse
    /*istanbul ignore end*/
    .
    /*istanbul ignore start*/
    parsePatch)
    /*istanbul ignore end*/
    (uniDiff);
  }

  if (Array.isArray(uniDiff)) {
    if (uniDiff.length > 1) {
      throw new Error('applyPatch only works with a single input.');
    }

    uniDiff = uniDiff[0];
  } // Apply the diff to the input


  var lines = source.split(/\r\n|[\n\v\f\r\x85]/),
      delimiters = source.match(/\r\n|[\n\v\f\r\x85]/g) || [],
      hunks = uniDiff.hunks,
      compareLine = options.compareLine || function (lineNumber, line, operation, patchContent)
  /*istanbul ignore start*/
  {
    return (
      /*istanbul ignore end*/
      line === patchContent
    );
  },
      errorCount = 0,
      fuzzFactor = options.fuzzFactor || 0,
      minLine = 0,
      offset = 0,
      removeEOFNL,
      addEOFNL;
  /**
   * Checks if the hunk exactly fits on the provided location
   */


  function hunkFits(hunk, toPos) {
    for (var j = 0; j < hunk.lines.length; j++) {
      var line = hunk.lines[j],
          operation = line.length > 0 ? line[0] : ' ',
          content = line.length > 0 ? line.substr(1) : line;

      if (operation === ' ' || operation === '-') {
        // Context sanity check
        if (!compareLine(toPos + 1, lines[toPos], operation, content)) {
          errorCount++;

          if (errorCount > fuzzFactor) {
            return false;
          }
        }

        toPos++;
      }
    }

    return true;
  } // Search best fit offsets for each hunk based on the previous ones


  for (var i = 0; i < hunks.length; i++) {
    var hunk = hunks[i],
        maxLine = lines.length - hunk.oldLines,
        localOffset = 0,
        toPos = offset + hunk.oldStart - 1;
    var iterator =
    /*istanbul ignore start*/
    (0,
    /*istanbul ignore end*/

    /*istanbul ignore start*/
    _distanceIterator
    /*istanbul ignore end*/
    .
    /*istanbul ignore start*/
    default)
    /*istanbul ignore end*/
    (toPos, minLine, maxLine);

    for (; localOffset !== undefined; localOffset = iterator()) {
      if (hunkFits(hunk, toPos + localOffset)) {
        hunk.offset = offset += localOffset;
        break;
      }
    }

    if (localOffset === undefined) {
      return false;
    } // Set lower text limit to end of the current hunk, so next ones don't try
    // to fit over already patched text


    minLine = hunk.offset + hunk.oldStart + hunk.oldLines;
  } // Apply patch hunks


  var diffOffset = 0;

  for (var _i = 0; _i < hunks.length; _i++) {
    var _hunk = hunks[_i],
        _toPos = _hunk.oldStart + _hunk.offset + diffOffset - 1;

    diffOffset += _hunk.newLines - _hunk.oldLines;

    if (_toPos < 0) {
      // Creating a new file
      _toPos = 0;
    }

    for (var j = 0; j < _hunk.lines.length; j++) {
      var line = _hunk.lines[j],
          operation = line.length > 0 ? line[0] : ' ',
          content = line.length > 0 ? line.substr(1) : line,
          delimiter = _hunk.linedelimiters[j];

      if (operation === ' ') {
        _toPos++;
      } else if (operation === '-') {
        lines.splice(_toPos, 1);
        delimiters.splice(_toPos, 1);
        /* istanbul ignore else */
      } else if (operation === '+') {
        lines.splice(_toPos, 0, content);
        delimiters.splice(_toPos, 0, delimiter);
        _toPos++;
      } else if (operation === '\\') {
        var previousOperation = _hunk.lines[j - 1] ? _hunk.lines[j - 1][0] : null;

        if (previousOperation === '+') {
          removeEOFNL = true;
        } else if (previousOperation === '-') {
          addEOFNL = true;
        }
      }
    }
  } // Handle EOFNL insertion/removal


  if (removeEOFNL) {
    while (!lines[lines.length - 1]) {
      lines.pop();
      delimiters.pop();
    }
  } else if (addEOFNL) {
    lines.push('');
    delimiters.push('\n');
  }

  for (var _k = 0; _k < lines.length - 1; _k++) {
    lines[_k] = lines[_k] + delimiters[_k];
  }

  return lines.join('');
} // Wrapper that supports multiple file patches via callbacks.


function applyPatches(uniDiff, options) {
  if (typeof uniDiff === 'string') {
    uniDiff =
    /*istanbul ignore start*/
    (0,
    /*istanbul ignore end*/

    /*istanbul ignore start*/
    _parse
    /*istanbul ignore end*/
    .
    /*istanbul ignore start*/
    parsePatch)
    /*istanbul ignore end*/
    (uniDiff);
  }

  var currentIndex = 0;

  function processIndex() {
    var index = uniDiff[currentIndex++];

    if (!index) {
      return options.complete();
    }

    options.loadFile(index, function (err, data) {
      if (err) {
        return options.complete(err);
      }

      var updatedContent = applyPatch(data, index, options);
      options.patched(index, updatedContent, function (err) {
        if (err) {
          return options.complete(err);
        }

        processIndex();
      });
    });
  }

  processIndex();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wYXRjaC9hcHBseS5qcyJdLCJuYW1lcyI6WyJhcHBseVBhdGNoIiwic291cmNlIiwidW5pRGlmZiIsIm9wdGlvbnMiLCJwYXJzZVBhdGNoIiwiQXJyYXkiLCJpc0FycmF5IiwibGVuZ3RoIiwiRXJyb3IiLCJsaW5lcyIsInNwbGl0IiwiZGVsaW1pdGVycyIsIm1hdGNoIiwiaHVua3MiLCJjb21wYXJlTGluZSIsImxpbmVOdW1iZXIiLCJsaW5lIiwib3BlcmF0aW9uIiwicGF0Y2hDb250ZW50IiwiZXJyb3JDb3VudCIsImZ1enpGYWN0b3IiLCJtaW5MaW5lIiwib2Zmc2V0IiwicmVtb3ZlRU9GTkwiLCJhZGRFT0ZOTCIsImh1bmtGaXRzIiwiaHVuayIsInRvUG9zIiwiaiIsImNvbnRlbnQiLCJzdWJzdHIiLCJpIiwibWF4TGluZSIsIm9sZExpbmVzIiwibG9jYWxPZmZzZXQiLCJvbGRTdGFydCIsIml0ZXJhdG9yIiwiZGlzdGFuY2VJdGVyYXRvciIsInVuZGVmaW5lZCIsImRpZmZPZmZzZXQiLCJuZXdMaW5lcyIsImRlbGltaXRlciIsImxpbmVkZWxpbWl0ZXJzIiwic3BsaWNlIiwicHJldmlvdXNPcGVyYXRpb24iLCJwb3AiLCJwdXNoIiwiX2siLCJqb2luIiwiYXBwbHlQYXRjaGVzIiwiY3VycmVudEluZGV4IiwicHJvY2Vzc0luZGV4IiwiaW5kZXgiLCJjb21wbGV0ZSIsImxvYWRGaWxlIiwiZXJyIiwiZGF0YSIsInVwZGF0ZWRDb250ZW50IiwicGF0Y2hlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7QUFFTyxTQUFTQSxVQUFULENBQW9CQyxNQUFwQixFQUE0QkMsT0FBNUIsRUFBbUQ7QUFBQTtBQUFBO0FBQUE7QUFBZEMsRUFBQUEsT0FBYyx1RUFBSixFQUFJOztBQUN4RCxNQUFJLE9BQU9ELE9BQVAsS0FBbUIsUUFBdkIsRUFBaUM7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QUE7O0FBQUFFO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUE7QUFBQSxLQUFXRixPQUFYLENBQVY7QUFDRDs7QUFFRCxNQUFJZ0QsWUFBWSxHQUFHLENBQW5COztBQUNBLFdBQVNDLFlBQVQsR0FBd0I7QUFDdEIsUUFBSUMsS0FBSyxHQUFHbEQsT0FBTyxDQUFDZ0QsWUFBWSxFQUFiLENBQW5COztBQUNBLFFBQUksQ0FBQ0UsS0FBTCxFQUFZO0FBQ1YsYUFBT2pELE9BQU8sQ0FBQ2tELFFBQVIsRUFBUDtBQUNEOztBQUVEbEQsSUFBQUEsT0FBTyxDQUFDbUQsUUFBUixDQUFpQkYsS0FBakIsRUFBd0IsVUFBU0csR0FBVCxFQUFjQyxJQUFkLEVBQW9CO0FBQzFDLFVBQUlELEdBQUosRUFBUztBQUNQLGVBQU9wRCxPQUFPLENBQUNrRCxRQUFSLENBQWlCRSxHQUFqQixDQUFQO0FBQ0Q7O0FBRUQsVUFBSUUsY0FBYyxHQUFHekQsVUFBVSxDQUFDd0QsSUFBRCxFQUFPSixLQUFQLEVBQWNqRCxPQUFkLENBQS9CO0FBQ0FBLE1BQUFBLE9BQU8sQ0FBQ3VELE9BQVIsQ0FBZ0JOLEtBQWhCLEVBQXVCSyxjQUF2QixFQUF1QyxVQUFTRixHQUFULEVBQWM7QUFDbkQsWUFBSUEsR0FBSixFQUFTO0FBQ1AsaUJBQU9wRCxPQUFPLENBQUNrRCxRQUFSLENBQWlCRSxHQUFqQixDQUFQO0FBQ0Q7O0FBRURKLFFBQUFBLFlBQVk7QUFDYixPQU5EO0FBT0QsS0FiRDtBQWNEOztBQUNEQSxFQUFBQSxZQUFZO0FBQ2IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge3BhcnNlUGF0Y2h9IGZyb20gJy4vcGFyc2UnO1xuaW1wb3J0IGRpc3RhbmNlSXRlcmF0b3IgZnJvbSAnLi4vdXRpbC9kaXN0YW5jZS1pdGVyYXRvcic7XG5cbmV4cG9ydCBmdW5jdGlvbiBhcHBseVBhdGNoKHNvdXJjZSwgdW5pRGlmZiwgb3B0aW9ucyA9IHt9KSB7XG4gIGlmICh0eXBlb2YgdW5pRGlmZiA9PT0gJ3N0cmluZycpIHtcbiAgICB1bmlEaWZmID0gcGFyc2VQYXRjaCh1bmlEaWZmKTtcbiAgfVxuXG4gIGlmIChBcnJheS5pc0FycmF5KHVuaURpZmYpKSB7XG4gICAgaWYgKHVuaURpZmYubGVuZ3RoID4gMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdhcHBseVBhdGNoIG9ubHkgd29ya3Mgd2l0aCBhIHNpbmdsZSBpbnB1dC4nKTtcbiAgICB9XG5cbiAgICB1bmlEaWZmID0gdW5pRGlmZlswXTtcbiAgfVxuXG4gIC8vIEFwcGx5IHRoZSBkaWZmIHRvIHRoZSBpbnB1dFxuICBsZXQgbGluZXMgPSBzb3VyY2Uuc3BsaXQoL1xcclxcbnxbXFxuXFx2XFxmXFxyXFx4ODVdLyksXG4gICAgICBkZWxpbWl0ZXJzID0gc291cmNlLm1hdGNoKC9cXHJcXG58W1xcblxcdlxcZlxcclxceDg1XS9nKSB8fCBbXSxcbiAgICAgIGh1bmtzID0gdW5pRGlmZi5odW5rcyxcblxuICAgICAgY29tcGFyZUxpbmUgPSBvcHRpb25zLmNvbXBhcmVMaW5lIHx8ICgobGluZU51bWJlciwgbGluZSwgb3BlcmF0aW9uLCBwYXRjaENvbnRlbnQpID0+IGxpbmUgPT09IHBhdGNoQ29udGVudCksXG4gICAgICBlcnJvckNvdW50ID0gMCxcbiAgICAgIGZ1enpGYWN0b3IgPSBvcHRpb25zLmZ1enpGYWN0b3IgfHwgMCxcbiAgICAgIG1pbkxpbmUgPSAwLFxuICAgICAgb2Zmc2V0ID0gMCxcblxuICAgICAgcmVtb3ZlRU9GTkwsXG4gICAgICBhZGRFT0ZOTDtcblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBodW5rIGV4YWN0bHkgZml0cyBvbiB0aGUgcHJvdmlkZWQgbG9jYXRpb25cbiAgICovXG4gIGZ1bmN0aW9uIGh1bmtGaXRzKGh1bmssIHRvUG9zKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBodW5rLmxpbmVzLmxlbmd0aDsgaisrKSB7XG4gICAgICBsZXQgbGluZSA9IGh1bmsubGluZXNbal0sXG4gICAgICAgICAgb3BlcmF0aW9uID0gKGxpbmUubGVuZ3RoID4gMCA/IGxpbmVbMF0gOiAnICcpLFxuICAgICAgICAgIGNvbnRlbnQgPSAobGluZS5sZW5ndGggPiAwID8gbGluZS5zdWJzdHIoMSkgOiBsaW5lKTtcblxuICAgICAgaWYgKG9wZXJhdGlvbiA9PT0gJyAnIHx8IG9wZXJhdGlvbiA9PT0gJy0nKSB7XG4gICAgICAgIC8vIENvbnRleHQgc2FuaXR5IGNoZWNrXG4gICAgICAgIGlmICghY29tcGFyZUxpbmUodG9Qb3MgKyAxLCBsaW5lc1t0b1Bvc10sIG9wZXJhdGlvbiwgY29udGVudCkpIHtcbiAgICAgICAgICBlcnJvckNvdW50Kys7XG5cbiAgICAgICAgICBpZiAoZXJyb3JDb3VudCA+IGZ1enpGYWN0b3IpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdG9Qb3MrKztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIFNlYXJjaCBiZXN0IGZpdCBvZmZzZXRzIGZvciBlYWNoIGh1bmsgYmFzZWQgb24gdGhlIHByZXZpb3VzIG9uZXNcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBodW5rcy5sZW5ndGg7IGkrKykge1xuICAgIGxldCBodW5rID0gaHVua3NbaV0sXG4gICAgICAgIG1heExpbmUgPSBsaW5lcy5sZW5ndGggLSBodW5rLm9sZExpbmVzLFxuICAgICAgICBsb2NhbE9mZnNldCA9IDAsXG4gICAgICAgIHRvUG9zID0gb2Zmc2V0ICsgaHVuay5vbGRTdGFydCAtIDE7XG5cbiAgICBsZXQgaXRlcmF0b3IgPSBkaXN0YW5jZUl0ZXJhdG9yKHRvUG9zLCBtaW5MaW5lLCBtYXhMaW5lKTtcblxuICAgIGZvciAoOyBsb2NhbE9mZnNldCAhPT0gdW5kZWZpbmVkOyBsb2NhbE9mZnNldCA9IGl0ZXJhdG9yKCkpIHtcbiAgICAgIGlmIChodW5rRml0cyhodW5rLCB0b1BvcyArIGxvY2FsT2Zmc2V0KSkge1xuICAgICAgICBodW5rLm9mZnNldCA9IG9mZnNldCArPSBsb2NhbE9mZnNldDtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGxvY2FsT2Zmc2V0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBTZXQgbG93ZXIgdGV4dCBsaW1pdCB0byBlbmQgb2YgdGhlIGN1cnJlbnQgaHVuaywgc28gbmV4dCBvbmVzIGRvbid0IHRyeVxuICAgIC8vIHRvIGZpdCBvdmVyIGFscmVhZHkgcGF0Y2hlZCB0ZXh0XG4gICAgbWluTGluZSA9IGh1bmsub2Zmc2V0ICsgaHVuay5vbGRTdGFydCArIGh1bmsub2xkTGluZXM7XG4gIH1cblxuICAvLyBBcHBseSBwYXRjaCBodW5rc1xuICBsZXQgZGlmZk9mZnNldCA9IDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgaHVua3MubGVuZ3RoOyBpKyspIHtcbiAgICBsZXQgaHVuayA9IGh1bmtzW2ldLFxuICAgICAgICB0b1BvcyA9IGh1bmsub2xkU3RhcnQgKyBodW5rLm9mZnNldCArIGRpZmZPZmZzZXQgLSAxO1xuICAgIGRpZmZPZmZzZXQgKz0gaHVuay5uZXdMaW5lcyAtIGh1bmsub2xkTGluZXM7XG5cbiAgICBpZiAodG9Qb3MgPCAwKSB7IC8vIENyZWF0aW5nIGEgbmV3IGZpbGVcbiAgICAgIHRvUG9zID0gMDtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGh1bmsubGluZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgIGxldCBsaW5lID0gaHVuay5saW5lc1tqXSxcbiAgICAgICAgICBvcGVyYXRpb24gPSAobGluZS5sZW5ndGggPiAwID8gbGluZVswXSA6ICcgJyksXG4gICAgICAgICAgY29udGVudCA9IChsaW5lLmxlbmd0aCA+IDAgPyBsaW5lLnN1YnN0cigxKSA6IGxpbmUpLFxuICAgICAgICAgIGRlbGltaXRlciA9IGh1bmsubGluZWRlbGltaXRlcnNbal07XG5cbiAgICAgIGlmIChvcGVyYXRpb24gPT09ICcgJykge1xuICAgICAgICB0b1BvcysrO1xuICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09ICctJykge1xuICAgICAgICBsaW5lcy5zcGxpY2UodG9Qb3MsIDEpO1xuICAgICAgICBkZWxpbWl0ZXJzLnNwbGljZSh0b1BvcywgMSk7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09ICcrJykge1xuICAgICAgICBsaW5lcy5zcGxpY2UodG9Qb3MsIDAsIGNvbnRlbnQpO1xuICAgICAgICBkZWxpbWl0ZXJzLnNwbGljZSh0b1BvcywgMCwgZGVsaW1pdGVyKTtcbiAgICAgICAgdG9Qb3MrKztcbiAgICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSAnXFxcXCcpIHtcbiAgICAgICAgbGV0IHByZXZpb3VzT3BlcmF0aW9uID0gaHVuay5saW5lc1tqIC0gMV0gPyBodW5rLmxpbmVzW2ogLSAxXVswXSA6IG51bGw7XG4gICAgICAgIGlmIChwcmV2aW91c09wZXJhdGlvbiA9PT0gJysnKSB7XG4gICAgICAgICAgcmVtb3ZlRU9GTkwgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKHByZXZpb3VzT3BlcmF0aW9uID09PSAnLScpIHtcbiAgICAgICAgICBhZGRFT0ZOTCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBIYW5kbGUgRU9GTkwgaW5zZXJ0aW9uL3JlbW92YWxcbiAgaWYgKHJlbW92ZUVPRk5MKSB7XG4gICAgd2hpbGUgKCFsaW5lc1tsaW5lcy5sZW5ndGggLSAxXSkge1xuICAgICAgbGluZXMucG9wKCk7XG4gICAgICBkZWxpbWl0ZXJzLnBvcCgpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChhZGRFT0ZOTCkge1xuICAgIGxpbmVzLnB1c2goJycpO1xuICAgIGRlbGltaXRlcnMucHVzaCgnXFxuJyk7XG4gIH1cbiAgZm9yIChsZXQgX2sgPSAwOyBfayA8IGxpbmVzLmxlbmd0aCAtIDE7IF9rKyspIHtcbiAgICBsaW5lc1tfa10gPSBsaW5lc1tfa10gKyBkZWxpbWl0ZXJzW19rXTtcbiAgfVxuICByZXR1cm4gbGluZXMuam9pbignJyk7XG59XG5cbi8vIFdyYXBwZXIgdGhhdCBzdXBwb3J0cyBtdWx0aXBsZSBmaWxlIHBhdGNoZXMgdmlhIGNhbGxiYWNrcy5cbmV4cG9ydCBmdW5jdGlvbiBhcHBseVBhdGNoZXModW5pRGlmZiwgb3B0aW9ucykge1xuICBpZiAodHlwZW9mIHVuaURpZmYgPT09ICdzdHJpbmcnKSB7XG4gICAgdW5pRGlmZiA9IHBhcnNlUGF0Y2godW5pRGlmZik7XG4gIH1cblxuICBsZXQgY3VycmVudEluZGV4ID0gMDtcbiAgZnVuY3Rpb24gcHJvY2Vzc0luZGV4KCkge1xuICAgIGxldCBpbmRleCA9IHVuaURpZmZbY3VycmVudEluZGV4KytdO1xuICAgIGlmICghaW5kZXgpIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmNvbXBsZXRlKCk7XG4gICAgfVxuXG4gICAgb3B0aW9ucy5sb2FkRmlsZShpbmRleCwgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLmNvbXBsZXRlKGVycik7XG4gICAgICB9XG5cbiAgICAgIGxldCB1cGRhdGVkQ29udGVudCA9IGFwcGx5UGF0Y2goZGF0YSwgaW5kZXgsIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5wYXRjaGVkKGluZGV4LCB1cGRhdGVkQ29udGVudCwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICByZXR1cm4gb3B0aW9ucy5jb21wbGV0ZShlcnIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvY2Vzc0luZGV4KCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICBwcm9jZXNzSW5kZXgoKTtcbn1cbiJdfQ==


/***/ }),

/***/ 4543:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

/*istanbul ignore start*/


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.structuredPatch = structuredPatch;
exports.createTwoFilesPatch = createTwoFilesPatch;
exports.createPatch = createPatch;

/*istanbul ignore end*/
var
/*istanbul ignore start*/
_line = __nccwpck_require__(1591)
/*istanbul ignore end*/
;

/*istanbul ignore start*/ function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/*istanbul ignore end*/
function structuredPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options) {
  if (!options) {
    options = {};
  }

  if (typeof options.context === 'undefined') {
    options.context = 4;
  }

  var diff =
  /*istanbul ignore start*/
  (0,
  /*istanbul ignore end*/

  /*istanbul ignore start*/
  _line
  /*istanbul ignore end*/
  .
  /*istanbul ignore start*/
  diffLines)
  /*istanbul ignore end*/
  (oldStr, newStr, options);
  diff.push({
    value: '',
    lines: []
  }); // Append an empty value to make cleanup easier

  function contextLines(lines) {
    return lines.map(function (entry) {
      return ' ' + entry;
    });
  }

  var hunks = [];
  var oldRangeStart = 0,
      newRangeStart = 0,
      curRange = [],
      oldLine = 1,
      newLine = 1;

  /*istanbul ignore start*/
  var _loop = function _loop(
  /*istanbul ignore end*/
  i) {
    var current = diff[i],
        lines = current.lines || current.value.replace(/\n$/, '').split('\n');
    current.lines = lines;

    if (current.added || current.removed) {
      /*istanbul ignore start*/
      var _curRange;

      /*istanbul ignore end*/
      // If we have previous context, start with that
      if (!oldRangeStart) {
        var prev = diff[i - 1];
        oldRangeStart = oldLine;
        newRangeStart = newLine;

        if (prev) {
          curRange = options.context > 0 ? contextLines(prev.lines.slice(-options.context)) : [];
          oldRangeStart -= curRange.length;
          newRangeStart -= curRange.length;
        }
      } // Output our changes


      /*istanbul ignore start*/
      (_curRange =
      /*istanbul ignore end*/
      curRange).push.
      /*istanbul ignore start*/
      apply
      /*istanbul ignore end*/
      (
      /*istanbul ignore start*/
      _curRange
      /*istanbul ignore end*/
      ,
      /*istanbul ignore start*/
      _toConsumableArray(
      /*istanbul ignore end*/
      lines.map(function (entry) {
        return (current.added ? '+' : '-') + entry;
      }))); // Track the updated file position


      if (current.added) {
        newLine += lines.length;
      } else {
        oldLine += lines.length;
      }
    } else {
      // Identical context lines. Track line changes
      if (oldRangeStart) {
        // Close out any changes that have been output (or join overlapping)
        if (lines.length <= options.context * 2 && i < diff.length - 2) {
          /*istanbul ignore start*/
          var _curRange2;

          /*istanbul ignore end*/
          // Overlapping

          /*istanbul ignore start*/
          (_curRange2 =
          /*istanbul ignore end*/
          curRange).push.
          /*istanbul ignore start*/
          apply
          /*istanbul ignore end*/
          (
          /*istanbul ignore start*/
          _curRange2
          /*istanbul ignore end*/
          ,
          /*istanbul ignore start*/
          _toConsumableArray(
          /*istanbul ignore end*/
          contextLines(lines)));
        } else {
          /*istanbul ignore start*/
          var _curRange3;

          /*istanbul ignore end*/
          // end the range and output
          var contextSize = Math.min(lines.length, options.context);

          /*istanbul ignore start*/
          (_curRange3 =
          /*istanbul ignore end*/
          curRange).push.
          /*istanbul ignore start*/
          apply
          /*istanbul ignore end*/
          (
          /*istanbul ignore start*/
          _curRange3
          /*istanbul ignore end*/
          ,
          /*istanbul ignore start*/
          _toConsumableArray(
          /*istanbul ignore end*/
          contextLines(lines.slice(0, contextSize))));

          var hunk = {
            oldStart: oldRangeStart,
            oldLines: oldLine - oldRangeStart + contextSize,
            newStart: newRangeStart,
            newLines: newLine - newRangeStart + contextSize,
            lines: curRange
          };

          if (i >= diff.length - 2 && lines.length <= options.context) {
            // EOF is inside this hunk
            var oldEOFNewline = /\n$/.test(oldStr);
            var newEOFNewline = /\n$/.test(newStr);
            var noNlBeforeAdds = lines.length == 0 && curRange.length > hunk.oldLines;

            if (!oldEOFNewline && noNlBeforeAdds) {
              // special case: old has no eol and no trailing context; no-nl can end up before adds
              curRange.splice(hunk.oldLines, 0, '\\ No newline at end of file');
            }

            if (!oldEOFNewline && !noNlBeforeAdds || !newEOFNewline) {
              curRange.push('\\ No newline at end of file');
            }
          }

          hunks.push(hunk);
          oldRangeStart = 0;
          newRangeStart = 0;
          curRange = [];
        }
      }

      oldLine += lines.length;
      newLine += lines.length;
    }
  };

  for (var i = 0; i < diff.length; i++) {
    /*istanbul ignore start*/
    _loop(
    /*istanbul ignore end*/
    i);
  }

  return {
    oldFileName: oldFileName,
    newFileName: newFileName,
    oldHeader: oldHeader,
    newHeader: newHeader,
    hunks: hunks
  };
}

function createTwoFilesPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options) {
  var diff = structuredPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options);
  var ret = [];

  if (oldFileName == newFileName) {
    ret.push('Index: ' + oldFileName);
  }

  ret.push('===================================================================');
  ret.push('--- ' + diff.oldFileName + (typeof diff.oldHeader === 'undefined' ? '' : '\t' + diff.oldHeader));
  ret.push('+++ ' + diff.newFileName + (typeof diff.newHeader === 'undefined' ? '' : '\t' + diff.newHeader));

  for (var i = 0; i < diff.hunks.length; i++) {
    var hunk = diff.hunks[i];
    ret.push('@@ -' + hunk.oldStart + ',' + hunk.oldLines + ' +' + hunk.newStart + ',' + hunk.newLines + ' @@');
    ret.push.apply(ret, hunk.lines);
  }

  return ret.join('\n') + '\n';
}

function createPatch(fileName, oldStr, newStr, oldHeader, newHeader, options) {
  return createTwoFilesPatch(fileName, fileName, oldStr, newStr, oldHeader, newHeader, options);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wYXRjaC9jcmVhdGUuanMiXSwibmFtZXMiOlsic3RydWN0dXJlZFBhdGNoIiwib2xkRmlsZU5hbWUiLCJuZXdGaWxlTmFtZSIsIm9sZFN0ciIsIm5ld1N0ciIsIm9sZEhlYWRlciIsIm5ld0hlYWRlciIsIm9wdGlvbnMiLCJjb250ZXh0IiwiZGlmZiIsImRpZmZMaW5lcyIsInB1c2giLCJ2YWx1ZSIsImxpbmVzIiwiY29udGV4dExpbmVzIiwibWFwIiwiZW50cnkiLCJodW5rcyIsIm9sZFJhbmdlU3RhcnQiLCJuZXdSYW5nZVN0YXJ0IiwiY3VyUmFuZ2UiLCJvbGRMaW5lIiwibmV3TGluZSIsImkiLCJjdXJyZW50IiwicmVwbGFjZSIsInNwbGl0IiwiYWRkZWQiLCJyZW1vdmVkIiwicHJldiIsInNsaWNlIiwibGVuZ3RoIiwiY29udGV4dFNpemUiLCJNYXRoIiwibWluIiwiaHVuayIsIm9sZFN0YXJ0Iiwib2xkTGluZXMiLCJuZXdTdGFydCIsIm5ld0xpbmVzIiwib2xkRU9GTmV3bGluZSIsInRlc3QiLCJuZXdFT0ZOZXdsaW5lIiwibm9ObEJlZm9yZUFkZHMiLCJzcGxpY2UiLCJjcmVhdGVUd29GaWxlc1BhdGNoIiwicmV0IiwiYXBwbHkiLCJqb2luIiwiY3JlYXRlUGF0Y2giLCJmaWxlTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7OztBQUVPLFNBQVNBLGVBQVQsQ0FBeUJDLFdBQXpCLEVBQXNDQyxXQUF0QyxFQUFtREMsTUFBbkQsRUFBMkRDLE1BQTNELEVBQW1FQyxTQUFuRSxFQUE4RUMsU0FBOUUsRUFBeUZDLE9BQXpGLEVBQWtHO0FBQ3ZHLE1BQUksQ0FBQ0EsT0FBTCxFQUFjO0FBQ1pBLElBQUFBLE9BQU8sR0FBRyxFQUFWO0FBQ0Q7O0FBQ0QsTUFBSSxPQUFPQSxPQUFPLENBQUNDLE9BQWYsS0FBMkIsV0FBL0IsRUFBNEM7QUFDMUNELElBQUFBLE9BQU8sQ0FB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QyxJQUFKLENBQ0UsU0FBU3dCLElBQUksQ0FBQ0MsUUFBZCxHQUF5QixHQUF6QixHQUErQkQsSUFBSSxDQUFDRSxRQUFwQyxHQUNFLElBREYsR0FDU0YsSUFBSSxDQUFDRyxRQURkLEdBQ3lCLEdBRHpCLEdBQytCSCxJQUFJLENBQUNJLFFBRHBDLEdBRUUsS0FISjtBQUtBTyxJQUFBQSxHQUFHLENBQUNuQyxJQUFKLENBQVNvQyxLQUFULENBQWVELEdBQWYsRUFBb0JYLElBQUksQ0FBQ3RCLEtBQXpCO0FBQ0Q7O0FBRUQsU0FBT2lDLEdBQUcsQ0FBQ0UsSUFBSixDQUFTLElBQVQsSUFBaUIsSUFBeEI7QUFDRDs7QUFFTSxTQUFTQyxXQUFULENBQXFCQyxRQUFyQixFQUErQi9DLE1BQS9CLEVBQXVDQyxNQUF2QyxFQUErQ0MsU0FBL0MsRUFBMERDLFNBQTFELEVBQXFFQyxPQUFyRSxFQUE4RTtBQUNuRixTQUFPc0MsbUJBQW1CLENBQUNLLFFBQUQsRUFBV0EsUUFBWCxFQUFxQi9DLE1BQXJCLEVBQTZCQyxNQUE3QixFQUFxQ0MsU0FBckMsRUFBZ0RDLFNBQWhELEVBQTJEQyxPQUEzRCxDQUExQjtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtkaWZmTGluZXN9IGZyb20gJy4uL2RpZmYvbGluZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBzdHJ1Y3R1cmVkUGF0Y2gob2xkRmlsZU5hbWUsIG5ld0ZpbGVOYW1lLCBvbGRTdHIsIG5ld1N0ciwgb2xkSGVhZGVyLCBuZXdIZWFkZXIsIG9wdGlvbnMpIHtcbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5jb250ZXh0ID09PSAndW5kZWZpbmVkJykge1xuICAgIG9wdGlvbnMuY29udGV4dCA9IDQ7XG4gIH1cblxuICBjb25zdCBkaWZmID0gZGlmZkxpbmVzKG9sZFN0ciwgbmV3U3RyLCBvcHRpb25zKTtcbiAgZGlmZi5wdXNoKHt2YWx1ZTogJycsIGxpbmVzOiBbXX0pOyAvLyBBcHBlbmQgYW4gZW1wdHkgdmFsdWUgdG8gbWFrZSBjbGVhbnVwIGVhc2llclxuXG4gIGZ1bmN0aW9uIGNvbnRleHRMaW5lcyhsaW5lcykge1xuICAgIHJldHVybiBsaW5lcy5tYXAoZnVuY3Rpb24oZW50cnkpIHsgcmV0dXJuICcgJyArIGVudHJ5OyB9KTtcbiAgfVxuXG4gIGxldCBodW5rcyA9IFtdO1xuICBsZXQgb2xkUmFuZ2VTdGFydCA9IDAsIG5ld1JhbmdlU3RhcnQgPSAwLCBjdXJSYW5nZSA9IFtdLFxuICAgICAgb2xkTGluZSA9IDEsIG5ld0xpbmUgPSAxO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGRpZmYubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBjdXJyZW50ID0gZGlmZltpXSxcbiAgICAgICAgICBsaW5lcyA9IGN1cnJlbnQubGluZXMgfHwgY3VycmVudC52YWx1ZS5yZXBsYWNlKC9cXG4kLywgJycpLnNwbGl0KCdcXG4nKTtcbiAgICBjdXJyZW50LmxpbmVzID0gbGluZXM7XG5cbiAgICBpZiAoY3VycmVudC5hZGRlZCB8fCBjdXJyZW50LnJlbW92ZWQpIHtcbiAgICAgIC8vIElmIHdlIGhhdmUgcHJldmlvdXMgY29udGV4dCwgc3RhcnQgd2l0aCB0aGF0XG4gICAgICBpZiAoIW9sZFJhbmdlU3RhcnQpIHtcbiAgICAgICAgY29uc3QgcHJldiA9IGRpZmZbaSAtIDFdO1xuICAgICAgICBvbGRSYW5nZVN0YXJ0ID0gb2xkTGluZTtcbiAgICAgICAgbmV3UmFuZ2VTdGFydCA9IG5ld0xpbmU7XG5cbiAgICAgICAgaWYgKHByZXYpIHtcbiAgICAgICAgICBjdXJSYW5nZSA9IG9wdGlvbnMuY29udGV4dCA+IDAgPyBjb250ZXh0TGluZXMocHJldi5saW5lcy5zbGljZSgtb3B0aW9ucy5jb250ZXh0KSkgOiBbXTtcbiAgICAgICAgICBvbGRSYW5nZVN0YXJ0IC09IGN1clJhbmdlLmxlbmd0aDtcbiAgICAgICAgICBuZXdSYW5nZVN0YXJ0IC09IGN1clJhbmdlLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBPdXRwdXQgb3VyIGNoYW5nZXNcbiAgICAgIGN1clJhbmdlLnB1c2goLi4uIGxpbmVzLm1hcChmdW5jdGlvbihlbnRyeSkge1xuICAgICAgICByZXR1cm4gKGN1cnJlbnQuYWRkZWQgPyAnKycgOiAnLScpICsgZW50cnk7XG4gICAgICB9KSk7XG5cbiAgICAgIC8vIFRyYWNrIHRoZSB1cGRhdGVkIGZpbGUgcG9zaXRpb25cbiAgICAgIGlmIChjdXJyZW50LmFkZGVkKSB7XG4gICAgICAgIG5ld0xpbmUgKz0gbGluZXMubGVuZ3RoO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb2xkTGluZSArPSBsaW5lcy5sZW5ndGg7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElkZW50aWNhbCBjb250ZXh0IGxpbmVzLiBUcmFjayBsaW5lIGNoYW5nZXNcbiAgICAgIGlmIChvbGRSYW5nZVN0YXJ0KSB7XG4gICAgICAgIC8vIENsb3NlIG91dCBhbnkgY2hhbmdlcyB0aGF0IGhhdmUgYmVlbiBvdXRwdXQgKG9yIGpvaW4gb3ZlcmxhcHBpbmcpXG4gICAgICAgIGlmIChsaW5lcy5sZW5ndGggPD0gb3B0aW9ucy5jb250ZXh0ICogMiAmJiBpIDwgZGlmZi5sZW5ndGggLSAyKSB7XG4gICAgICAgICAgLy8gT3ZlcmxhcHBpbmdcbiAgICAgICAgICBjdXJSYW5nZS5wdXNoKC4uLiBjb250ZXh0TGluZXMobGluZXMpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBlbmQgdGhlIHJhbmdlIGFuZCBvdXRwdXRcbiAgICAgICAgICBsZXQgY29udGV4dFNpemUgPSBNYXRoLm1pbihsaW5lcy5sZW5ndGgsIG9wdGlvbnMuY29udGV4dCk7XG4gICAgICAgICAgY3VyUmFuZ2UucHVzaCguLi4gY29udGV4dExpbmVzKGxpbmVzLnNsaWNlKDAsIGNvbnRleHRTaXplKSkpO1xuXG4gICAgICAgICAgbGV0IGh1bmsgPSB7XG4gICAgICAgICAgICBvbGRTdGFydDogb2xkUmFuZ2VTdGFydCxcbiAgICAgICAgICAgIG9sZExpbmVzOiAob2xkTGluZSAtIG9sZFJhbmdlU3RhcnQgKyBjb250ZXh0U2l6ZSksXG4gICAgICAgICAgICBuZXdTdGFydDogbmV3UmFuZ2VTdGFydCxcbiAgICAgICAgICAgIG5ld0xpbmVzOiAobmV3TGluZSAtIG5ld1JhbmdlU3RhcnQgKyBjb250ZXh0U2l6ZSksXG4gICAgICAgICAgICBsaW5lczogY3VyUmFuZ2VcbiAgICAgICAgICB9O1xuICAgICAgICAgIGlmIChpID49IGRpZmYubGVuZ3RoIC0gMiAmJiBsaW5lcy5sZW5ndGggPD0gb3B0aW9ucy5jb250ZXh0KSB7XG4gICAgICAgICAgICAvLyBFT0YgaXMgaW5zaWRlIHRoaXMgaHVua1xuICAgICAgICAgICAgbGV0IG9sZEVPRk5ld2xpbmUgPSAoKC9cXG4kLykudGVzdChvbGRTdHIpKTtcbiAgICAgICAgICAgIGxldCBuZXdFT0ZOZXdsaW5lID0gKCgvXFxuJC8pLnRlc3QobmV3U3RyKSk7XG4gICAgICAgICAgICBsZXQgbm9ObEJlZm9yZUFkZHMgPSBsaW5lcy5sZW5ndGggPT0gMCAmJiBjdXJSYW5nZS5sZW5ndGggPiBodW5rLm9sZExpbmVzO1xuICAgICAgICAgICAgaWYgKCFvbGRFT0ZOZXdsaW5lICYmIG5vTmxCZWZvcmVBZGRzKSB7XG4gICAgICAgICAgICAgIC8vIHNwZWNpYWwgY2FzZTogb2xkIGhhcyBubyBlb2wgYW5kIG5vIHRyYWlsaW5nIGNvbnRleHQ7IG5vLW5sIGNhbiBlbmQgdXAgYmVmb3JlIGFkZHNcbiAgICAgICAgICAgICAgY3VyUmFuZ2Uuc3BsaWNlKGh1bmsub2xkTGluZXMsIDAsICdcXFxcIE5vIG5ld2xpbmUgYXQgZW5kIG9mIGZpbGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgoIW9sZEVPRk5ld2xpbmUgJiYgIW5vTmxCZWZvcmVBZGRzKSB8fCAhbmV3RU9GTmV3bGluZSkge1xuICAgICAgICAgICAgICBjdXJSYW5nZS5wdXNoKCdcXFxcIE5vIG5ld2xpbmUgYXQgZW5kIG9mIGZpbGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaHVua3MucHVzaChodW5rKTtcblxuICAgICAgICAgIG9sZFJhbmdlU3RhcnQgPSAwO1xuICAgICAgICAgIG5ld1JhbmdlU3RhcnQgPSAwO1xuICAgICAgICAgIGN1clJhbmdlID0gW107XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG9sZExpbmUgKz0gbGluZXMubGVuZ3RoO1xuICAgICAgbmV3TGluZSArPSBsaW5lcy5sZW5ndGg7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBvbGRGaWxlTmFtZTogb2xkRmlsZU5hbWUsIG5ld0ZpbGVOYW1lOiBuZXdGaWxlTmFtZSxcbiAgICBvbGRIZWFkZXI6IG9sZEhlYWRlciwgbmV3SGVhZGVyOiBuZXdIZWFkZXIsXG4gICAgaHVua3M6IGh1bmtzXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUd29GaWxlc1BhdGNoKG9sZEZpbGVOYW1lLCBuZXdGaWxlTmFtZSwgb2xkU3RyLCBuZXdTdHIsIG9sZEhlYWRlciwgbmV3SGVhZGVyLCBvcHRpb25zKSB7XG4gIGNvbnN0IGRpZmYgPSBzdHJ1Y3R1cmVkUGF0Y2gob2xkRmlsZU5hbWUsIG5ld0ZpbGVOYW1lLCBvbGRTdHIsIG5ld1N0ciwgb2xkSGVhZGVyLCBuZXdIZWFkZXIsIG9wdGlvbnMpO1xuXG4gIGNvbnN0IHJldCA9IFtdO1xuICBpZiAob2xkRmlsZU5hbWUgPT0gbmV3RmlsZU5hbWUpIHtcbiAgICByZXQucHVzaCgnSW5kZXg6ICcgKyBvbGRGaWxlTmFtZSk7XG4gIH1cbiAgcmV0LnB1c2goJz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0nKTtcbiAgcmV0LnB1c2goJy0tLSAnICsgZGlmZi5vbGRGaWxlTmFtZSArICh0eXBlb2YgZGlmZi5vbGRIZWFkZXIgPT09ICd1bmRlZmluZWQnID8gJycgOiAnXFx0JyArIGRpZmYub2xkSGVhZGVyKSk7XG4gIHJldC5wdXNoKCcrKysgJyArIGRpZmYubmV3RmlsZU5hbWUgKyAodHlwZW9mIGRpZmYubmV3SGVhZGVyID09PSAndW5kZWZpbmVkJyA/ICcnIDogJ1xcdCcgKyBkaWZmLm5ld0hlYWRlcikpO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZGlmZi5odW5rcy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGh1bmsgPSBkaWZmLmh1bmtzW2ldO1xuICAgIHJldC5wdXNoKFxuICAgICAgJ0BAIC0nICsgaHVuay5vbGRTdGFydCArICcsJyArIGh1bmsub2xkTGluZXNcbiAgICAgICsgJyArJyArIGh1bmsubmV3U3RhcnQgKyAnLCcgKyBodW5rLm5ld0xpbmVzXG4gICAgICArICcgQEAnXG4gICAgKTtcbiAgICByZXQucHVzaC5hcHBseShyZXQsIGh1bmsubGluZXMpO1xuICB9XG5cbiAgcmV0dXJuIHJldC5qb2luKCdcXG4nKSArICdcXG4nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUGF0Y2goZmlsZU5hbWUsIG9sZFN0ciwgbmV3U3RyLCBvbGRIZWFkZXIsIG5ld0hlYWRlciwgb3B0aW9ucykge1xuICByZXR1cm4gY3JlYXRlVHdvRmlsZXNQYXRjaChmaWxlTmFtZSwgZmlsZU5hbWUsIG9sZFN0ciwgbmV3U3RyLCBvbGRIZWFkZXIsIG5ld0hlYWRlciwgb3B0aW9ucyk7XG59XG4iXX0=


/***/ }),

/***/ 2640:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

/*istanbul ignore start*/


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.calcLineCount = calcLineCount;
exports.merge = merge;

/*istanbul ignore end*/
var
/*istanbul ignore start*/
_create = __nccwpck_require__(4543)
/*istanbul ignore end*/
;

var
/*istanbul ignore start*/
_parse = __nccwpck_require__(5870)
/*istanbul ignore end*/
;

var
/*istanbul ignore start*/
_array = __nccwpck_require__(8935)
/*istanbul ignore end*/
;

/*istanbul ignore start*/ function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/*istanbul ignore end*/
function calcLineCount(hunk) {
  /*istanbul ignore start*/
  var _calcOldNewLineCount =
  /*istanbul ignore end*/
  calcOldNewLineCount(hunk.lines),
      oldLines = _calcOldNewLineCount.oldLines,
      newLines = _calcOldNewLineCount.newLines;

  if (oldLines !== undefined) {
    hunk.oldLines = oldLines;
  } else {
    delete hunk.oldLines;
  }

  if (newLines !== undefined) {
    hunk.newLines = newLines;
  } else {
    delete hunk.newLines;
  }
}

function merge(mine, theirs, base) {
  mine = loadPatch(mine, base);
  theirs = loadPatch(theirs, base);
  var ret = {}; // For index we just let it pass through as it doesn't have any necessary meaning.
  // Leaving sanity checks on this to the API consumer that may know more about the
  // meaning in their own context.

  if (mine.index || theirs.index) {
    ret.index = mine.index || theirs.index;
  }

  if (mine.newFileName || theirs.newFileName) {
    if (!fileNameChanged(mine)) {
      // No header or no change in ours, use theirs (and ours if theirs does not exist)
      ret.oldFileName = theirs.oldFileName || mine.oldFileName;
      ret.newFileName = theirs.newFileName || mine.newFileName;
      ret.oldHeader = theirs.oldHeader || mine.oldHeader;
      ret.newHeader = theirs.newHeader || mine.newHeader;
    } else if (!fileNameChanged(theirs)) {
      // No header or no change in theirs, use ours
      ret.oldFileName = mine.oldFileName;
      ret.newFileName = mine.newFileName;
      ret.oldHeader = mine.oldHeader;
      ret.newHeader = mine.newHeader;
    } else {
      // Both changed... figure it out
      ret.oldFileName = selectField(ret, mine.oldFileName, theirs.oldFileName);
      ret.newFileName = selectField(ret, mine.newFileName, theirs.newFileName);
      ret.oldHeader = selectField(ret, mine.oldHeader, theirs.oldHeader);
      ret.newHeader = selectField(ret, mine.newHeader, theirs.newHeader);
    }
  }

  ret.hunks = [];
  var mineIndex = 0,
      theirsIndex = 0,
      mineOffset = 0,
      theirsOffset = 0;

  while (mineIndex < mine.hunks.length || theirsIndex < theirs.hunks.length) {
    var mineCurrent = mine.hunks[mineIndex] || {
      oldStart: Infinity
    },
        theirsCurrent = theirs.hunks[theirsIndex] || {
      oldStart: Infinity
    };

    if (hunkBefore(mineCurrent, theirsCurrent)) {
      // This patch does not overlap with any of the others, yay.
      ret.hunks.push(cloneHunk(mineCurrent, mineOffset));
      mineIndex++;
      theirsOffset += mineCurrent.newLines - mineCurrent.oldLines;
    } else if (hunkBefore(theirsCurrent, mineCurrent)) {
      // This patch does not overlap with any of the others, yay.
      ret.hunks.push(cloneHunk(theirsCurrent, theirsOffset));
      theirsIndex++;
      mineOffset += theirsCurrent.newLines - theirsCurrent.oldLines;
    } else {
      // Overlap, merge as best we can
      var mergedHunk = {
        oldStart: Math.min(mineCurrent.oldStart, theirsCurrent.oldStart),
        oldLines: 0,
        newStart: Math.min(mineCurrent.newStart + mineOffset, theirsCurrent.oldStart + theirsOffset),
        newLines: 0,
        lines: []
      };
      mergeLines(mergedHunk, mineCurrent.oldStart, mineCurrent.lines, theirsCurrent.oldStart, theirsCurrent.lines);
      theirsIndex++;
      mineIndex++;
      ret.hunks.push(mergedHunk);
    }
  }

  return ret;
}

function loadPatch(param, base) {
  if (typeof param === 'string') {
    if (/^@@/m.test(param) || /^Index:/m.test(param)) {
      return (
        /*istanbul ignore start*/
        (0,
        /*istanbul ignore end*/

        /*istanbul ignore start*/
        _parse
        /*istanbul ignore end*/
        .
        /*istanbul ignore start*/
        parsePatch)
        /*istanbul ignore end*/
        (param)[0]
      );
    }

    if (!base) {
      throw new Error('Must provide a base reference or pass in a patch');
    }

    return (
      /*istanbul ignore start*/
      (0,
      /*istanbul ignore end*/

      /*istanbul ignore start*/
      _create
      /*istanbul ignore end*/
      .
      /*istanbul ignore start*/
      structuredPatch)
      /*istanbul ignore end*/
      (undefined, undefined, base, param)
    );
  }

  return param;
}

function fileNameChanged(patch) {
  return patch.newFileName && patch.newFileName !== patch.oldFileName;
}

function selectField(index, mine, theirs) {
  if (mine === theirs) {
    return mine;
  } else {
    index.conflict = true;
    return {
      mine: mine,
      theirs: theirs
    };
  }
}

function hunkBefore(test, check) {
  return test.oldStart < check.oldStart && test.oldStart + test.oldLines < check.oldStart;
}

function cloneHunk(hunk, offset) {
  return {
    oldStart: hunk.oldStart,
    oldLines: hunk.oldLines,
    newStart: hunk.newStart + offset,
    newLines: hunk.newLines,
    lines: hunk.lines
  };
}

function mergeLines(hunk, mineOffset, mineLines, theirOffset, theirLines) {
  // This will generally result in a conflicted hunk, but there are cases where the context
  // is the only overlap where we can successfully merge the content here.
  var mine = {
    offset: mineOffset,
    lines: mineLines,
    index: 0
  },
      their = {
    offset: theirOffset,
    lines: theirLines,
    index: 0
  }; // Handle any leading content

  insertLeading(hunk, mine, their);
  insertLeading(hunk, their, mine); // Now in the overlap content. Scan through and select the best changes from each.

  while (mine.index < mine.lines.length && their.index < their.lines.length) {
    var mineCurrent = mine.lines[mine.index],
        theirCurrent = their.lines[their.index];

    if ((mineCurrent[0] === '-' || mineCurrent[0] === '+') && (theirCurrent[0] === '-' || theirCurrent[0] === '+')) {
      // Both modified ...
      mutualChange(hunk, mine, their);
    } else if (mineCurrent[0] === '+' && theirCurrent[0] === ' ') {
      /*istanbul ignore start*/
      var _hunk$lines;

      /*istanbul ignore end*/
      // Mine inserted

      /*istanbul ignore start*/
      (_hunk$lines =
      /*istanbul ignore end*/
      hunk.lines).push.
      /*istanbul ignore start*/
      apply
      /*istanbul ignore end*/
      (
      /*istanbul ignore start*/
      _hunk$lines
      /*istanbul ignore end*/
      ,
      /*istanbul ignore start*/
      _toConsumableArray(
      /*istanbul ignore end*/
      collectChange(mine)));
    } else if (theirCurrent[0] === '+' && mineCurrent[0] === ' ') {
      /*istanbul ignore start*/
      var _hunk$lines2;

      /*istanbul ignore end*/
      // Theirs inserted

      /*istanbul ignore start*/
      (_hunk$lines2 =
      /*istanbul ignore end*/
      hunk.lines).push.
      /*istanbul ignore start*/
      apply
      /*istanbul ignore end*/
      (
      /*istanbul ignore start*/
      _hunk$lines2
      /*istanbul ignore end*/
      ,
      /*istanbul ignore start*/
      _toConsumableArray(
      /*istanbul ignore end*/
      collectChange(their)));
    } else if (mineCurrent[0] === '-' && theirCurrent[0] === ' ') {
      // Mine removed or edited
      removal(hunk, mine, their);
    } else if (theirCurrent[0] === '-' && mineCurrent[0] === ' ') {
      // Their removed or edited
      removal(hunk, their, mine, true);
    } else if (mineCurrent === theirCurrent) {
      // Context identity
      hunk.lines.push(mineCurrent);
      mine.index++;
      their.index++;
    } else {
      // Context mismatch
      conflict(hunk, collectChange(mine), collectChange(their));
    }
  } // Now push anything that may be remaining


  insertTrailing(hunk, mine);
  insertTrailing(hunk, their);
  calcLineCount(hunk);
}

function mutualChange(hunk, mine, their) {
  var myChanges = collectChange(mine),
      theirChanges = collectChange(their);

  if (allRemoves(myChanges) && allRemoves(theirChanges)) {
    // Special case for remove changes that are supersets of one another
    if (
    /*istanbul ignore start*/
    (0,
    /*istanbul ignore end*/

    /*istanbul ignore start*/
    _array
    /*istanbul ignore end*/
    .
    /*istanbul ignore start*/
    arrayStartsWith)
    /*istanbul ignore end*/
    (myChanges, theirChanges) && skipRemoveSuperset(their, myChanges, myChanges.length - theirChanges.length)) {
      /*istanbul ignore start*/
      var _hunk$lines3;

      /*istanbul ignore end*/

      /*istanbul ignore start*/
      (_hunk$lines3 =
      /*istanbul ignore end*/
      hunk.lines).push.
      /*istanbul ignore start*/
      apply
      /*istanbul ignore end*/
      (
      /*istanbul ignore start*/
      _hunk$lines3
      /*istanbul ignore end*/
      ,
      /*istanbul ignore start*/
      _toConsumableArray(
      /*istanbul ignore end*/
      myChanges));

      return;
    } else if (
    /*istanbul ignore start*/
    (0,
    /*istanbul ignore end*/

    /*istanbul ignore start*/
    _array
    /*istanbul ignore end*/
    .
    /*istanbul ignore start*/
    arrayStartsWith)
    /*istanbul ignore end*/
    (theirChanges, myChanges) && skipRemoveSuperset(mine, theirChanges, theirChanges.length - myChanges.length)) {
      /*istanbul ignore start*/
      var _hunk$lines4;

      /*istanbul ignore end*/

      /*istanbul ignore start*/
      (_hunk$lines4 =
      /*istanbul ignore end*/
      hunk.lines).push.
      /*istanbul ignore start*/
      apply
      /*istanbul ignore end*/
      (
      /*istanbul ignore start*/
      _hunk$lines4
      /*istanbul ignore end*/
      ,
      /*istanbul ignore start*/
      _toConsumableArray(
      /*istanbul ignore end*/
      theirChanges));

      return;
    }
  } else if (
  /*istanbul ignore start*/
  (0,
  /*istanbul ignore end*/

  /*istanbul ignore start*/
  _array
  /*istanbul ignore end*/
  .
  /*istanbul ignore start*/
  arrayEqual)
  /*istanbul ignore end*/
  (myChanges, theirChanges)) {
    /*istanbul ignore start*/
    var _hunk$lines5;

    /*istanbul ignore end*/

    /*istanbul ignore start*/
    (_hunk$lines5 =
    /*istanbul ignore end*/
    hunk.lines).push.
    /*istanbul ignore start*/
    apply
    /*istanbul ignore end*/
    (
    /*istanbul ignore start*/
    _hunk$lines5
    /*istanbul ignore end*/
    ,
    /*istanbul ignore start*/
    _toConsumableArray(
    /*istanbul ignore end*/
    myChanges));

    return;
  }

  conflict(hunk, myChanges, theirChanges);
}

function removal(hunk, mine, their, swap) {
  var myChanges = collectChange(mine),
      theirChanges = collectContext(their, myChanges);

  if (theirChanges.merged) {
    /*istanbul ignore start*/
    var _hunk$lines6;

    /*istanbul ignore end*/

    /*istanbul ignore start*/
    (_hunk$lines6 =
    /*istanbul ignore end*/
    hunk.lines).push.
    /*istanbul ignore start*/
    apply
    /*istanbul ignore end*/
    (
    /*istanbul ignore start*/
    _hunk$lines6
    /*istanbul ignore end*/
    ,
    /*istanbul ignore start*/
    _toConsumableArray(
    /*istanbul ignore end*/
    theirChanges.merged));
  } else {
    conflict(hunk, swap ? theirChanges : myChanges, swap ? myChanges : theirChanges);
  }
}

function conflict(hunk, mine, their) {
  hunk.conflict = true;
  hunk.lines.push({
    conflict: true,
    mine: mine,
    theirs: their
  });
}

function insertLeading(hunk, insert, their) {
  while (insert.offset < their.offset && insert.index < insert.lines.length) {
    var line = insert.lines[insert.index++];
    hunk.lines.push(line);
    insert.offset++;
  }
}

function insertTrailing(hunk, insert) {
  while (insert.index < insert.lines.length) {
    var line = insert.lines[insert.index++];
    hunk.lines.push(line);
  }
}

function collectChange(state) {
  var ret = [],
      operation = state.lines[state.index][0];

  while (state.index < state.lines.length) {
    var line = state.lines[state.index]; // Group additions that are immediately after subtractions and treat them as one "atomic" modify change.

    if (operation === '-' && line[0] === '+') {
      operation = '+';
    }

    if (operation === line[0]) {
      ret.push(line);
      state.index++;
    } else {
      break;
    }
  }

  return ret;
}

function collectContext(state, matchChanges) {
  var changes = [],
      merged = [],
      matchIndex = 0,
      contextChanges = false,
      conflicted = false;

  while (matchIndex < matchChanges.length && state.index < state.lines.length) {
    var change = state.lines[state.index],
        match = matchChanges[matchIndex]; // Once we've hit our add, then we are done

    if (match[0] === '+') {
      break;
    }

    contextChanges = contextChanges || change[0] !== ' ';
    merged.push(match);
    matchIndex++; // Consume any additions in the other block as a conflict to attempt
    // to pull in the remaining context after this

    if (change[0] === '+') {
      conflicted = true;

      while (change[0] === '+') {
        changes.push(change);
        change = state.lines[++state.index];
      }
    }

    if (match.substr(1) === change.substr(1)) {
      changes.push(change);
      state.index++;
    } else {
      conflicted = true;
    }
  }

  if ((matchChanges[matchIndex] || '')[0] === '+' && contextChanges) {
    conflicted = true;
  }

  if (conflicted) {
    return changes;
  }

  while (matchIndex < matchChanges.length) {
    merged.push(matchChanges[matchIndex++]);
  }

  return {
    merged: merged,
    changes: changes
  };
}

function allRemoves(changes) {
  return changes.reduce(function (prev, change) {
    return prev && change[0] === '-';
  }, true);
}

function skipRemoveSuperset(state, removeChanges, delta) {
  for (var i = 0; i < delta; i++) {
    var changeContent = removeChanges[removeChanges.length - delta + i].substr(1);

    if (state.lines[state.index + i] !== ' ' + changeContent) {
      return false;
    }
  }

  state.index += delta;
  return true;
}

function calcOldNewLineCount(lines) {
  var oldLines = 0;
  var newLines = 0;
  lines.forEach(function (line) {
    if (typeof line !== 'string') {
      var myCount = calcOldNewLineCount(line.mine);
      var theirCount = calcOldNewLineCount(line.theirs);

      if (oldLines !== undefined) {
        if (myCount.oldLines === theirCount.oldLines) {
          oldLines += myCount.oldLines;
        } else {
          oldLines = undefined;
        }
      }

      if (newLines !== undefined) {
        if (myCount.newLines === theirCount.newLines) {
          newLines += myCount.newLines;
        } else {
          newLines = undefined;
        }
      }
    } else {
      if (newLines !== undefined && (line[0] === '+' || line[0] === ' ')) {
        newLines++;
      }

      if (oldLines !== undefined && (line[0] === '-' || line[0] === ' ')) {
        oldLines++;
      }
    }
  });
  return {
    oldLines: oldLines,
    newLines: newLines
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wYXRjaC9tZXJnZS5qcyJdLCJuYW1lcyI6WyJjYWxjTGluZUNvdW50IiwiaHVuayIsImNhbGNPbGROZXdMaW5lQ291bnQiLCJsaW5lcyIsIm9sZExpbmVzIiwibmV3TGluZXMiLCJ1bmRlZmluZWQiLCJtZXJnZSIsIm1pbmUiLCJ0aGVpcnMiLCJiYXNlIiwibG9hZFBhdGNoIiwicmV0IiwiaW5kZXgiLCJuZXdGaWxlTmFtZSIsImZpbGVOYW1lQ2hhbmdlZCIsIm9sZEZpbGVOYW1lIiwib2xkSGVhZGVyIiwibmV3SGVhZGVyIiwic2VsZWN0RmllbGQiLCJodW5rcyIsIm1pbmVJbmRleCIsInRoZWlyc0luZGV4IiwibWluZU9mZnNldCIsInRoZWlyc09mZnNldCIsImxlbmd0aCIsIm1pbmVDdXJyZW50Iiwib2xkU3RhcnQiLCJJbmZpbml0eSIsInRoZWlyc0N1cnJlbnQiLCJodW5rQmVmb3JlIiwicHVzaCIsImNsb25lSHVuayIsIm1lcmdlZEh1bmsiLCJNYXRoIiwibWluIiwibmV3U3RhcnQiLCJtZXJnZUxpbmVzIiwicGFyYW0iLCJ0ZXN0IiwicGFyc2VQYXRjaCIsIkVycm9yIiwic3RydWN0dXJlZFBhdGNoIiwicGF0Y2giLCJjb25mbGljdCIsImNoZWNrIiwib2Zmc2V0IiwibWluZUxpbmVzIiwidGhlaXJPZmZzZXQiLCJ0aGVpckxpbmVzIiwidGhlaXIiLCJpbnNlcnRMZWFkaW5nIiwidGhlaXJDdXJyZW50IiwibXV0dWFsQ2hhbmdlIiwiY29sbGVjdENoYW5nZSIsInJlbW92YWwiLCJpbnNlcnRUcmFpbGluZyIsIm15Q2hhbmdlcyIsInRoZWlyQ2hhbmdlcyIsImFsbFJlbW92ZXMiLCJhcnJheVN0YXJ0c1dpdGgiLCJza2lwUmVtb3ZlU3VwZXJzZXQiLCJhcnJheUVxdWFsIiwic3dhcCIsImNvbGxlY3RDb250ZXh0IiwibWVyZ2VkIiwiaW5zZXJ0IiwibGluZSIsInN0YXRlIiwib3BlcmF0aW9uIiwibWF0Y2hDaGFuZ2VzIiwiY2hhbmdlcyIsIm1hdGNoSW5kZXgiLCJjb250ZXh0Q2hhbmdlcyIsImNvbmZsaWN0ZWQiLCJjaGFuZ2UiLCJtYXRjaCIsInN1YnN0ciIsInJlZHVjZSIsInByZXYiLCJyZW1vdmVDaGFuZ2VzIiwiZGVsdGEiLCJpIiwiY2hhbmdlQ29udGVudCIsImZvckVhY2giLCJteUNvdW50IiwidGhlaXJDb3VudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFFQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7OztBQUVPLFNBQVNBLGFBQVQsQ0FBdUJDLElBQXZCLEVBQTZCO0FBQUE7QUFBQTtBQUFBO0FBQ0xDLEVBQUFBLG1CQUFtQixDQUFDRCxJQUFJLENBQUNFLEtBQU4sQ0FEZDtBQUFBLE1BQzNCQyxRQUQyQix3QkFDM0JBLFFBRDJCO0FBQUEsTUFDakJDLFFBRGlCLHdCQUNqQkEsUUFEaUI7O0FBR2xDLE1BQUlELFFBQVEsS0FBS0UsU0FBakIsRUFBNEI7QUFDMUJMLElBQUFBLElBQUksQ0FBQ0csUUFBTCxHQUFnQkEsUUFBaEI7QUFDRCxHQUZELE1BRU87QUFDTCxXQUFPSCxJQUFJLENBQUNHLFFBQVo7QUFDRDs7QUFFRCxNQUFJQyxRQUFRLEtBQUtDLFNBQWpCLEVBQTRCO0FBQzFCTCxJQUFBQSxJQUFJLENBQUNJLFFBQUwsR0FBZ0JBLFFBQWhCO0FBQ0QsR0FGRCxNQUVPO0FBQ0wsV0FBT0osSUFBSSxDQUFDSSxRQUFaO0FBQ0Q7QUFDRjs7QUFFTSxTQUFTRSxLQUFULENBQWVDLElBQWYsRUFBcUJDLE1BQXJCLEVBQTZCQyxJQUE3QixFQUFtQztBQUN4Q0YsRUFBQUEsSUFBSSxHQUFHRyxTQUFTLENBQUNILElBQUQsRUFBT0UsSUFBUCxDQUFoQjtBQUNBRCxFQUFBQSxNQUFNLEdBQUdFLFNBQVMsQ0FBQ0YsTUFBRCxFQUFTQyxJQUFULENBQWxCO0FBRUEsTUFBSUUsR0FBRyxHQUFHLEVBQVYsQ0FKd0MsQ0FNeEM7QUFDQTtBQUNBOztBQUNBLE1BQUlKLElBQUksQ0FBQ0ssS0FBTCxJQUFjSixNQUFNLENBQUNJLEtBQXpCLEVBQWdDO0FBQzlCRCxJQUFBQSxHQUFHLENBQUNDLEtBQUosR0FBWUwsSUFBSSxDQUFDSyxLQUFMLElBQWNKLE1BQU0sQ0FBQ0ksS0FBakM7QUFDRDs7QUFFRCxNQUFJTCxJQUFJLENBQUNNLFdBQUwsSUFBb0JMLE1BQU0sQ0FBQ0ssV0FBL0IsRUFBNEM7QUFDMUMsUUFBSSxDQUFDQyxlQUFlLENBQUNQLElBQUQsQ0FBcEIsRUFBNEI7QUFDMUI7QUFDQUksTUFBQUEsR0FBRyxDQUFDSSxXQUFKLEdBQWtCUCxNQUFNLENBQUNPLFdBQVAsSUFBc0JSLElBQUksQ0FBQ1EsV0FBN0M7QUFDQUosTUFBQUEsR0FBRyxDQUFDRSxXQUFKLEdBQWtCTCxNQUFNLENBQUNLLFdBQVAsSUFBc0JOLElBQUksQ0FBQ00sV0FBN0M7QUFDQUYsTUFBQUEsR0FBRyxDQUFDSyxTQUFKLEdBQWdCUixNQUFNLENBQUNRLFNBQVAsSUFBb0JULElBQUksQ0FBQ1MsU0FBekM7QUFDQUwsTUFBQUEsR0FBRyxDQUFDTSxTQUFKLEdBQWdCVCxNQUFNLENBQUNTLFNBQVAsSUFBb0JWLElBQUksQ0FBQ1UsU0FBekM7QUFDRCxLQU5ELE1BTU8sSUFBSSxDQUFDSCxlQUFlLENBQUNOLE1BQUQsQ0FBcEIsRUFBOEI7QUFDbkM7QUFDQUcsTUFBQUEsR0FBRyxDQUFDSSxXQUFKLEdBQWtCUixJQUFJLENBQUNRLFdBQXZCO0FBQ0FKLE1BQUFBLEdBQUcsQ0FBQ0UsV0FBSixHQUFrQk4sSUFBSSxDQUFDTSxXQUF2QjtBQUNBRixNQUFBQSxHQUFHLENBQUNLLFNBQUosR0FBZ0JULElBQUksQ0FBQ1MsU0FBckI7QUFDQUwsTUFBQUEsR0FBRyxDQUFDTSxTQUFKLEdBQWdCVixJQUFJLENBQUNVLFNBQXJCO0FBQ0QsS0FOTSxNQU1BO0FBQ0w7QUFDQU4sTUFBQUEsR0FBRyxDQUFDSSxXQUFKLEdBQWtCRyxXQUFXLENBQUNQLEdBQUQsRUFBTUosSUFBSSxDQUFDUSxXQUFYLEVBQXdCUCxNQUFNLENBQUNPLFdBQS9CLENBQTdCO0FBQ0FKLE1BQUFBLEdBQUcsQ0FBQ0UsV0FBSixHQUFrQkssV0FBVyxDQUFDUCxHQUFELEVBQU1KLElBQUksQ0FBQ00sV0FBWCxFQUF3QkwsTUFBTSxDQUFDSyxXQUEvQixDQUE3QjtBQUNBRixNQUFBQSxHQUFHLENBQUNLLFNBQUosR0FBZ0JFLFdBQVcsQ0FBQ1AsR0FBRCxFQUFNSixJQUFJLENBQUNTLFNBQVgsRUFBc0JSLE1BQU0sQ0FBQ1EsU0FBN0IsQ0FBM0I7QUFDQUwsTUFBQUEsR0FBRyxDQUFDTSxTQUFKLEdBQWdCQyxXQUFXLENBQUNQLEdBQUQsRUFBTUosSUFBSSxDQUFDVSxTQUFYLEVBQXNCVCxNQUFNLENBQUNTLFNBQTdCLENBQTNCO0FBQ0Q7QUFDRjs7QUFFRE4sRUFBQUEsR0FBRyxDQUFDUSxLQUFKLEdBQVksRUFBWjtBQUVBLE1BQUlDLFNBQVMsR0FBRyxDQUFoQjtBQUFBLE1BQ0lDLFdBQVcsR0FBRyxDQURsQjtBQUFBLE1BRUlDLFVBQVUsR0FBRyxDQUZqQjtBQUFBLE1BR0lDLFlBQVksR0FBRyxDQUhuQjs7QUFLQSxTQUFPSCxTQUFTLEdBQUdiLElBQUksQ0FBQ1ksS0FBTCxDQUFXSyxNQUF2QixJQUFpQ0gsV0FBVyxHQUFHYixNQUFNLENBQUNXLEtBQVAsQ0FBYUssTUFBbkUsRUFBMkU7QUFDekUsUUFBSUMsV0FBVyxHQUFHbEIsSUFBSSxDQUFDWSxLQUFMLENBQVdDLFNBQVgsS0FBeUI7QUFBQ00sTUFBQUEsUUFBUSxFQUFFQztBQUFYLEtBQTNDO0FBQUEsUUFDSUMsYUFBYSxHQUFHcEIsTUFBTSxDQUFDVyxLQUFQLENBQWFFLFdBQWIsS0FBNkI7QUFBQ0ssTUFBQUEsUUFBUSxFQUFFQztBQUFYLEtBRGpEOztBQUdBLFFBQUlFLFVBQVUsQ0FBQ0osV0FBRCxFQUFjRyxhQUFkLENBQWQsRUFBNEM7QUFDMUM7QUFDQWpCLE1BQUFBLEdBQUcsQ0FBQ1EsS0FBSixDQUFVVyxJQUFWLENBQWVDLFNBQVMsQ0FBQ04sV0FBRCxFQUFjSCxVQUFkLENBQXhCO0FBQ0FGLE1BQUFBLFNBQVM7QUFDVEcsTUFBQUEsWUFBWSxJQUFJRSxXQUFXLENBQUNyQixRQUFaLEdBQXVCcUIsV0FBVyxDQUFDdEIsUUFBbkQ7QUFDRCxLQUxELE1BS08sSUFBSTBCLFVBQVUsQ0FBQ0QsYUFBRCxFQUFnQkgsV0FBaEIsQ0FBZCxFQUE0QztBQUNqRDtBQUNBZCxNQUFBQSxHQUFHLENBQUNRLEtBQUosQ0FBVVcsSUFBVixDQUFlQyxTQUFTLENBQUNILGFBQUQsRUFBZ0JMLFlBQWhCLENBQXhCO0FBQ0FGLE1BQUFBLFdBQVc7QUFDWEMsTUFBQUEsVUFBVSxJQUFJTSxhQUFhLENBQUN4QixRQUFkLEdBQXlCd0IsYUFBYSxDQUFDekIsUUFBckQ7QUFDRCxLQUxNLE1BS0E7QUFDTDtBQUNBLFVBQUk2QixVQUFVLEdBQUc7QUFDZk4sUUFBQUEsUUFBUSxFQUFFTyxJQUFJLENBQUNDLEdBQUwsQ0FBU1QsV0FBVyxDQUFDQyxRQUFyQixFQUErQkUsYUFBYSxDQUFDRixRQUE3QyxDQURLO0FBRWZ2QixRQUFBQSxRQUFRLEVBQUUsQ0FGSztBQUdmZ0MsUUFBQUEsUUFBUSxFQUFFRixJQUFJLENBQUNDLEdBQUwsQ0FBU1QsV0FBVyxDQUFDVSxRQUFaLEdBQXVCYixVQUFoQyxFQUE0Q00sYUFBYSxDQUFDRixRQUFkLEdBQXlCSCxZQUFyRSxDQUhLO0FBSWZuQixRQUFBQSxRQUFRLEVBQUUsQ0FKSztBQUtmRixRQUFBQSxLQUFLLEVBQUU7QUFMUSxPQUFqQjtBQU9Ba0MsTUFBQUEsVUFBVSxDQUFDSixVQUFELEVBQWFQLFdBQVcsQ0FBQ0MsUUFBekIsRUFBbUNELFdBQVcsQ0FBQ3ZCLEtBQS9DLEVBQXNEMEIsYUFBYSxDQUFDRixRQUFwRSxFQUE4RUUsYUFBYSxDQUFDMUIsS0FBNUYsQ0FBVjtBQUNBbUIsTUFBQUEsV0FBVztBQUNYRCxNQUFBQSxTQUFTO0FBRVRULE1BQUFBLEdBQUcsQ0FBQ1EsS0FBSixDQUFVVyxJQUFWLENBQWVFLFVBQWY7QUFDRDtBQUNGOztBQUVELFNBQU9yQixHQUFQO0FBQ0Q7O0FBRUQsU0FBU0QsU0FBVCxDQUFtQjJCLEtBQW5CLEVBQTBCNUIsSUFBMUIsRUFBZ0M7QUFDOUIsTUFBSSxPQUFPNEIsS0FBUCxLQUFpQixRQUFyQixFQUErQjtBQUM3QixRQUFLLE1BQUQsQ0FBU0MsSUFBVCxDQUFjRCxLQUFkLEtBQTBCLFVBQUQsQ0FBYUMsSUFBYixDQUFrQkQsS0FBbEIsQ0FBN0IsRUFBd0Q7QUFDdEQsYUFBTztBQUFBO0FBQUE7QUFBQTs7QUFBQUU7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQTtBQUFBLFNBQVdGLEtBQVgsRUFBa0IsQ0FBbEI7QUFBUDtBQUNEOztBQUVELFFBQUksQ0FBQzVCLElBQUwsRUFBVztBQUNULFlBQU0sSUFBSStCLEtBQUosQ0FBVSxrREFBVixDQUFOO0FBQ0Q7O0FBQ0QsV0FBTztBQUFBO0FBQUE7QUFBQTs7QUFBQUM7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQTtBQUFBLE9BQWdCcEMsU0FBaEIsRUFBMkJBLFNBQTNCLEVBQXNDSSxJQUF0QyxFQUE0QzRCLEtBQTVDO0FBQVA7QUFDRDs7QUFFRCxTQUFPQSxLQUFQO0FBQ0Q7O0FBRUQsU0FBU3ZCLGVBQVQsQ0FBeUI0QixLQUF6QixFQUFnQztBQUM5QixTQUFPQSxLQUFLLENBQUM3QixXQUFOLElBQXFCNkIsS0FBSyxDQUFDN0IsV0FBTixLQUFzQjZCLEtBQUssQ0FBQzNCLFdBQXhEO0FBQ0Q7O0FBRUQsU0FBU0csV0FBVCxDQUFxQk4sS0FBckIsRUFBNEJMLElBQTVCLEVBQWtDQyxNQUFsQyxFQUEwQztBQUN4QyxNQUFJRCxJQUFJLEtBQUtDLE1BQWIsRUFBcUI7QUFDbkIsV0FBT0QsSUFBUDtBQUNELEdBRkQsTUFFTztBQUNMSyxJQUFBQSxLQUFLLENBQUMrQixRQUFOLEdBQWlCLElBQWpCO0FBQ0EsV0FBTztBQUFDcEMsTUFBQUEsSUFBSSxFQUFKQSxJQUFEO0FBQU9DLE1BQUFBLE1BQU0sRUFBTkE7QUFBUCxLQUFQO0FBQ0Q7QUFDRjs7QUFFRCxTQUFTcUIsVUFBVCxDQUFvQlMsSUFBcEIsRUFBMEJNLEtBQTFCLEVBQWlDO0FBQy9CLFNBQU9OLElBQUksQ0FBQ1osUUFBTCxHQUFnQmtCLEtBQUssQ0FBQ2xCLFFBQXRCLElBQ0RZLElBQUksQ0FBQ1osUUFBTCxHQUFnQlksSUFBSSxDQUFDbkMsUUFBdEIsR0FBa0N5QyxLQUFLLENBQUNsQixRQUQ3QztBQUVEOztBQUVELFNBQVNLLFNBQVQsQ0FBbUIvQixJQUFuQixFQUF5QjZDLE1BQXpCLEVBQWlDO0FBQy9CLFNBQU87QUFDTG5CLElBQUFBLFFBQVEsRUFBRTFCLElBQUksQ0FBQzBCLFFBRFY7QUFDb0J2QixJQUFBQSxRQUFRLEVBQUVILElBQUksQ0FBQ0csUUFEbkM7QUFFTGdDLElBQUFBLFFBQVEsRUFBRW5DLElBQUksQ0FBQ21DLFFBQUwsR0FBZ0JVLE1BRnJCO0FBRTZCekMsSUFBQUEsUUFBUSxFQUFFSixJQUFJLENBQUNJLFFBRjVDO0FBR0xGLElBQUFBLEtBQUssRUFBRUYsSUFBSSxDQUFDRTtBQUhQLEdBQVA7QUFLRDs7QUFFRCxTQUFTa0MsVUFBVCxDQUFvQnBDLElBQXBCLEVBQTBCc0IsVUFBMUIsRUFBc0N3QixTQUF0QyxFQUFpREMsV0FBakQsRUFBOERDLFVBQTlELEVBQTBFO0FBQ3hFO0FBQ0E7QUFDQSxNQUFJekMsSUFBSSxHQUFHO0FBQUNzQyxJQUFBQSxNQUFNLEVBQUV2QixVQUFUO0FBQXFCcEIsSUFBQUEsS0FBSyxFQUFFNEMsU0FBNUI7QUFBdUNsQyxJQUFBQSxLQUFLLEVBQUU7QUFBOUMsR0FBWDtBQUFBLE1BQ0lxQyxLQUFLLEdBQUc7QUFBQ0osSUFBQUEsTUFBTSxFQUFFRSxXQUFUO0FBQXNCN0MsSUFBQUEsS0FBSyxFQUFFOEMsVUFBN0I7QUFBeUNwQyxJQUFBQSxLQUFLLEVBQUU7QUFBaEQsR0FEWixDQUh3RSxDQU14RTs7QUFDQXNDLEVBQUFBLGFBQWEsQ0FBQ2xELElBQUQsRUFBT08sSUFBUCxFQUFhMEMsS0FBYixDQUFiO0FBQ0FDLEVBQUFBLGFBQWEsQ0FBQ2xELElBQUQsRUFBT2lELEtBQVAsRUFBYzFDLElBQWQsQ0FBYixDQVJ3RSxDQVV4RTs7QUFDQSxTQUFPQSxJQUFJLENBQUNLLEtBQUwsR0FBYUwsSUFBSSxDQUFDTCxLQUFMLENBQVdzQixNQUF4QixJQUFrQ3lCLEtBQUssQ0FBQ3JDLEtBQU4sR0FBY3FDLEtBQUssQ0FBQy9DLEtBQU4sQ0FBWXNCLE1BQW5FLEVBQTJFO0FBQ3pFLFFBQUlDLFdBQVcsR0FBR2xCLElBQUksQ0FBQ0wsS0FBTCxDQUFXSyxJQUFJLENBQUNLLEtBQWhCLENBQWxCO0FBQUEsUUFDSXVDLFlBQVksR0FBR0YsS0FBSyxDQUFDL0MsS0FBTixDQUFZK0MsS0FBSyxDQUFDckMsS0FBbEIsQ0FEbkI7O0FBR0EsUUFBSSxDQUFDYSxXQUFXLENBQUMsQ0FBRCxDQUFYLEtBQW1CLEdBQW5CLElBQTBCQSxXQUFXLENBQUMsQ0FBRCxDQUFYLEtBQW1CLEdBQTlDLE1BQ0kwQixZQUFZLENBQUMsQ0FBRCxDQUFaLEtBQW9CLEdBQXBCLElBQTJCQSxZQUFZLENBQUMsQ0FBRCxDQUFaLEtBQW9CLEdBRG5ELENBQUosRUFDNkQ7QUFDM0Q7QUFDQUMsTUFBQUEsWUFBWSxDQUFDcEQsSUFBRCxFQUFPTyxJQUFQLEVBQWEwQyxLQUFiLENBQVo7QUFDRCxLQUpELE1BSU8sSUFBSXhCLFdBQVcsQ0FBQyxDQUFELENBQVgsS0FBbUIsR0FBbkIsSUFBMEIwQixZQUFZLENBQUMsQ0FBRCxDQUFaLEtBQW9CLEdBQWxELEVBQXVEO0FBQUE7QUFBQTs7QUFBQTtBQUM1RDs7QUFDQTtBQUFBO0FBQUE7QUFBQW5ELE1BQUFBLElBQUksQ0FBQ0UsS0FBTCxFQUFXNEIsSUFBWDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBb0J1QixNQUFBQSxhQUFhLENBQUM5QyxJQUFELENBQWpDO0FBQ0QsS0FITSxNQUdBLElBQUk0QyxZQUFZLENBQUMsQ0FBRCxDQUFaLEtBQW9CLEdBQXBCLElBQTJCMUIsV0FBVyxDQUFDLENBQUQsQ0FBWCxLQUFtQixHQUFsRCxFQUF1RDtBQUFBO0FBQUE7O0FBQUE7QUFDNUQ7O0FBQ0E7QUFBQTtBQUFBO0FBQUF6QixNQUFBQSxJQUFJLENBQUNFLEtBQUwsRUFBVzRCLElBQVg7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQW9CdUIsTUFBQUEsYUFBYSxDQUFDSixLQUFELENBQWpDO0FBQ0QsS0FITSxNQUdBLElBQUl4QixXQUFXLENBQUMsQ0FBRCxDQUFYLEtBQW1CLEdBQW5CLElBQTBCMEIsWUFBWSxDQUFDLENBQUQsQ0FBWixLQUFvQixHQUFsRCxFQUF1RDtBQUM1RDtBQUNBRyxNQUFBQSxPQUFPLENBQUN0RCxJQUFELEVBQU9PLElBQVAsRUFBYTBDLEtBQWIsQ0FBUDtBQUNELEtBSE0sTUFHQSxJQUFJRSxZQUFZLENBQUMsQ0FBRCxDQUFaLEtBQW9CLEdBQXBCLElBQTJCMUIsV0FBVyxDQUFDLENBQUQsQ0FBWCxLQUFtQixHQUFsRCxFQUF1RDtBQUM1RDtBQUNBNkIsTUFBQUEsT0FBTyxDQUFDdEQsSUFBRCxFQUFPaUQsS0FBUCxFQUFjMUMsSUFBZCxFQUFvQixJQUFwQixDQUFQO0FBQ0QsS0FITSxNQUdBLElBQUlrQixXQUFXLEtBQUswQixZQUFwQixFQUFrQztBQUN2QztBQUNBbkQsTUFBQUEsSUFBSSxDQUFDRSxLQUFMLENBQVc0QixJQUFYLENBQWdCTCxXQUFoQjtBQUNBbEIsTUFBQUEsSUFBSSxDQUFDSyxLQUFMO0FBQ0FxQyxNQUFBQSxLQUFLLENBQUNyQyxLQUFOO0FBQ0QsS0FMTSxNQUtBO0FBQ0w7QUFDQStCLE1BQUFBLFFBQVEsQ0FBQzNDLElBQUQsRUFBT3FELGFBQWEsQ0FBQzlDLElBQUQsQ0FBcEIsRUFBNEI4QyxhQUFhLENBQUNKLEtBQUQsQ0FBekMsQ0FBUjtBQUNEO0FBQ0YsR0F4Q3VFLENBMEN4RTs7O0FBQ0FNLEVBQUFBLGNBQWMsQ0FBQ3ZELElBQUQsRUFBT08sSUFBUCxDQUFkO0FBQ0FnRCxFQUFBQSxjQUFjLENBQUN2RCxJQUFELEVBQU9pRCxLQUFQLENBQWQ7QUFFQWxELEVBQUFBLGFBQWEsQ0FBQ0MsSUFBRCxDQUFiO0FBQ0Q7O0FBRUQsU0FBU29ELFlBQVQsQ0FBc0JwRCxJQUF0QixFQUE0Qk8sSUFBNUIsRUFBa0MwQyxLQUFsQyxFQUF5QztBQUN2QyxNQUFJTyxTQUFTLEdBQUdILGFBQWEsQ0FBQzlDLElBQUQsQ0FBN0I7QUFBQSxNQUNJa0QsWUFBWSxHQUFHSixhQUFhLENBQUNKLEtBQUQsQ0FEaEM7O0FBR0EsTUFBSVMsVUFBVSxDQUFDRixTQUFELENBQVYsSUFBeUJFLFVBQVUsQ0FBQ0QsWUFBRCxDQUF2QyxFQUF1RDtBQUNyRDtBQUNBO0FBQUk7QUFBQTtBQUFBOztBQUFBRTtBQUFBQTtBQUFBQTtBQUFBQTtBQUFBQTtBQUFBQTtBQUFBO0FBQUEsS0FBZ0JILFNBQWhCLEVBQTJCQyxZQUEzQixLQUNHRyxrQkFBa0IsQ0FBQ1gsS0FBRCxFQUFRTyxTQUFSLEVBQW1CQSxTQUFTLENBQUNoQyxNQUFWLEdBQW1CaUMsWUFBWSxDQUFDakMsTUFBbkQsQ0FEekIsRUFDcUY7QUFBQTtBQUFBOztBQUFBOztBQUNuRjtBQUFBO0FBQUE7QUFBQXhCLE1BQUFBLElBQUksQ0FBQ0UsS0FBTCxFQUFXNEIsSUFBWDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBb0IwQixNQUFBQSxTQUFwQjs7QUFDQTtBQUNELEtBSkQsTUFJTztBQUFJO0FBQUE7QUFBQTs7QUFBQUc7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQTtBQUFBLEtBQWdCRixZQUFoQixFQUE4QkQsU0FBOUIsS0FDSkksa0JBQWtCLENBQUNyRCxJQUFELEVBQU9rRCxZQUFQLEVBQXFCQSxZQUFZLENBQUNqQyxNQUFiLEdBQXNCZ0MsU0FBUyxDQUFDaEMsTUFBckQsQ0FEbEIsRUFDZ0Y7QUFBQTtBQUFBOztBQUFBOztBQUNyRjtBQUFBO0FBQUE7QUFBQXhCLE1BQUFBLElBQUksQ0FBQ0UsS0FBTCxFQUFXNEIsSUFBWDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBb0IyQixNQUFBQSxZQUFwQjs7QUFDQTtBQUNEO0FBQ0YsR0FYRCxNQVdPO0FBQUk7QUFBQTtBQUFBOztBQUFBSTtBQUFBQTtBQUFBQTtBQUFBQTtBQUFBQTtBQUFBQTtBQUFBO0FBQUEsR0FBV0wsU0FBWCxFQUFzQkMsWUFBdEIsQ0FBSixFQUF5QztBQUFBO0FBQUE7O0FBQUE7O0FBQzlDO0FBQUE7QUFBQTtBQUFBekQsSUFBQUEsSUFBSSxDQUFDRSxLQUFMLEVBQVc0QixJQUFYO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFvQjBCLElBQUFBLFNBQXBCOztBQUNBO0FBQ0Q7O0FBRURiLEVBQUFBLFFBQVEsQ0FBQzNDLElBQUQsRUFBT3dELFNBQVAsRUFBa0JDLFlBQWxCLENBQVI7QUFDRDs7QUFFRCxTQUFTSCxPQUFULENBQWlCdEQsSUFBakIsRUFBdUJPLElBQXZCLEVBQTZCMEMsS0FBN0IsRUFBb0NhLElBQXBDLEVBQTBDO0FBQ3hDLE1BQUlOLFNBQVMsR0FBR0gsYUFBYSxDQUFDOUMsSUFBRCxDQUE3QjtBQUFBLE1BQ0lrRCxZQUFZLEdBQUdNLGNBQWMsQ0FBQ2QsS0FBRCxFQUFRTyxTQUFSLENBRGpDOztBQUVBLE1BQUlDLFlBQVksQ0FBQ08sTUFBakIsRUFBeUI7QUFBQTtBQUFBOztBQUFBOztBQUN2QjtBQUFBO0FBQUE7QUFBQWhFLElBQUFBLElBQUksQ0FBQ0UsS0FBTCxFQUFXNEIsSUFBWDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBb0IyQixJQUFBQSxZQUFZLENBQUNPLE1BQWpDO0FBQ0QsR0FGRCxNQUVPO0FBQ0xyQixJQUFBQSxRQUFRLENBQUMzQyxJQUFELEVBQU84RCxJQUFJLEdBQUdMLFlBQUgsR0FBa0JELFNBQTdCLEVBQXdDTSxJQUFJLEdBQUdOLFNBQUgsR0FBZUMsWUFBM0QsQ0FBUjtBQUNEO0FBQ0Y7O0FBRUQsU0FBU2QsUUFBVCxDQUFrQjNDLElBQWxCLEVBQXdCTyxJQUF4QixFQUE4QjBDLEtBQTlCLEVBQXFDO0FBQ25DakQsRUFBQUEsSUFBSSxDQUFDMkMsUUFBTCxHQUFnQixJQUFoQjtBQUNBM0MsRUFBQUEsSUFBSSxDQUFDRSxLQUFMLENBQVc0QixJQUFYLENBQWdCO0FBQ2RhLElBQUFBLFFBQVEsRUFBRSxJQURJO0FBRWRwQyxJQUFBQSxJQUFJLEVBQUVBLElBRlE7QUFHZEMsSUFBQUEsTUFBTSxFQUFFeUM7QUFITSxHQUFoQjtBQUtEOztBQUVELFNBQVNDLGFBQVQsQ0FBdUJsRCxJQUF2QixFQUE2QmlFLE1BQTdCLEVBQXFDaEIsS0FBckMsRUFBNEM7QUFDMUMsU0FBT2dCLE1BQU0sQ0FBQ3BCLE1BQVAsR0FBZ0JJLEtBQUssQ0FBQ0osTUFBdEIsSUFBZ0NvQixNQUFNLENBQUNyRCxLQUFQLEdBQWVxRCxNQUFNLENBQUMvRCxLQUFQLENBQWFzQixNQUFuRSxFQUEyRTtBQUN6RSxRQUFJMEMsSUFBSSxHQUFHRCxNQUFNLENBQUMvRCxLQUFQLENBQWErRCxNQUFNLENBQUNyRCxLQUFQLEVBQWIsQ0FBWDtBQUNBWixJQUFBQSxJQUFJLENBQUNFLEtBQUwsQ0FBVzRCLElBQVgsQ0FBZ0JvQyxJQUFoQjtBQUNBRCxJQUFBQSxNQUFNLENBQUNwQixNQUFQO0FBQ0Q7QUFDRjs7QUFDRCxTQUFTVSxjQUFULENBQXdCdkQsSUFBeEIsRUFBOEJpRSxNQUE5QixFQUFzQztBQUNwQyxTQUFPQSxNQUFNLENBQUNyRCxLQUFQLEdBQWVxRCxNQUFNLENBQUMvRCxLQUFQLENBQWFzQixNQUFuQyxFQUEyQztBQUN6QyxRQUFJMEMsSUFBSSxHQUFHRCxNQUFNLENBQUMvRCxLQUFQLENBQWErRCxNQUFNLENBQUNyRCxLQUFQLEVBQWIsQ0FBWDtBQUNBWixJQUFBQSxJQUFJLENBQUNFLEtBQUwsQ0FBVzRCLElBQVgsQ0FBZ0JvQyxJQUFoQjtBQUNEO0FBQ0Y7O0FBRUQsU0FBU2IsYUFBVCxDQUF1QmMsS0FBdkIsRUFBOEI7QUFDNUIsTUFBSXhELEdBQUcsR0FBRyxFQUFWO0FBQUEsTUFDSXlELFNBQVMsR0FBR0QsS0FBSyxDQUFDakUsS0FBTixDQUFZaUUsS0FBSyxDQUFDdkQsS0FBbEIsRUFBeUIsQ0FBekIsQ0FEaEI7O0FBRUEsU0FBT3VELEtBQUssQ0FBQ3ZELEtBQU4sR0FBY3VELEtBQUssQ0FBQ2pFLEtBQU4sQ0FBWXNCLE1BQWpDLEVBQXlDO0FBQ3ZDLFFBQUkwQyxJQUFJLEdBQUdDLEtBQUssQ0FBQ2pFLEtBQU4sQ0FBWWlFLEtBQUssQ0FBQ3ZELEtBQWxCLENBQVgsQ0FEdUMsQ0FHdkM7O0FBQ0EsUUFBSXdELFNBQVMsS0FBSyxHQUFkLElBQXFCRixJQUFJLENBQUMsQ0FBRCxDQUFKLEtBQVksR0FBckMsRUFBMEM7QUFDeENFLE1BQUFBLFNBQVMsR0FBRyxHQUFaO0FBQ0Q7O0FBRUQsUUFBSUEsU0FBUyxLQUFLRixJQUFJLENBQUMsQ0FBRCxDQUF0QixFQUEyQjtBQUN6QnZELE1BQUFBLEdBQUcsQ0FBQ21CLElBQUosQ0FBU29DLElBQVQ7QUFDQUMsTUFBQUEsS0FBSyxDQUFDdkQsS0FBTjtBQUNELEtBSEQsTUFHTztBQUNMO0FBQ0Q7QUFDRjs7QUFFRCxTQUFPRCxHQUFQO0FBQ0Q7O0FBQ0QsU0FBU29ELGNBQVQsQ0FBd0JJLEtBQXhCLEVBQStCRSxZQUEvQixFQUE2QztBQUMzQyxNQUFJQyxPQUFPLEdBQUcsRUFBZDtBQUFBLE1BQ0lOLE1BQU0sR0FBRyxFQURiO0FBQUEsTUFFSU8sVUFBVSxHQUFHLENBRmpCO0FBQUEsTUFHSUMsY0FBYyxHQUFHLEtBSHJCO0FBQUEsTUFJSUMsVUFBVSxHQUFHLEtBSmpCOztBQUtBLFNBQU9GLFVBQVUsR0FBR0YsWUFBWSxDQUFDN0MsTUFBMUIsSUFDRTJDLEtBQUssQ0FBQ3ZELEtBQU4sR0FBY3VELEtBQUssQ0FBQ2pFLEtBQU4sQ0FBWXNCLE1BRG5DLEVBQzJDO0FBQ3pDLFFBQUlrRCxNQUFNLEdBQUdQLEtBQUssQ0FBQ2pFLEtBQU4sQ0FBWWlFLEtBQUssQ0FBQ3ZELEtBQWxCLENBQWI7QUFBQSxRQUNJK0QsS0FBSyxHQUFHTixZQUFZLENBQUNFLFVBQUQsQ0FEeEIsQ0FEeUMsQ0FJekM7O0FBQ0EsUUFBSUksS0FBSyxDQUFDLENBQUQsQ0FBTCxLQUFhLEdBQWpCLEVBQXNCO0FBQ3BCO0FBQ0Q7O0FBRURILElBQUFBLGNBQWMsR0FBR0EsY0FBYyxJQUFJRSxNQUFNLENBQUMsQ0FBRCxDQUFOLEtBQWMsR0FBakQ7QUFFQVYsSUFBQUEsTUFBTSxDQUFDbEMsSUFBUCxDQUFZNkMsS0FBWjtBQUNBSixJQUFBQSxVQUFVLEdBWitCLENBY3pDO0FBQ0E7O0FBQ0EsUUFBSUcsTUFBTSxDQUFDLENBQUQsQ0FBTixLQUFjLEdBQWxCLEVBQXVCO0FBQ3JCRCxNQUFBQSxVQUFVLEdBQUcsSUFBYjs7QUFFQSxhQUFPQyxNQUFNLENBQUMsQ0FBRCxDQUFOLEtBQWMsR0FBckIsRUFBMEI7QUFDeEJKLFFBQUFBLE9BQU8sQ0FBQ3hDLElBQVIsQ0FBYTRDLE1BQWI7QUFDQUEsUUFBQUEsTUFBTSxHQUFHUCxLQUFLLENBQUNqRSxLQUFOLENBQVksRUFBRWlFLEtBQUssQ0FBQ3ZELEtBQXBCLENBQVQ7QUFDRDtBQUNGOztBQUVELFFBQUkrRCxLQUFLLENBQUNDLE1BQU4sQ0FBYSxDQUFiLE1BQW9CRixNQUFNLENBQUNFLE1BQVAsQ0FBYyxDQUFkLENBQXhCLEVBQTBDO0FBQ3hDTixNQUFBQSxPQUFPLENBQUN4QyxJQUFSLENBQWE0QyxNQUFiO0FBQ0FQLE1BQUFBLEtBQUssQ0FBQ3ZELEtBQU47QUFDRCxLQUhELE1BR087QUFDTDZELE1BQUFBLFVBQVUsR0FBRyxJQUFiO0FBQ0Q7QUFDRjs7QUFFRCxNQUFJLENBQUNKLFlBQVksQ0FBQ0UsVUFBRCxDQUFaLElBQTRCLEVBQTdCLEVBQWlDLENBQWpDLE1BQXdDLEdBQXhDLElBQ0dDLGNBRFAsRUFDdUI7QUFDckJDLElBQUFBLFVBQVUsR0FBRyxJQUFiO0FBQ0Q7O0FBRUQsTUFBSUEsVUFBSixFQUFnQjtBQUNkLFdBQU9ILE9BQVA7QUFDRDs7QUFFRCxTQUFPQyxVQUFVLEdBQUdGLFlBQVksQ0FBQzdDLE1BQWpDLEVBQXlDO0FBQ3ZDd0MsSUFBQUEsTUFBTSxDQUFDbEMsSUFBUCxDQUFZdUMsWUFBWSxDQUFDRSxVQUFVLEVBQVgsQ0FBeEI7QUFDRDs7QUFFRCxTQUFPO0FBQ0xQLElBQUFBLE1BQU0sRUFBTkEsTUFESztBQUVMTSxJQUFBQSxPQUFPLEVBQVBBO0FBRkssR0FBUDtBQUlEOztBQUVELFNBQVNaLFVBQVQsQ0FBb0JZLE9BQXBCLEVBQTZCO0FBQzNCLFNBQU9BLE9BQU8sQ0FBQ08sTUFBUixDQUFlLFVBQVNDLElBQVQsRUFBZUosTUFBZixFQUF1QjtBQUMzQyxXQUFPSSxJQUFJLElBQUlKLE1BQU0sQ0FBQyxDQUFELENBQU4sS0FBYyxHQUE3QjtBQUNELEdBRk0sRUFFSixJQUZJLENBQVA7QUFHRDs7QUFDRCxTQUFTZCxrQkFBVCxDQUE0Qk8sS0FBNUIsRUFBbUNZLGFBQW5DLEVBQWtEQyxLQUFsRCxFQUF5RDtBQUN2RCxPQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdELEtBQXBCLEVBQTJCQyxDQUFDLEVBQTVCLEVBQWdDO0FBQzlCLFFBQUlDLGFBQWEsR0FBR0gsYUFBYSxDQUFDQSxhQUFhLENBQUN2RCxNQUFkLEdBQXVCd0QsS0FBdkIsR0FBK0JDLENBQWhDLENBQWIsQ0FBZ0RMLE1BQWhELENBQXVELENBQXZELENBQXBCOztBQUNBLFFBQUlULEtBQUssQ0FBQ2pFLEtBQU4sQ0FBWWlFLEtBQUssQ0FBQ3ZELEtBQU4sR0FBY3FFLENBQTFCLE1BQWlDLE1BQU1DLGFBQTNDLEVBQTBEO0FBQ3hELGFBQU8sS0FBUDtBQUNEO0FBQ0Y7O0FBRURmLEVBQUFBLEtBQUssQ0FBQ3ZELEtBQU4sSUFBZW9FLEtBQWY7QUFDQSxTQUFPLElBQVA7QUFDRDs7QUFFRCxTQUFTL0UsbUJBQVQsQ0FBNkJDLEtBQTdCLEVBQW9DO0FBQ2xDLE1BQUlDLFFBQVEsR0FBRyxDQUFmO0FBQ0EsTUFBSUMsUUFBUSxHQUFHLENBQWY7QUFFQUYsRUFBQUEsS0FBSyxDQUFDaUYsT0FBTixDQUFjLFVBQVNqQixJQUFULEVBQWU7QUFDM0IsUUFBSSxPQUFPQSxJQUFQLEtBQWdCLFFBQXBCLEVBQThCO0FBQzVCLFVBQUlrQixPQUFPLEdBQUduRixtQkFBbUIsQ0FBQ2lFLElBQUksQ0FBQzNELElBQU4sQ0FBakM7QUFDQSxVQUFJOEUsVUFBVSxHQUFHcEYsbUJBQW1CLENBQUNpRSxJQUFJLENBQUMxRCxNQUFOLENBQXBDOztBQUVBLFVBQUlMLFFBQVEsS0FBS0UsU0FBakIsRUFBNEI7QUFDMUIsWUFBSStFLE9BQU8sQ0FBQ2pGLFFBQVIsS0FBcUJrRixVQUFVLENBQUNsRixRQUFwQyxFQUE4QztBQUM1Q0EsVUFBQUEsUUFBUSxJQUFJaUYsT0FBTyxDQUFDakYsUUFBcEI7QUFDRCxTQUZELE1BRU87QUFDTEEsVUFBQUEsUUFBUSxHQUFHRSxTQUFYO0FBQ0Q7QUFDRjs7QUFFRCxVQUFJRCxRQUFRLEtBQUtDLFNBQWpCLEVBQTRCO0FBQzFCLFlBQUkrRSxPQUFPLENBQUNoRixRQUFSLEtBQXFCaUYsVUFBVSxDQUFDakYsUUFBcEMsRUFBOEM7QUFDNUNBLFVBQUFBLFFBQVEsSUFBSWdGLE9BQU8sQ0FBQ2hGLFFBQXBCO0FBQ0QsU0FGRCxNQUVPO0FBQ0xBLFVBQUFBLFFBQVEsR0FBR0MsU0FBWDtBQUNEO0FBQ0Y7QUFDRixLQW5CRCxNQW1CTztBQUNMLFVBQUlELFFBQVEsS0FBS0MsU0FBYixLQUEyQjZELElBQUksQ0FBQyxDQUFELENBQUosS0FBWSxHQUFaLElBQW1CQSxJQUFJLENBQUMsQ0FBRCxDQUFKLEtBQVksR0FBMUQsQ0FBSixFQUFvRTtBQUNsRTlELFFBQUFBLFFBQVE7QUFDVDs7QUFDRCxVQUFJRCxRQUFRLEtBQUtFLFNBQWIsS0FBMkI2RCxJQUFJLENBQUMsQ0FBRCxDQUFKLEtBQVksR0FBWixJQUFtQkEsSUFBSSxDQUFDLENBQUQsQ0FBSixLQUFZLEdBQTFELENBQUosRUFBb0U7QUFDbEUvRCxRQUFBQSxRQUFRO0FBQ1Q7QUFDRjtBQUNGLEdBNUJEO0FBOEJBLFNBQU87QUFBQ0EsSUFBQUEsUUFBUSxFQUFSQSxRQUFEO0FBQVdDLElBQUFBLFFBQVEsRUFBUkE7QUFBWCxHQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge3N0cnVjdHVyZWRQYXRjaH0gZnJvbSAnLi9jcmVhdGUnO1xuaW1wb3J0IHtwYXJzZVBhdGNofSBmcm9tICcuL3BhcnNlJztcblxuaW1wb3J0IHthcnJheUVxdWFsLCBhcnJheVN0YXJ0c1dpdGh9IGZyb20gJy4uL3V0aWwvYXJyYXknO1xuXG5leHBvcnQgZnVuY3Rpb24gY2FsY0xpbmVDb3VudChodW5rKSB7XG4gIGNvbnN0IHtvbGRMaW5lcywgbmV3TGluZXN9ID0gY2FsY09sZE5ld0xpbmVDb3VudChodW5rLmxpbmVzKTtcblxuICBpZiAob2xkTGluZXMgIT09IHVuZGVmaW5lZCkge1xuICAgIGh1bmsub2xkTGluZXMgPSBvbGRMaW5lcztcbiAgfSBlbHNlIHtcbiAgICBkZWxldGUgaHVuay5vbGRMaW5lcztcbiAgfVxuXG4gIGlmIChuZXdMaW5lcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaHVuay5uZXdMaW5lcyA9IG5ld0xpbmVzO1xuICB9IGVsc2Uge1xuICAgIGRlbGV0ZSBodW5rLm5ld0xpbmVzO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZShtaW5lLCB0aGVpcnMsIGJhc2UpIHtcbiAgbWluZSA9IGxvYWRQYXRjaChtaW5lLCBiYXNlKTtcbiAgdGhlaXJzID0gbG9hZFBhdGNoKHRoZWlycywgYmFzZSk7XG5cbiAgbGV0IHJldCA9IHt9O1xuXG4gIC8vIEZvciBpbmRleCB3ZSBqdXN0IGxldCBpdCBwYXNzIHRocm91Z2ggYXMgaXQgZG9lc24ndCBoYXZlIGFueSBuZWNlc3NhcnkgbWVhbmluZy5cbiAgLy8gTGVhdmluZyBzYW5pdHkgY2hlY2tzIG9uIHRoaXMgdG8gdGhlIEFQSSBjb25zdW1lciB0aGF0IG1heSBrbm93IG1vcmUgYWJvdXQgdGhlXG4gIC8vIG1lYW5pbmcgaW4gdGhlaXIgb3duIGNvbnRleHQuXG4gIGlmIChtaW5lLmluZGV4IHx8IHRoZWlycy5pbmRleCkge1xuICAgIHJldC5pbmRleCA9IG1pbmUuaW5kZXggfHwgdGhlaXJzLmluZGV4O1xuICB9XG5cbiAgaWYgKG1pbmUubmV3RmlsZU5hbWUgfHwgdGhlaXJzLm5ld0ZpbGVOYW1lKSB7XG4gICAgaWYgKCFmaWxlTmFtZUNoYW5nZWQobWluZSkpIHtcbiAgICAgIC8vIE5vIGhlYWRlciBvciBubyBjaGFuZ2UgaW4gb3VycywgdXNlIHRoZWlycyAoYW5kIG91cnMgaWYgdGhlaXJzIGRvZXMgbm90IGV4aXN0KVxuICAgICAgcmV0Lm9sZEZpbGVOYW1lID0gdGhlaXJzLm9sZEZpbGVOYW1lIHx8IG1pbmUub2xkRmlsZU5hbWU7XG4gICAgICByZXQubmV3RmlsZU5hbWUgPSB0aGVpcnMubmV3RmlsZU5hbWUgfHwgbWluZS5uZXdGaWxlTmFtZTtcbiAgICAgIHJldC5vbGRIZWFkZXIgPSB0aGVpcnMub2xkSGVhZGVyIHx8IG1pbmUub2xkSGVhZGVyO1xuICAgICAgcmV0Lm5ld0hlYWRlciA9IHRoZWlycy5uZXdIZWFkZXIgfHwgbWluZS5uZXdIZWFkZXI7XG4gICAgfSBlbHNlIGlmICghZmlsZU5hbWVDaGFuZ2VkKHRoZWlycykpIHtcbiAgICAgIC8vIE5vIGhlYWRlciBvciBubyBjaGFuZ2UgaW4gdGhlaXJzLCB1c2Ugb3Vyc1xuICAgICAgcmV0Lm9sZEZpbGVOYW1lID0gbWluZS5vbGRGaWxlTmFtZTtcbiAgICAgIHJldC5uZXdGaWxlTmFtZSA9IG1pbmUubmV3RmlsZU5hbWU7XG4gICAgICByZXQub2xkSGVhZGVyID0gbWluZS5vbGRIZWFkZXI7XG4gICAgICByZXQubmV3SGVhZGVyID0gbWluZS5uZXdIZWFkZXI7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEJvdGggY2hhbmdlZC4uLiBmaWd1cmUgaXQgb3V0XG4gICAgICByZXQub2xkRmlsZU5hbWUgPSBzZWxlY3RGaWVsZChyZXQsIG1pbmUub2xkRmlsZU5hbWUsIHRoZWlycy5vbGRGaWxlTmFtZSk7XG4gICAgICByZXQubmV3RmlsZU5hbWUgPSBzZWxlY3RGaWVsZChyZXQsIG1pbmUubmV3RmlsZU5hbWUsIHRoZWlycy5uZXdGaWxlTmFtZSk7XG4gICAgICByZXQub2xkSGVhZGVyID0gc2VsZWN0RmllbGQocmV0LCBtaW5lLm9sZEhlYWRlciwgdGhlaXJzLm9sZEhlYWRlcik7XG4gICAgICByZXQubmV3SGVhZGVyID0gc2VsZWN0RmllbGQocmV0LCBtaW5lLm5ld0hlYWRlciwgdGhlaXJzLm5ld0hlYWRlcik7XG4gICAgfVxuICB9XG5cbiAgcmV0Lmh1bmtzID0gW107XG5cbiAgbGV0IG1pbmVJbmRleCA9IDAsXG4gICAgICB0aGVpcnNJbmRleCA9IDAsXG4gICAgICBtaW5lT2Zmc2V0ID0gMCxcbiAgICAgIHRoZWlyc09mZnNldCA9IDA7XG5cbiAgd2hpbGUgKG1pbmVJbmRleCA8IG1pbmUuaHVua3MubGVuZ3RoIHx8IHRoZWlyc0luZGV4IDwgdGhlaXJzLmh1bmtzLmxlbmd0aCkge1xuICAgIGxldCBtaW5lQ3VycmVudCA9IG1pbmUuaHVua3NbbWluZUluZGV4XSB8fCB7b2xkU3RhcnQ6IEluZmluaXR5fSxcbiAgICAgICAgdGhlaXJzQ3VycmVudCA9IHRoZWlycy5odW5rc1t0aGVpcnNJbmRleF0gfHwge29sZFN0YXJ0OiBJbmZpbml0eX07XG5cbiAgICBpZiAoaHVua0JlZm9yZShtaW5lQ3VycmVudCwgdGhlaXJzQ3VycmVudCkpIHtcbiAgICAgIC8vIFRoaXMgcGF0Y2ggZG9lcyBub3Qgb3ZlcmxhcCB3aXRoIGFueSBvZiB0aGUgb3RoZXJzLCB5YXkuXG4gICAgICByZXQuaHVua3MucHVzaChjbG9uZUh1bmsobWluZUN1cnJlbnQsIG1pbmVPZmZzZXQpKTtcbiAgICAgIG1pbmVJbmRleCsrO1xuICAgICAgdGhlaXJzT2Zmc2V0ICs9IG1pbmVDdXJyZW50Lm5ld0xpbmVzIC0gbWluZUN1cnJlbnQub2xkTGluZXM7XG4gICAgfSBlbHNlIGlmIChodW5rQmVmb3JlKHRoZWlyc0N1cnJlbnQsIG1pbmVDdXJyZW50KSkge1xuICAgICAgLy8gVGhpcyBwYXRjaCBkb2VzIG5vdCBvdmVybGFwIHdpdGggYW55IG9mIHRoZSBvdGhlcnMsIHlheS5cbiAgICAgIHJldC5odW5rcy5wdXNoKGNsb25lSHVuayh0aGVpcnNDdXJyZW50LCB0aGVpcnNPZmZzZXQpKTtcbiAgICAgIHRoZWlyc0luZGV4Kys7XG4gICAgICBtaW5lT2Zmc2V0ICs9IHRoZWlyc0N1cnJlbnQubmV3TGluZXMgLSB0aGVpcnNDdXJyZW50Lm9sZExpbmVzO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBPdmVybGFwLCBtZXJnZSBhcyBiZXN0IHdlIGNhblxuICAgICAgbGV0IG1lcmdlZEh1bmsgPSB7XG4gICAgICAgIG9sZFN0YXJ0OiBNYXRoLm1pbihtaW5lQ3VycmVudC5vbGRTdGFydCwgdGhlaXJzQ3VycmVudC5vbGRTdGFydCksXG4gICAgICAgIG9sZExpbmVzOiAwLFxuICAgICAgICBuZXdTdGFydDogTWF0aC5taW4obWluZUN1cnJlbnQubmV3U3RhcnQgKyBtaW5lT2Zmc2V0LCB0aGVpcnNDdXJyZW50Lm9sZFN0YXJ0ICsgdGhlaXJzT2Zmc2V0KSxcbiAgICAgICAgbmV3TGluZXM6IDAsXG4gICAgICAgIGxpbmVzOiBbXVxuICAgICAgfTtcbiAgICAgIG1lcmdlTGluZXMobWVyZ2VkSHVuaywgbWluZUN1cnJlbnQub2xkU3RhcnQsIG1pbmVDdXJyZW50LmxpbmVzLCB0aGVpcnNDdXJyZW50Lm9sZFN0YXJ0LCB0aGVpcnNDdXJyZW50LmxpbmVzKTtcbiAgICAgIHRoZWlyc0luZGV4Kys7XG4gICAgICBtaW5lSW5kZXgrKztcblxuICAgICAgcmV0Lmh1bmtzLnB1c2gobWVyZ2VkSHVuayk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJldDtcbn1cblxuZnVuY3Rpb24gbG9hZFBhdGNoKHBhcmFtLCBiYXNlKSB7XG4gIGlmICh0eXBlb2YgcGFyYW0gPT09ICdzdHJpbmcnKSB7XG4gICAgaWYgKCgvXkBAL20pLnRlc3QocGFyYW0pIHx8ICgoL15JbmRleDovbSkudGVzdChwYXJhbSkpKSB7XG4gICAgICByZXR1cm4gcGFyc2VQYXRjaChwYXJhbSlbMF07XG4gICAgfVxuXG4gICAgaWYgKCFiYXNlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ011c3QgcHJvdmlkZSBhIGJhc2UgcmVmZXJlbmNlIG9yIHBhc3MgaW4gYSBwYXRjaCcpO1xuICAgIH1cbiAgICByZXR1cm4gc3RydWN0dXJlZFBhdGNoKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBiYXNlLCBwYXJhbSk7XG4gIH1cblxuICByZXR1cm4gcGFyYW07XG59XG5cbmZ1bmN0aW9uIGZpbGVOYW1lQ2hhbmdlZChwYXRjaCkge1xuICByZXR1cm4gcGF0Y2gubmV3RmlsZU5hbWUgJiYgcGF0Y2gubmV3RmlsZU5hbWUgIT09IHBhdGNoLm9sZEZpbGVOYW1lO1xufVxuXG5mdW5jdGlvbiBzZWxlY3RGaWVsZChpbmRleCwgbWluZSwgdGhlaXJzKSB7XG4gIGlmIChtaW5lID09PSB0aGVpcnMpIHtcbiAgICByZXR1cm4gbWluZTtcbiAgfSBlbHNlIHtcbiAgICBpbmRleC5jb25mbGljdCA9IHRydWU7XG4gICAgcmV0dXJuIHttaW5lLCB0aGVpcnN9O1xuICB9XG59XG5cbmZ1bmN0aW9uIGh1bmtCZWZvcmUodGVzdCwgY2hlY2spIHtcbiAgcmV0dXJuIHRlc3Qub2xkU3RhcnQgPCBjaGVjay5vbGRTdGFydFxuICAgICYmICh0ZXN0Lm9sZFN0YXJ0ICsgdGVzdC5vbGRMaW5lcykgPCBjaGVjay5vbGRTdGFydDtcbn1cblxuZnVuY3Rpb24gY2xvbmVIdW5rKGh1bmssIG9mZnNldCkge1xuICByZXR1cm4ge1xuICAgIG9sZFN0YXJ0OiBodW5rLm9sZFN0YXJ0LCBvbGRMaW5lczogaHVuay5vbGRMaW5lcyxcbiAgICBuZXdTdGFydDogaHVuay5uZXdTdGFydCArIG9mZnNldCwgbmV3TGluZXM6IGh1bmsubmV3TGluZXMsXG4gICAgbGluZXM6IGh1bmsubGluZXNcbiAgfTtcbn1cblxuZnVuY3Rpb24gbWVyZ2VMaW5lcyhodW5rLCBtaW5lT2Zmc2V0LCBtaW5lTGluZXMsIHRoZWlyT2Zmc2V0LCB0aGVpckxpbmVzKSB7XG4gIC8vIFRoaXMgd2lsbCBnZW5lcmFsbHkgcmVzdWx0IGluIGEgY29uZmxpY3RlZCBodW5rLCBidXQgdGhlcmUgYXJlIGNhc2VzIHdoZXJlIHRoZSBjb250ZXh0XG4gIC8vIGlzIHRoZSBvbmx5IG92ZXJsYXAgd2hlcmUgd2UgY2FuIHN1Y2Nlc3NmdWxseSBtZXJnZSB0aGUgY29udGVudCBoZXJlLlxuICBsZXQgbWluZSA9IHtvZmZzZXQ6IG1pbmVPZmZzZXQsIGxpbmVzOiBtaW5lTGluZXMsIGluZGV4OiAwfSxcbiAgICAgIHRoZWlyID0ge29mZnNldDogdGhlaXJPZmZzZXQsIGxpbmVzOiB0aGVpckxpbmVzLCBpbmRleDogMH07XG5cbiAgLy8gSGFuZGxlIGFueSBsZWFkaW5nIGNvbnRlbnRcbiAgaW5zZXJ0TGVhZGluZyhodW5rLCBtaW5lLCB0aGVpcik7XG4gIGluc2VydExlYWRpbmcoaHVuaywgdGhlaXIsIG1pbmUpO1xuXG4gIC8vIE5vdyBpbiB0aGUgb3ZlcmxhcCBjb250ZW50LiBTY2FuIHRocm91Z2ggYW5kIHNlbGVjdCB0aGUgYmVzdCBjaGFuZ2VzIGZyb20gZWFjaC5cbiAgd2hpbGUgKG1pbmUuaW5kZXggPCBtaW5lLmxpbmVzLmxlbmd0aCAmJiB0aGVpci5pbmRleCA8IHRoZWlyLmxpbmVzLmxlbmd0aCkge1xuICAgIGxldCBtaW5lQ3VycmVudCA9IG1pbmUubGluZXNbbWluZS5pbmRleF0sXG4gICAgICAgIHRoZWlyQ3VycmVudCA9IHRoZWlyLmxpbmVzW3RoZWlyLmluZGV4XTtcblxuICAgIGlmICgobWluZUN1cnJlbnRbMF0gPT09ICctJyB8fCBtaW5lQ3VycmVudFswXSA9PT0gJysnKVxuICAgICAgICAmJiAodGhlaXJDdXJyZW50WzBdID09PSAnLScgfHwgdGhlaXJDdXJyZW50WzBdID09PSAnKycpKSB7XG4gICAgICAvLyBCb3RoIG1vZGlmaWVkIC4uLlxuICAgICAgbXV0dWFsQ2hhbmdlKGh1bmssIG1pbmUsIHRoZWlyKTtcbiAgICB9IGVsc2UgaWYgKG1pbmVDdXJyZW50WzBdID09PSAnKycgJiYgdGhlaXJDdXJyZW50WzBdID09PSAnICcpIHtcbiAgICAgIC8vIE1pbmUgaW5zZXJ0ZWRcbiAgICAgIGh1bmsubGluZXMucHVzaCguLi4gY29sbGVjdENoYW5nZShtaW5lKSk7XG4gICAgfSBlbHNlIGlmICh0aGVpckN1cnJlbnRbMF0gPT09ICcrJyAmJiBtaW5lQ3VycmVudFswXSA9PT0gJyAnKSB7XG4gICAgICAvLyBUaGVpcnMgaW5zZXJ0ZWRcbiAgICAgIGh1bmsubGluZXMucHVzaCguLi4gY29sbGVjdENoYW5nZSh0aGVpcikpO1xuICAgIH0gZWxzZSBpZiAobWluZUN1cnJlbnRbMF0gPT09ICctJyAmJiB0aGVpckN1cnJlbnRbMF0gPT09ICcgJykge1xuICAgICAgLy8gTWluZSByZW1vdmVkIG9yIGVkaXRlZFxuICAgICAgcmVtb3ZhbChodW5rLCBtaW5lLCB0aGVpcik7XG4gICAgfSBlbHNlIGlmICh0aGVpckN1cnJlbnRbMF0gPT09ICctJyAmJiBtaW5lQ3VycmVudFswXSA9PT0gJyAnKSB7XG4gICAgICAvLyBUaGVpciByZW1vdmVkIG9yIGVkaXRlZFxuICAgICAgcmVtb3ZhbChodW5rLCB0aGVpciwgbWluZSwgdHJ1ZSk7XG4gICAgfSBlbHNlIGlmIChtaW5lQ3VycmVudCA9PT0gdGhlaXJDdXJyZW50KSB7XG4gICAgICAvLyBDb250ZXh0IGlkZW50aXR5XG4gICAgICBodW5rLmxpbmVzLnB1c2gobWluZUN1cnJlbnQpO1xuICAgICAgbWluZS5pbmRleCsrO1xuICAgICAgdGhlaXIuaW5kZXgrKztcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQ29udGV4dCBtaXNtYXRjaFxuICAgICAgY29uZmxpY3QoaHVuaywgY29sbGVjdENoYW5nZShtaW5lKSwgY29sbGVjdENoYW5nZSh0aGVpcikpO1xuICAgIH1cbiAgfVxuXG4gIC8vIE5vdyBwdXNoIGFueXRoaW5nIHRoYXQgbWF5IGJlIHJlbWFpbmluZ1xuICBpbnNlcnRUcmFpbGluZyhodW5rLCBtaW5lKTtcbiAgaW5zZXJ0VHJhaWxpbmcoaHVuaywgdGhlaXIpO1xuXG4gIGNhbGNMaW5lQ291bnQoaHVuayk7XG59XG5cbmZ1bmN0aW9uIG11dHVhbENoYW5nZShodW5rLCBtaW5lLCB0aGVpcikge1xuICBsZXQgbXlDaGFuZ2VzID0gY29sbGVjdENoYW5nZShtaW5lKSxcbiAgICAgIHRoZWlyQ2hhbmdlcyA9IGNvbGxlY3RDaGFuZ2UodGhlaXIpO1xuXG4gIGlmIChhbGxSZW1vdmVzKG15Q2hhbmdlcykgJiYgYWxsUmVtb3Zlcyh0aGVpckNoYW5nZXMpKSB7XG4gICAgLy8gU3BlY2lhbCBjYXNlIGZvciByZW1vdmUgY2hhbmdlcyB0aGF0IGFyZSBzdXBlcnNldHMgb2Ygb25lIGFub3RoZXJcbiAgICBpZiAoYXJyYXlTdGFydHNXaXRoKG15Q2hhbmdlcywgdGhlaXJDaGFuZ2VzKVxuICAgICAgICAmJiBza2lwUmVtb3ZlU3VwZXJzZXQodGhlaXIsIG15Q2hhbmdlcywgbXlDaGFuZ2VzLmxlbmd0aCAtIHRoZWlyQ2hhbmdlcy5sZW5ndGgpKSB7XG4gICAgICBodW5rLmxpbmVzLnB1c2goLi4uIG15Q2hhbmdlcyk7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIGlmIChhcnJheVN0YXJ0c1dpdGgodGhlaXJDaGFuZ2VzLCBteUNoYW5nZXMpXG4gICAgICAgICYmIHNraXBSZW1vdmVTdXBlcnNldChtaW5lLCB0aGVpckNoYW5nZXMsIHRoZWlyQ2hhbmdlcy5sZW5ndGggLSBteUNoYW5nZXMubGVuZ3RoKSkge1xuICAgICAgaHVuay5saW5lcy5wdXNoKC4uLiB0aGVpckNoYW5nZXMpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfSBlbHNlIGlmIChhcnJheUVxdWFsKG15Q2hhbmdlcywgdGhlaXJDaGFuZ2VzKSkge1xuICAgIGh1bmsubGluZXMucHVzaCguLi4gbXlDaGFuZ2VzKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25mbGljdChodW5rLCBteUNoYW5nZXMsIHRoZWlyQ2hhbmdlcyk7XG59XG5cbmZ1bmN0aW9uIHJlbW92YWwoaHVuaywgbWluZSwgdGhlaXIsIHN3YXApIHtcbiAgbGV0IG15Q2hhbmdlcyA9IGNvbGxlY3RDaGFuZ2UobWluZSksXG4gICAgICB0aGVpckNoYW5nZXMgPSBjb2xsZWN0Q29udGV4dCh0aGVpciwgbXlDaGFuZ2VzKTtcbiAgaWYgKHRoZWlyQ2hhbmdlcy5tZXJnZWQpIHtcbiAgICBodW5rLmxpbmVzLnB1c2goLi4uIHRoZWlyQ2hhbmdlcy5tZXJnZWQpO1xuICB9IGVsc2Uge1xuICAgIGNvbmZsaWN0KGh1bmssIHN3YXAgPyB0aGVpckNoYW5nZXMgOiBteUNoYW5nZXMsIHN3YXAgPyBteUNoYW5nZXMgOiB0aGVpckNoYW5nZXMpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNvbmZsaWN0KGh1bmssIG1pbmUsIHRoZWlyKSB7XG4gIGh1bmsuY29uZmxpY3QgPSB0cnVlO1xuICBodW5rLmxpbmVzLnB1c2goe1xuICAgIGNvbmZsaWN0OiB0cnVlLFxuICAgIG1pbmU6IG1pbmUsXG4gICAgdGhlaXJzOiB0aGVpclxuICB9KTtcbn1cblxuZnVuY3Rpb24gaW5zZXJ0TGVhZGluZyhodW5rLCBpbnNlcnQsIHRoZWlyKSB7XG4gIHdoaWxlIChpbnNlcnQub2Zmc2V0IDwgdGhlaXIub2Zmc2V0ICYmIGluc2VydC5pbmRleCA8IGluc2VydC5saW5lcy5sZW5ndGgpIHtcbiAgICBsZXQgbGluZSA9IGluc2VydC5saW5lc1tpbnNlcnQuaW5kZXgrK107XG4gICAgaHVuay5saW5lcy5wdXNoKGxpbmUpO1xuICAgIGluc2VydC5vZmZzZXQrKztcbiAgfVxufVxuZnVuY3Rpb24gaW5zZXJ0VHJhaWxpbmcoaHVuaywgaW5zZXJ0KSB7XG4gIHdoaWxlIChpbnNlcnQuaW5kZXggPCBpbnNlcnQubGluZXMubGVuZ3RoKSB7XG4gICAgbGV0IGxpbmUgPSBpbnNlcnQubGluZXNbaW5zZXJ0LmluZGV4KytdO1xuICAgIGh1bmsubGluZXMucHVzaChsaW5lKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjb2xsZWN0Q2hhbmdlKHN0YXRlKSB7XG4gIGxldCByZXQgPSBbXSxcbiAgICAgIG9wZXJhdGlvbiA9IHN0YXRlLmxpbmVzW3N0YXRlLmluZGV4XVswXTtcbiAgd2hpbGUgKHN0YXRlLmluZGV4IDwgc3RhdGUubGluZXMubGVuZ3RoKSB7XG4gICAgbGV0IGxpbmUgPSBzdGF0ZS5saW5lc1tzdGF0ZS5pbmRleF07XG5cbiAgICAvLyBHcm91cCBhZGRpdGlvbnMgdGhhdCBhcmUgaW1tZWRpYXRlbHkgYWZ0ZXIgc3VidHJhY3Rpb25zIGFuZCB0cmVhdCB0aGVtIGFzIG9uZSBcImF0b21pY1wiIG1vZGlmeSBjaGFuZ2UuXG4gICAgaWYgKG9wZXJhdGlvbiA9PT0gJy0nICYmIGxpbmVbMF0gPT09ICcrJykge1xuICAgICAgb3BlcmF0aW9uID0gJysnO1xuICAgIH1cblxuICAgIGlmIChvcGVyYXRpb24gPT09IGxpbmVbMF0pIHtcbiAgICAgIHJldC5wdXNoKGxpbmUpO1xuICAgICAgc3RhdGUuaW5kZXgrKztcbiAgICB9IGVsc2Uge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJldDtcbn1cbmZ1bmN0aW9uIGNvbGxlY3RDb250ZXh0KHN0YXRlLCBtYXRjaENoYW5nZXMpIHtcbiAgbGV0IGNoYW5nZXMgPSBbXSxcbiAgICAgIG1lcmdlZCA9IFtdLFxuICAgICAgbWF0Y2hJbmRleCA9IDAsXG4gICAgICBjb250ZXh0Q2hhbmdlcyA9IGZhbHNlLFxuICAgICAgY29uZmxpY3RlZCA9IGZhbHNlO1xuICB3aGlsZSAobWF0Y2hJbmRleCA8IG1hdGNoQ2hhbmdlcy5sZW5ndGhcbiAgICAgICAgJiYgc3RhdGUuaW5kZXggPCBzdGF0ZS5saW5lcy5sZW5ndGgpIHtcbiAgICBsZXQgY2hhbmdlID0gc3RhdGUubGluZXNbc3RhdGUuaW5kZXhdLFxuICAgICAgICBtYXRjaCA9IG1hdGNoQ2hhbmdlc1ttYXRjaEluZGV4XTtcblxuICAgIC8vIE9uY2Ugd2UndmUgaGl0IG91ciBhZGQsIHRoZW4gd2UgYXJlIGRvbmVcbiAgICBpZiAobWF0Y2hbMF0gPT09ICcrJykge1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgY29udGV4dENoYW5nZXMgPSBjb250ZXh0Q2hhbmdlcyB8fCBjaGFuZ2VbMF0gIT09ICcgJztcblxuICAgIG1lcmdlZC5wdXNoKG1hdGNoKTtcbiAgICBtYXRjaEluZGV4Kys7XG5cbiAgICAvLyBDb25zdW1lIGFueSBhZGRpdGlvbnMgaW4gdGhlIG90aGVyIGJsb2NrIGFzIGEgY29uZmxpY3QgdG8gYXR0ZW1wdFxuICAgIC8vIHRvIHB1bGwgaW4gdGhlIHJlbWFpbmluZyBjb250ZXh0IGFmdGVyIHRoaXNcbiAgICBpZiAoY2hhbmdlWzBdID09PSAnKycpIHtcbiAgICAgIGNvbmZsaWN0ZWQgPSB0cnVlO1xuXG4gICAgICB3aGlsZSAoY2hhbmdlWzBdID09PSAnKycpIHtcbiAgICAgICAgY2hhbmdlcy5wdXNoKGNoYW5nZSk7XG4gICAgICAgIGNoYW5nZSA9IHN0YXRlLmxpbmVzWysrc3RhdGUuaW5kZXhdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChtYXRjaC5zdWJzdHIoMSkgPT09IGNoYW5nZS5zdWJzdHIoMSkpIHtcbiAgICAgIGNoYW5nZXMucHVzaChjaGFuZ2UpO1xuICAgICAgc3RhdGUuaW5kZXgrKztcbiAgICB9IGVsc2Uge1xuICAgICAgY29uZmxpY3RlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgaWYgKChtYXRjaENoYW5nZXNbbWF0Y2hJbmRleF0gfHwgJycpWzBdID09PSAnKydcbiAgICAgICYmIGNvbnRleHRDaGFuZ2VzKSB7XG4gICAgY29uZmxpY3RlZCA9IHRydWU7XG4gIH1cblxuICBpZiAoY29uZmxpY3RlZCkge1xuICAgIHJldHVybiBjaGFuZ2VzO1xuICB9XG5cbiAgd2hpbGUgKG1hdGNoSW5kZXggPCBtYXRjaENoYW5nZXMubGVuZ3RoKSB7XG4gICAgbWVyZ2VkLnB1c2gobWF0Y2hDaGFuZ2VzW21hdGNoSW5kZXgrK10pO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBtZXJnZWQsXG4gICAgY2hhbmdlc1xuICB9O1xufVxuXG5mdW5jdGlvbiBhbGxSZW1vdmVzKGNoYW5nZXMpIHtcbiAgcmV0dXJuIGNoYW5nZXMucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGNoYW5nZSkge1xuICAgIHJldHVybiBwcmV2ICYmIGNoYW5nZVswXSA9PT0gJy0nO1xuICB9LCB0cnVlKTtcbn1cbmZ1bmN0aW9uIHNraXBSZW1vdmVTdXBlcnNldChzdGF0ZSwgcmVtb3ZlQ2hhbmdlcywgZGVsdGEpIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBkZWx0YTsgaSsrKSB7XG4gICAgbGV0IGNoYW5nZUNvbnRlbnQgPSByZW1vdmVDaGFuZ2VzW3JlbW92ZUNoYW5nZXMubGVuZ3RoIC0gZGVsdGEgKyBpXS5zdWJzdHIoMSk7XG4gICAgaWYgKHN0YXRlLmxpbmVzW3N0YXRlLmluZGV4ICsgaV0gIT09ICcgJyArIGNoYW5nZUNvbnRlbnQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBzdGF0ZS5pbmRleCArPSBkZWx0YTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGNhbGNPbGROZXdMaW5lQ291bnQobGluZXMpIHtcbiAgbGV0IG9sZExpbmVzID0gMDtcbiAgbGV0IG5ld0xpbmVzID0gMDtcblxuICBsaW5lcy5mb3JFYWNoKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICBpZiAodHlwZW9mIGxpbmUgIT09ICdzdHJpbmcnKSB7XG4gICAgICBsZXQgbXlDb3VudCA9IGNhbGNPbGROZXdMaW5lQ291bnQobGluZS5taW5lKTtcbiAgICAgIGxldCB0aGVpckNvdW50ID0gY2FsY09sZE5ld0xpbmVDb3VudChsaW5lLnRoZWlycyk7XG5cbiAgICAgIGlmIChvbGRMaW5lcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChteUNvdW50Lm9sZExpbmVzID09PSB0aGVpckNvdW50Lm9sZExpbmVzKSB7XG4gICAgICAgICAgb2xkTGluZXMgKz0gbXlDb3VudC5vbGRMaW5lcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvbGRMaW5lcyA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAobmV3TGluZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAobXlDb3VudC5uZXdMaW5lcyA9PT0gdGhlaXJDb3VudC5uZXdMaW5lcykge1xuICAgICAgICAgIG5ld0xpbmVzICs9IG15Q291bnQubmV3TGluZXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3TGluZXMgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKG5ld0xpbmVzICE9PSB1bmRlZmluZWQgJiYgKGxpbmVbMF0gPT09ICcrJyB8fCBsaW5lWzBdID09PSAnICcpKSB7XG4gICAgICAgIG5ld0xpbmVzKys7XG4gICAgICB9XG4gICAgICBpZiAob2xkTGluZXMgIT09IHVuZGVmaW5lZCAmJiAobGluZVswXSA9PT0gJy0nIHx8IGxpbmVbMF0gPT09ICcgJykpIHtcbiAgICAgICAgb2xkTGluZXMrKztcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB7b2xkTGluZXMsIG5ld0xpbmVzfTtcbn1cbiJdfQ==


/***/ }),

/***/ 5870:
/***/ ((__unused_webpack_module, exports) => {

/*istanbul ignore start*/


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.parsePatch = parsePatch;

/*istanbul ignore end*/
function parsePatch(uniDiff) {
  /*istanbul ignore start*/
  var
  /*istanbul ignore end*/
  options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var diffstr = uniDiff.split(/\r\n|[\n\v\f\r\x85]/),
      delimiters = uniDiff.match(/\r\n|[\n\v\f\r\x85]/g) || [],
      list = [],
      i = 0;

  function parseIndex() {
    var index = {};
    list.push(index); // Parse diff metadata

    while (i < diffstr.length) {
      var line = diffstr[i]; // File header found, end parsing diff metadata

      if (/^(\-\-\-|\+\+\+|@@)\s/.test(line)) {
        break;
      } // Diff index


      var header = /^(?:Index:|diff(?: -r \w+)+)\s+(.+?)\s*$/.exec(line);

      if (header) {
        index.index = header[1];
      }

      i++;
    } // Parse file headers if they are defined. Unified diff requires them, but
    // there's no technical issues to have an isolated hunk without file header


    parseFileHeader(index);
    parseFileHeader(index); // Parse hunks

    index.hunks = [];

    while (i < diffstr.length) {
      var _line = diffstr[i];

      if (/^(Index:|diff|\-\-\-|\+\+\+)\s/.test(_line)) {
        break;
      } else if (/^@@/.test(_line)) {
        index.hunks.push(parseHunk());
      } else if (_line && options.strict) {
        // Ignore unexpected content unless in strict mode
        throw new Error('Unknown line ' + (i + 1) + ' ' + JSON.stringify(_line));
      } else {
        i++;
      }
    }
  } // Parses the --- and +++ headers, if none are found, no lines
  // are consumed.


  function parseFileHeader(index) {
    var fileHeader = /^(---|\+\+\+)\s+(.*)$/.exec(diffstr[i]);

    if (fileHeader) {
      var keyPrefix = fileHeader[1] === '---' ? 'old' : 'new';
      var data = fileHeader[2].split('\t', 2);
      var fileName = data[0].replace(/\\\\/g, '\\');

      if (/^".*"$/.test(fileName)) {
        fileName = fileName.substr(1, fileName.length - 2);
      }

      index[keyPrefix + 'FileName'] = fileName;
      index[keyPrefix + 'Header'] = (data[1] || '').trim();
      i++;
    }
  } // Parses a hunk
  // This assumes that we are at the start of a hunk.


  function parseHunk() {
    var chunkHeaderIndex = i,
        chunkHeaderLine = diffstr[i++],
        chunkHeader = chunkHeaderLine.split(/@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);
    var hunk = {
      oldStart: +chunkHeader[1],
      oldLines: +chunkHeader[2] || 1,
      newStart: +chunkHeader[3],
      newLines: +chunkHeader[4] || 1,
      lines: [],
      linedelimiters: []
    };
    var addCount = 0,
        removeCount = 0;

    for (; i < diffstr.length; i++) {
      // Lines starting with '---' could be mistaken for the "remove line" operation
      // But they could be the header for the next file. Therefore prune such cases out.
      if (diffstr[i].indexOf('--- ') === 0 && i + 2 < diffstr.length && diffstr[i + 1].indexOf('+++ ') === 0 && diffstr[i + 2].indexOf('@@') === 0) {
        break;
      }

      var operation = diffstr[i].length == 0 && i != diffstr.length - 1 ? ' ' : diffstr[i][0];

      if (operation === '+' || operation === '-' || operation === ' ' || operation === '\\') {
        hunk.lines.push(diffstr[i]);
        hunk.linedelimiters.push(delimiters[i] || '\n');

        if (operation === '+') {
          addCount++;
        } else if (operation === '-') {
          removeCount++;
        } else if (operation === ' ') {
          addCount++;
          removeCount++;
        }
      } else {
        break;
      }
    } // Handle the empty block count case


    if (!addCount && hunk.newLines === 1) {
      hunk.newLines = 0;
    }

    if (!removeCount && hunk.oldLines === 1) {
      hunk.oldLines = 0;
    } // Perform optional sanity checking


    if (options.strict) {
      if (addCount !== hunk.newLines) {
        throw new Error('Added line count did not match for hunk at line ' + (chunkHeaderIndex + 1));
      }

      if (removeCount !== hunk.oldLines) {
        throw new Error('Removed line count did not match for hunk at line ' + (chunkHeaderIndex + 1));
      }
    }

    return hunk;
  }

  while (i < diffstr.length) {
    parseIndex();
  }

  return list;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wYXRjaC9wYXJzZS5qcyJdLCJuYW1lcyI6WyJwYXJzZVBhdGNoIiwidW5pRGlmZiIsIm9wdGlvbnMiLCJkaWZmc3RyIiwic3BsaXQiLCJkZWxpbWl0ZXJzIiwibWF0Y2giLCJsaXN0IiwiaSIsInBhcnNlSW5kZXgiLCJpbmRleCIsInB1c2giLCJsZW5ndGgiLCJsaW5lIiwidGVzdCIsImhlYWRlciIsImV4ZWMiLCJwYXJzZUZpbGVIZWFkZXIiLCJodW5rcyIsInBhcnNlSHVuayIsInN0cmljdCIsIkVycm9yIiwiSlNPTiIsInN0cmluZ2lmeSIsImZpbGVIZWFkZXIiLCJrZXlQcmVmaXgiLCJkYXRhIiwiZmlsZU5hbWUiLCJyZXBsYWNlIiwic3Vic3RyIiwidHJpbSIsImNodW5rSGVhZGVySW5kZXgiLCJjaHVua0hlYWRlckxpbmUiLCJjaHVua0hlYWRlciIsImh1bmsiLCJvbGRTdGFydCIsIm9sZExpbmVzIiwibmV3U3RhcnQiLCJuZXdMaW5lcyIsImxpbmVzIiwibGluZWRlbGltaXRlcnMiLCJhZGRDb3VudCIsInJlbW92ZUNvdW50IiwiaW5kZXhPZiIsIm9wZXJhdGlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQU8sU0FBU0EsVUFBVCxDQUFvQkMsT0FBcEIsRUFBMkM7QUFBQTtBQUFBO0FBQUE7QUFBZEMsRUFBQUEsT0FBYyx1RUFBSixFQUFJO0FBQ2hELE1BQUlDLE9BQU8sR0FBR0YsT0FBTyxDQUFDRyxLQUFSLENBQWMscUJBQWQsQ0FBZDtBQUFBLE1BQ0lDLFVBQVUsR0FBR0osT0FBTyxDQUFDSyxLQUFSLENBQWMsc0JBQWQsS0FBeUMsRUFEMUQ7QUFBQSxNQUVJQyxJQUFJLEdBQUcsRUFGWDtBQUFBLE1BR0lDLENBQUMsR0FBRyxDQUhSOztBQUtBLFdBQVNDLFVBQVQsR0FBc0I7QUFDcEIsUUFBSUMsS0FBSyxHQUFHLEVBQVo7QUFDQUgsSUFBQUEsSUFBSSxDQUFDSSxJQUFMLENBQVVELEtBQVYsRUFGb0IsQ0FJcEI7O0FB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QVUsc0RBQXNEVSxnQkFBZ0IsR0FBRyxDQUF6RSxDQUFWLENBQU47QUFDRDs7QUFDRCxVQUFJVyxXQUFXLEtBQUtSLElBQUksQ0FBQ0UsUUFBekIsRUFBbUM7QUFDakMsY0FBTSxJQUFJZixLQUFKLENBQVUsd0RBQXdEVSxnQkFBZ0IsR0FBRyxDQUEzRSxDQUFWLENBQU47QUFDRDtBQUNGOztBQUVELFdBQU9HLElBQVA7QUFDRDs7QUFFRCxTQUFPMUIsQ0FBQyxHQUFHTCxPQUFPLENBQUNTLE1BQW5CLEVBQTJCO0FBQ3pCSCxJQUFBQSxVQUFVO0FBQ1g7O0FBRUQsU0FBT0YsSUFBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIHBhcnNlUGF0Y2godW5pRGlmZiwgb3B0aW9ucyA9IHt9KSB7XG4gIGxldCBkaWZmc3RyID0gdW5pRGlmZi5zcGxpdCgvXFxyXFxufFtcXG5cXHZcXGZcXHJcXHg4NV0vKSxcbiAgICAgIGRlbGltaXRlcnMgPSB1bmlEaWZmLm1hdGNoKC9cXHJcXG58W1xcblxcdlxcZlxcclxceDg1XS9nKSB8fCBbXSxcbiAgICAgIGxpc3QgPSBbXSxcbiAgICAgIGkgPSAwO1xuXG4gIGZ1bmN0aW9uIHBhcnNlSW5kZXgoKSB7XG4gICAgbGV0IGluZGV4ID0ge307XG4gICAgbGlzdC5wdXNoKGluZGV4KTtcblxuICAgIC8vIFBhcnNlIGRpZmYgbWV0YWRhdGFcbiAgICB3aGlsZSAoaSA8IGRpZmZzdHIubGVuZ3RoKSB7XG4gICAgICBsZXQgbGluZSA9IGRpZmZzdHJbaV07XG5cbiAgICAgIC8vIEZpbGUgaGVhZGVyIGZvdW5kLCBlbmQgcGFyc2luZyBkaWZmIG1ldGFkYXRhXG4gICAgICBpZiAoKC9eKFxcLVxcLVxcLXxcXCtcXCtcXCt8QEApXFxzLykudGVzdChsaW5lKSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgLy8gRGlmZiBpbmRleFxuICAgICAgbGV0IGhlYWRlciA9ICgvXig/OkluZGV4OnxkaWZmKD86IC1yIFxcdyspKylcXHMrKC4rPylcXHMqJC8pLmV4ZWMobGluZSk7XG4gICAgICBpZiAoaGVhZGVyKSB7XG4gICAgICAgIGluZGV4LmluZGV4ID0gaGVhZGVyWzFdO1xuICAgICAgfVxuXG4gICAgICBpKys7XG4gICAgfVxuXG4gICAgLy8gUGFyc2UgZmlsZSBoZWFkZXJzIGlmIHRoZXkgYXJlIGRlZmluZWQuIFVuaWZpZWQgZGlmZiByZXF1aXJlcyB0aGVtLCBidXRcbiAgICAvLyB0aGVyZSdzIG5vIHRlY2huaWNhbCBpc3N1ZXMgdG8gaGF2ZSBhbiBpc29sYXRlZCBodW5rIHdpdGhvdXQgZmlsZSBoZWFkZXJcbiAgICBwYXJzZUZpbGVIZWFkZXIoaW5kZXgpO1xuICAgIHBhcnNlRmlsZUhlYWRlcihpbmRleCk7XG5cbiAgICAvLyBQYXJzZSBodW5rc1xuICAgIGluZGV4Lmh1bmtzID0gW107XG5cbiAgICB3aGlsZSAoaSA8IGRpZmZzdHIubGVuZ3RoKSB7XG4gICAgICBsZXQgbGluZSA9IGRpZmZzdHJbaV07XG5cbiAgICAgIGlmICgoL14oSW5kZXg6fGRpZmZ8XFwtXFwtXFwtfFxcK1xcK1xcKylcXHMvKS50ZXN0KGxpbmUpKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfSBlbHNlIGlmICgoL15AQC8pLnRlc3QobGluZSkpIHtcbiAgICAgICAgaW5kZXguaHVua3MucHVzaChwYXJzZUh1bmsoKSk7XG4gICAgICB9IGVsc2UgaWYgKGxpbmUgJiYgb3B0aW9ucy5zdHJpY3QpIHtcbiAgICAgICAgLy8gSWdub3JlIHVuZXhwZWN0ZWQgY29udGVudCB1bmxlc3MgaW4gc3RyaWN0IG1vZGVcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGxpbmUgJyArIChpICsgMSkgKyAnICcgKyBKU09OLnN0cmluZ2lmeShsaW5lKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpKys7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gUGFyc2VzIHRoZSAtLS0gYW5kICsrKyBoZWFkZXJzLCBpZiBub25lIGFyZSBmb3VuZCwgbm8gbGluZXNcbiAgLy8gYXJlIGNvbnN1bWVkLlxuICBmdW5jdGlvbiBwYXJzZUZpbGVIZWFkZXIoaW5kZXgpIHtcbiAgICBjb25zdCBmaWxlSGVhZGVyID0gKC9eKC0tLXxcXCtcXCtcXCspXFxzKyguKikkLykuZXhlYyhkaWZmc3RyW2ldKTtcbiAgICBpZiAoZmlsZUhlYWRlcikge1xuICAgICAgbGV0IGtleVByZWZpeCA9IGZpbGVIZWFkZXJbMV0gPT09ICctLS0nID8gJ29sZCcgOiAnbmV3JztcbiAgICAgIGNvbnN0IGRhdGEgPSBmaWxlSGVhZGVyWzJdLnNwbGl0KCdcXHQnLCAyKTtcbiAgICAgIGxldCBmaWxlTmFtZSA9IGRhdGFbMF0ucmVwbGFjZSgvXFxcXFxcXFwvZywgJ1xcXFwnKTtcbiAgICAgIGlmICgoL15cIi4qXCIkLykudGVzdChmaWxlTmFtZSkpIHtcbiAgICAgICAgZmlsZU5hbWUgPSBmaWxlTmFtZS5zdWJzdHIoMSwgZmlsZU5hbWUubGVuZ3RoIC0gMik7XG4gICAgICB9XG4gICAgICBpbmRleFtrZXlQcmVmaXggKyAnRmlsZU5hbWUnXSA9IGZpbGVOYW1lO1xuICAgICAgaW5kZXhba2V5UHJlZml4ICsgJ0hlYWRlciddID0gKGRhdGFbMV0gfHwgJycpLnRyaW0oKTtcblxuICAgICAgaSsrO1xuICAgIH1cbiAgfVxuXG4gIC8vIFBhcnNlcyBhIGh1bmtcbiAgLy8gVGhpcyBhc3N1bWVzIHRoYXQgd2UgYXJlIGF0IHRoZSBzdGFydCBvZiBhIGh1bmsuXG4gIGZ1bmN0aW9uIHBhcnNlSHVuaygpIHtcbiAgICBsZXQgY2h1bmtIZWFkZXJJbmRleCA9IGksXG4gICAgICAgIGNodW5rSGVhZGVyTGluZSA9IGRpZmZzdHJbaSsrXSxcbiAgICAgICAgY2h1bmtIZWFkZXIgPSBjaHVua0hlYWRlckxpbmUuc3BsaXQoL0BAIC0oXFxkKykoPzosKFxcZCspKT8gXFwrKFxcZCspKD86LChcXGQrKSk/IEBALyk7XG5cbiAgICBsZXQgaHVuayA9IHtcbiAgICAgIG9sZFN0YXJ0OiArY2h1bmtIZWFkZXJbMV0sXG4gICAgICBvbGRMaW5lczogK2NodW5rSGVhZGVyWzJdIHx8IDEsXG4gICAgICBuZXdTdGFydDogK2NodW5rSGVhZGVyWzNdLFxuICAgICAgbmV3TGluZXM6ICtjaHVua0hlYWRlcls0XSB8fCAxLFxuICAgICAgbGluZXM6IFtdLFxuICAgICAgbGluZWRlbGltaXRlcnM6IFtdXG4gICAgfTtcblxuICAgIGxldCBhZGRDb3VudCA9IDAsXG4gICAgICAgIHJlbW92ZUNvdW50ID0gMDtcbiAgICBmb3IgKDsgaSA8IGRpZmZzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vIExpbmVzIHN0YXJ0aW5nIHdpdGggJy0tLScgY291bGQgYmUgbWlzdGFrZW4gZm9yIHRoZSBcInJlbW92ZSBsaW5lXCIgb3BlcmF0aW9uXG4gICAgICAvLyBCdXQgdGhleSBjb3VsZCBiZSB0aGUgaGVhZGVyIGZvciB0aGUgbmV4dCBmaWxlLiBUaGVyZWZvcmUgcHJ1bmUgc3VjaCBjYXNlcyBvdXQuXG4gICAgICBpZiAoZGlmZnN0cltpXS5pbmRleE9mKCctLS0gJykgPT09IDBcbiAgICAgICAgICAgICYmIChpICsgMiA8IGRpZmZzdHIubGVuZ3RoKVxuICAgICAgICAgICAgJiYgZGlmZnN0cltpICsgMV0uaW5kZXhPZignKysrICcpID09PSAwXG4gICAgICAgICAgICAmJiBkaWZmc3RyW2kgKyAyXS5pbmRleE9mKCdAQCcpID09PSAwKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBsZXQgb3BlcmF0aW9uID0gKGRpZmZzdHJbaV0ubGVuZ3RoID09IDAgJiYgaSAhPSAoZGlmZnN0ci5sZW5ndGggLSAxKSkgPyAnICcgOiBkaWZmc3RyW2ldWzBdO1xuXG4gICAgICBpZiAob3BlcmF0aW9uID09PSAnKycgfHwgb3BlcmF0aW9uID09PSAnLScgfHwgb3BlcmF0aW9uID09PSAnICcgfHwgb3BlcmF0aW9uID09PSAnXFxcXCcpIHtcbiAgICAgICAgaHVuay5saW5lcy5wdXNoKGRpZmZzdHJbaV0pO1xuICAgICAgICBodW5rLmxpbmVkZWxpbWl0ZXJzLnB1c2goZGVsaW1pdGVyc1tpXSB8fCAnXFxuJyk7XG5cbiAgICAgICAgaWYgKG9wZXJhdGlvbiA9PT0gJysnKSB7XG4gICAgICAgICAgYWRkQ291bnQrKztcbiAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09ICctJykge1xuICAgICAgICAgIHJlbW92ZUNvdW50Kys7XG4gICAgICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSAnICcpIHtcbiAgICAgICAgICBhZGRDb3VudCsrO1xuICAgICAgICAgIHJlbW92ZUNvdW50Kys7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEhhbmRsZSB0aGUgZW1wdHkgYmxvY2sgY291bnQgY2FzZVxuICAgIGlmICghYWRkQ291bnQgJiYgaHVuay5uZXdMaW5lcyA9PT0gMSkge1xuICAgICAgaHVuay5uZXdMaW5lcyA9IDA7XG4gICAgfVxuICAgIGlmICghcmVtb3ZlQ291bnQgJiYgaHVuay5vbGRMaW5lcyA9PT0gMSkge1xuICAgICAgaHVuay5vbGRMaW5lcyA9IDA7XG4gICAgfVxuXG4gICAgLy8gUGVyZm9ybSBvcHRpb25hbCBzYW5pdHkgY2hlY2tpbmdcbiAgICBpZiAob3B0aW9ucy5zdHJpY3QpIHtcbiAgICAgIGlmIChhZGRDb3VudCAhPT0gaHVuay5uZXdMaW5lcykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FkZGVkIGxpbmUgY291bnQgZGlkIG5vdCBtYXRjaCBmb3IgaHVuayBhdCBsaW5lICcgKyAoY2h1bmtIZWFkZXJJbmRleCArIDEpKTtcbiAgICAgIH1cbiAgICAgIGlmIChyZW1vdmVDb3VudCAhPT0gaHVuay5vbGRMaW5lcykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlbW92ZWQgbGluZSBjb3VudCBkaWQgbm90IG1hdGNoIGZvciBodW5rIGF0IGxpbmUgJyArIChjaHVua0hlYWRlckluZGV4ICsgMSkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBodW5rO1xuICB9XG5cbiAgd2hpbGUgKGkgPCBkaWZmc3RyLmxlbmd0aCkge1xuICAgIHBhcnNlSW5kZXgoKTtcbiAgfVxuXG4gIHJldHVybiBsaXN0O1xufVxuIl19


/***/ }),

/***/ 8935:
/***/ ((__unused_webpack_module, exports) => {

/*istanbul ignore start*/


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.arrayEqual = arrayEqual;
exports.arrayStartsWith = arrayStartsWith;

/*istanbul ignore end*/
function arrayEqual(a, b) {
  if (a.length !== b.length) {
    return false;
  }

  return arrayStartsWith(a, b);
}

function arrayStartsWith(array, start) {
  if (start.length > array.length) {
    return false;
  }

  for (var i = 0; i < start.length; i++) {
    if (start[i] !== array[i]) {
      return false;
    }
  }

  return true;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL2FycmF5LmpzIl0sIm5hbWVzIjpbImFycmF5RXF1YWwiLCJhIiwiYiIsImxlbmd0aCIsImFycmF5U3RhcnRzV2l0aCIsImFycmF5Iiwic3RhcnQiLCJpIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQU8sU0FBU0EsVUFBVCxDQUFvQkMsQ0FBcEIsRUFBdUJDLENBQXZCLEVBQTBCO0FBQy9CLE1BQUlELENBQUMsQ0FBQ0UsTUFBRixLQUFhRCxDQUFDLENBQUNDLE1BQW5CLEVBQTJCO0FBQ3pCLFdBQU8sS0FBUDtBQUNEOztBQUVELFNBQU9DLGVBQWUsQ0FBQ0gsQ0FBRCxFQUFJQyxDQUFKLENBQXRCO0FBQ0Q7O0FBRU0sU0FBU0UsZUFBVCxDQUF5QkMsS0FBekIsRUFBZ0NDLEtBQWhDLEVBQXVDO0FBQzVDLE1BQUlBLEtBQUssQ0FBQ0gsTUFBTixHQUFlRSxLQUFLLENBQUNGLE1BQXpCLEVBQWlDO0FBQy9CLFdBQU8sS0FBUDtBQUNEOztBQUVELE9BQUssSUFBSUksQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0QsS0FBSyxDQUFDSCxNQUExQixFQUFrQ0ksQ0FBQyxFQUFuQyxFQUF1QztBQUNyQyxRQUFJRCxLQUFLLENBQUNDLENBQUQsQ0FBTCxLQUFhRixLQUFLLENBQUNFLENBQUQsQ0FBdEIsRUFBMkI7QUFDekIsYUFBTyxLQUFQO0FBQ0Q7QUFDRjs7QUFFRCxTQUFPLElBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBhcnJheUVxdWFsKGEsIGIpIHtcbiAgaWYgKGEubGVuZ3RoICE9PSBiLmxlbmd0aCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBhcnJheVN0YXJ0c1dpdGgoYSwgYik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcnJheVN0YXJ0c1dpdGgoYXJyYXksIHN0YXJ0KSB7XG4gIGlmIChzdGFydC5sZW5ndGggPiBhcnJheS5sZW5ndGgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHN0YXJ0Lmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0YXJ0W2ldICE9PSBhcnJheVtpXSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuIl19


/***/ }),

/***/ 5512:
/***/ ((__unused_webpack_module, exports) => {

/*istanbul ignore start*/


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = _default;

/*istanbul ignore end*/
// Iterator that traverses in the range of [min, max], stepping
// by distance from a given start position. I.e. for [0, 4], with
// start of 2, this will iterate 2, 3, 1, 4, 0.
function
/*istanbul ignore start*/
_default
/*istanbul ignore end*/
(start, minLine, maxLine) {
  var wantForward = true,
      backwardExhausted = false,
      forwardExhausted = false,
      localOffset = 1;
  return function iterator() {
    if (wantForward && !forwardExhausted) {
      if (backwardExhausted) {
        localOffset++;
      } else {
        wantForward = false;
      } // Check if trying to fit beyond text length, and if not, check it fits
      // after offset location (or desired location on first iteration)


      if (start + localOffset <= maxLine) {
        return localOffset;
      }

      forwardExhausted = true;
    }

    if (!backwardExhausted) {
      if (!forwardExhausted) {
        wantForward = true;
      } // Check if trying to fit before text beginning, and if not, check it fits
      // before offset location


      if (minLine <= start - localOffset) {
        return -localOffset++;
      }

      backwardExhausted = true;
      return iterator();
    } // We tried to fit hunk before text beginning and beyond text length, then
    // hunk can't fit on the text. Return undefined

  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL2Rpc3RhbmNlLWl0ZXJhdG9yLmpzIl0sIm5hbWVzIjpbInN0YXJ0IiwibWluTGluZSIsIm1heExpbmUiLCJ3YW50Rm9yd2FyZCIsImJhY2t3YXJkRXhoYXVzdGVkIiwiZm9yd2FyZEV4aGF1c3RlZCIsImxvY2FsT2Zmc2V0IiwiaXRlcmF0b3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNlO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FBU0EsS0FBVCxFQUFnQkMsT0FBaEIsRUFBeUJDLE9BQXpCLEVBQWtDO0FBQy9DLE1BQUlDLFdBQVcsR0FBRyxJQUFsQjtBQUFBLE1BQ0lDLGlCQUFpQixHQUFHLEtBRHhCO0FBQUEsTUFFSUMsZ0JBQWdCLEdBQUcsS0FGdkI7QUFBQSxNQUdJQyxXQUFXLEdBQUcsQ0FIbEI7QUFLQSxTQUFPLFNBQVNDLFFBQVQsR0FBb0I7QUFDekIsUUFBSUosV0FBVyxJQUFJLENBQUNFLGdCQUFwQixFQUFzQztBQUNwQyxVQUFJRCxpQkFBSixFQUF1QjtBQUNyQkUsUUFBQUEsV0FBVztBQUNaLE9BRkQsTUFFTztBQUNMSCxRQUFBQSxXQUFXLEdBQUcsS0FBZDtBQUNELE9BTG1DLENBT3BDO0FBQ0E7OztBQUNBLFVBQUlILEtBQUssR0FBR00sV0FBUixJQUF1QkosT0FBM0IsRUFBb0M7QUFDbEMsZUFBT0ksV0FBUDtBQUNEOztBQUVERCxNQUFBQSxnQkFBZ0IsR0FBRyxJQUFuQjtBQUNEOztBQUVELFFBQUksQ0FBQ0QsaUJBQUwsRUFBd0I7QUFDdEIsVUFBSSxDQUFDQyxnQkFBTCxFQUF1QjtBQUNyQkYsUUFBQUEsV0FBVyxHQUFHLElBQWQ7QUFDRCxPQUhxQixDQUt0QjtBQUNBOzs7QUFDQSxVQUFJRixPQUFPLElBQUlELEtBQUssR0FBR00sV0FBdkIsRUFBb0M7QUFDbEMsZUFBTyxDQUFDQSxXQUFXLEVBQW5CO0FBQ0Q7O0FBRURGLE1BQUFBLGlCQUFpQixHQUFHLElBQXBCO0FBQ0EsYUFBT0csUUFBUSxFQUFmO0FBQ0QsS0E5QndCLENBZ0N6QjtBQUNBOztBQUNELEdBbENEO0FBbUNEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gSXRlcmF0b3IgdGhhdCB0cmF2ZXJzZXMgaW4gdGhlIHJhbmdlIG9mIFttaW4sIG1heF0sIHN0ZXBwaW5nXG4vLyBieSBkaXN0YW5jZSBmcm9tIGEgZ2l2ZW4gc3RhcnQgcG9zaXRpb24uIEkuZS4gZm9yIFswLCA0XSwgd2l0aFxuLy8gc3RhcnQgb2YgMiwgdGhpcyB3aWxsIGl0ZXJhdGUgMiwgMywgMSwgNCwgMC5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHN0YXJ0LCBtaW5MaW5lLCBtYXhMaW5lKSB7XG4gIGxldCB3YW50Rm9yd2FyZCA9IHRydWUsXG4gICAgICBiYWNrd2FyZEV4aGF1c3RlZCA9IGZhbHNlLFxuICAgICAgZm9yd2FyZEV4aGF1c3RlZCA9IGZhbHNlLFxuICAgICAgbG9jYWxPZmZzZXQgPSAxO1xuXG4gIHJldHVybiBmdW5jdGlvbiBpdGVyYXRvcigpIHtcbiAgICBpZiAod2FudEZvcndhcmQgJiYgIWZvcndhcmRFeGhhdXN0ZWQpIHtcbiAgICAgIGlmIChiYWNrd2FyZEV4aGF1c3RlZCkge1xuICAgICAgICBsb2NhbE9mZnNldCsrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2FudEZvcndhcmQgPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgLy8gQ2hlY2sgaWYgdHJ5aW5nIHRvIGZpdCBiZXlvbmQgdGV4dCBsZW5ndGgsIGFuZCBpZiBub3QsIGNoZWNrIGl0IGZpdHNcbiAgICAgIC8vIGFmdGVyIG9mZnNldCBsb2NhdGlvbiAob3IgZGVzaXJlZCBsb2NhdGlvbiBvbiBmaXJzdCBpdGVyYXRpb24pXG4gICAgICBpZiAoc3RhcnQgKyBsb2NhbE9mZnNldCA8PSBtYXhMaW5lKSB7XG4gICAgICAgIHJldHVybiBsb2NhbE9mZnNldDtcbiAgICAgIH1cblxuICAgICAgZm9yd2FyZEV4aGF1c3RlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKCFiYWNrd2FyZEV4aGF1c3RlZCkge1xuICAgICAgaWYgKCFmb3J3YXJkRXhoYXVzdGVkKSB7XG4gICAgICAgIHdhbnRGb3J3YXJkID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgLy8gQ2hlY2sgaWYgdHJ5aW5nIHRvIGZpdCBiZWZvcmUgdGV4dCBiZWdpbm5pbmcsIGFuZCBpZiBub3QsIGNoZWNrIGl0IGZpdHNcbiAgICAgIC8vIGJlZm9yZSBvZmZzZXQgbG9jYXRpb25cbiAgICAgIGlmIChtaW5MaW5lIDw9IHN0YXJ0IC0gbG9jYWxPZmZzZXQpIHtcbiAgICAgICAgcmV0dXJuIC1sb2NhbE9mZnNldCsrO1xuICAgICAgfVxuXG4gICAgICBiYWNrd2FyZEV4aGF1c3RlZCA9IHRydWU7XG4gICAgICByZXR1cm4gaXRlcmF0b3IoKTtcbiAgICB9XG5cbiAgICAvLyBXZSB0cmllZCB0byBmaXQgaHVuayBiZWZvcmUgdGV4dCBiZWdpbm5pbmcgYW5kIGJleW9uZCB0ZXh0IGxlbmd0aCwgdGhlblxuICAgIC8vIGh1bmsgY2FuJ3QgZml0IG9uIHRoZSB0ZXh0LiBSZXR1cm4gdW5kZWZpbmVkXG4gIH07XG59XG4iXX0=


/***/ }),

/***/ 5704:
/***/ ((__unused_webpack_module, exports) => {

/*istanbul ignore start*/


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.generateOptions = generateOptions;

/*istanbul ignore end*/
function generateOptions(options, defaults) {
  if (typeof options === 'function') {
    defaults.callback = options;
  } else if (options) {
    for (var name in options) {
      /* istanbul ignore else */
      if (options.hasOwnProperty(name)) {
        defaults[name] = options[name];
      }
    }
  }

  return defaults;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL3BhcmFtcy5qcyJdLCJuYW1lcyI6WyJnZW5lcmF0ZU9wdGlvbnMiLCJvcHRpb25zIiwiZGVmYXVsdHMiLCJjYWxsYmFjayIsIm5hbWUiLCJoYXNPd25Qcm9wZXJ0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQU8sU0FBU0EsZUFBVCxDQUF5QkMsT0FBekIsRUFBa0NDLFFBQWxDLEVBQTRDO0FBQ2pELE1BQUksT0FBT0QsT0FBUCxLQUFtQixVQUF2QixFQUFtQztBQUNqQ0MsSUFBQUEsUUFBUSxDQUFDQyxRQUFULEdBQW9CRixPQUFwQjtBQUNELEdBRkQsTUFFTyxJQUFJQSxPQUFKLEVBQWE7QUFDbEIsU0FBSyxJQUFJRyxJQUFULElBQWlCSCxPQUFqQixFQUEwQjtBQUN4QjtBQUNBLFVBQUlBLE9BQU8sQ0FBQ0ksY0FBUixDQUF1QkQsSUFBdkIsQ0FBSixFQUFrQztBQUNoQ0YsUUFBQUEsUUFBUSxDQUFDRSxJQUFELENBQVIsR0FBaUJILE9BQU8sQ0FBQ0csSUFBRCxDQUF4QjtBQUNEO0FBQ0Y7QUFDRjs7QUFDRCxTQUFPRixRQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVPcHRpb25zKG9wdGlvbnMsIGRlZmF1bHRzKSB7XG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGRlZmF1bHRzLmNhbGxiYWNrID0gb3B0aW9ucztcbiAgfSBlbHNlIGlmIChvcHRpb25zKSB7XG4gICAgZm9yIChsZXQgbmFtZSBpbiBvcHRpb25zKSB7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgaWYgKG9wdGlvbnMuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgZGVmYXVsdHNbbmFtZV0gPSBvcHRpb25zW25hbWVdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZGVmYXVsdHM7XG59XG4iXX0=


/***/ }),

/***/ 1381:
/***/ ((module, exports) => {

// ISC @ Julien Fontanet



// ===================================================================

var construct = typeof Reflect !== "undefined" ? Reflect.construct : undefined;
var defineProperty = Object.defineProperty;

// -------------------------------------------------------------------

var captureStackTrace = Error.captureStackTrace;
if (captureStackTrace === undefined) {
  captureStackTrace = function captureStackTrace(error) {
    var container = new Error();

    defineProperty(error, "stack", {
      configurable: true,
      get: function getStack() {
        var stack = container.stack;

        // Replace property with value for faster future accesses.
        defineProperty(this, "stack", {
          configurable: true,
          value: stack,
          writable: true,
        });

        return stack;
      },
      set: function setStack(stack) {
        defineProperty(error, "stack", {
          configurable: true,
          value: stack,
          writable: true,
        });
      },
    });
  };
}

// -------------------------------------------------------------------

function BaseError(message) {
  if (message !== undefined) {
    defineProperty(this, "message", {
      configurable: true,
      value: message,
      writable: true,
    });
  }

  var cname = this.constructor.name;
  if (cname !== undefined && cname !== this.name) {
    defineProperty(this, "name", {
      configurable: true,
      value: cname,
      writable: true,
    });
  }

  captureStackTrace(this, this.constructor);
}

BaseError.prototype = Object.create(Error.prototype, {
  // See: https://github.com/JsCommunity/make-error/issues/4
  constructor: {
    configurable: true,
    value: BaseError,
    writable: true,
  },
});

// -------------------------------------------------------------------

// Sets the name of a function if possible (depends of the JS engine).
var setFunctionName = (function() {
  function setFunctionName(fn, name) {
    return defineProperty(fn, "name", {
      configurable: true,
      value: name,
    });
  }
  try {
    var f = function() {};
    setFunctionName(f, "foo");
    if (f.name === "foo") {
      return setFunctionName;
    }
  } catch (_) {}
})();

// -------------------------------------------------------------------

function makeError(constructor, super_) {
  if (super_ == null || super_ === Error) {
    super_ = BaseError;
  } else if (typeof super_ !== "function") {
    throw new TypeError("super_ should be a function");
  }

  var name;
  if (typeof constructor === "string") {
    name = constructor;
    constructor =
      construct !== undefined
        ? function() {
            return construct(super_, arguments, this.constructor);
          }
        : function() {
            super_.apply(this, arguments);
          };

    // If the name can be set, do it once and for all.
    if (setFunctionName !== undefined) {
      setFunctionName(constructor, name);
      name = undefined;
    }
  } else if (typeof constructor !== "function") {
    throw new TypeError("constructor should be either a string or a function");
  }

  // Also register the super constructor also as `constructor.super_` just
  // like Node's `util.inherits()`.
  //
  // eslint-disable-next-line dot-notation
  constructor.super_ = constructor["super"] = super_;

  var properties = {
    constructor: {
      configurable: true,
      value: constructor,
      writable: true,
    },
  };

  // If the name could not be set on the constructor, set it on the
  // prototype.
  if (name !== undefined) {
    properties.name = {
      configurable: true,
      value: name,
      writable: true,
    };
  }
  constructor.prototype = Object.create(super_.prototype, properties);

  return constructor;
}
exports = module.exports = makeError;
exports.BaseError = BaseError;


/***/ }),

/***/ 8375:
/***/ ((module) => {

// Copied from https://github.com/nodejs/node/blob/master/lib/internal/constants.js
module.exports = {
  CHAR_FORWARD_SLASH: 47, /* / */
};


/***/ }),

/***/ 1858:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



const path = __nccwpck_require__(1017);

exports.codes = {
  ERR_INPUT_TYPE_NOT_ALLOWED: createErrorCtor(joinArgs('ERR_INPUT_TYPE_NOT_ALLOWED')),
  ERR_INVALID_ARG_VALUE: createErrorCtor(joinArgs('ERR_INVALID_ARG_VALUE')),
  ERR_INVALID_MODULE_SPECIFIER: createErrorCtor(joinArgs('ERR_INVALID_MODULE_SPECIFIER')),
  ERR_INVALID_PACKAGE_CONFIG: createErrorCtor(joinArgs('ERR_INVALID_PACKAGE_CONFIG')),
  ERR_INVALID_PACKAGE_TARGET: createErrorCtor(joinArgs('ERR_INVALID_PACKAGE_TARGET')),
  ERR_MANIFEST_DEPENDENCY_MISSING: createErrorCtor(joinArgs('ERR_MANIFEST_DEPENDENCY_MISSING')),
  ERR_MODULE_NOT_FOUND: createErrorCtor((path, base, type = 'package') => {
    return `Cannot find ${type} '${path}' imported from ${base}`
  }),
  ERR_PACKAGE_IMPORT_NOT_DEFINED: createErrorCtor(joinArgs('ERR_PACKAGE_IMPORT_NOT_DEFINED')),
  ERR_PACKAGE_PATH_NOT_EXPORTED: createErrorCtor(joinArgs('ERR_PACKAGE_PATH_NOT_EXPORTED')),
  ERR_UNSUPPORTED_DIR_IMPORT: createErrorCtor(joinArgs('ERR_UNSUPPORTED_DIR_IMPORT')),
  ERR_UNSUPPORTED_ESM_URL_SCHEME: createErrorCtor(joinArgs('ERR_UNSUPPORTED_ESM_URL_SCHEME')),
  ERR_UNKNOWN_FILE_EXTENSION: createErrorCtor(joinArgs('ERR_UNKNOWN_FILE_EXTENSION')),
}

function joinArgs(name) {
  return (...args) => {
    return [name, ...args].join(' ')
  }
}

function createErrorCtor(errorMessageCreator) {
  return class CustomError extends Error {
    constructor(...args) {
      super(errorMessageCreator(...args))
    }
  }
}
exports.createErrRequireEsm = createErrRequireEsm;

// Native ERR_REQUIRE_ESM Error is declared here:
//   https://github.com/nodejs/node/blob/2d5d77306f6dff9110c1f77fefab25f973415770/lib/internal/errors.js#L1294-L1313
// Error class factory is implemented here:
//   function E: https://github.com/nodejs/node/blob/2d5d77306f6dff9110c1f77fefab25f973415770/lib/internal/errors.js#L323-L341
//   function makeNodeErrorWithCode: https://github.com/nodejs/node/blob/2d5d77306f6dff9110c1f77fefab25f973415770/lib/internal/errors.js#L251-L278
// The code below should create an error that matches the native error as closely as possible.
// Third-party libraries which attempt to catch the native ERR_REQUIRE_ESM should recognize our imitation error.
function createErrRequireEsm(filename, parentPath, packageJsonPath) {
  const code = 'ERR_REQUIRE_ESM'
  const err = new Error(getErrRequireEsmMessage(filename, parentPath, packageJsonPath))
  // Set `name` to be used in stack trace, generate stack trace with that name baked in, then re-declare the `name` field.
  // This trick is copied from node's source.
  err.name = `Error [${ code }]`
  err.stack
  Object.defineProperty(err, 'name', {
    value: 'Error',
    enumerable: false,
    writable: true,
    configurable: true
  })
  err.code = code
  return err
}

// Copy-pasted from https://github.com/nodejs/node/blob/b533fb3508009e5f567cc776daba8fbf665386a6/lib/internal/errors.js#L1293-L1311
// so that our error message is identical to the native message.
function getErrRequireEsmMessage(filename, parentPath = null, packageJsonPath = null) {
  const ext = path.extname(filename)
  let msg = `Must use import to load ES Module: ${filename}`;
  if (parentPath && packageJsonPath) {
    const path = __nccwpck_require__(1017);
    const basename = path.basename(filename) === path.basename(parentPath) ?
      filename : path.basename(filename);
    msg +=
      '\nrequire() of ES modules is not supported.\nrequire() of ' +
      `${filename} ${parentPath ? `from ${parentPath} ` : ''}` +
      `is an ES module file as it is a ${ext} file whose nearest parent ` +
      `package.json contains "type": "module" which defines all ${ext} ` +
      'files in that package scope as ES modules.\nInstead ' +
      'change the requiring code to use ' +
      'import(), or remove "type": "module" from ' +
      `${packageJsonPath}.\n`;
    return msg;
  }
  return msg;
}


/***/ }),

/***/ 6755:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

// Copied from https://github.com/nodejs/node/blob/v17.0.1/lib/internal/modules/cjs/helpers.js



const {
  ArrayPrototypeForEach,
  ObjectDefineProperty,
  ObjectPrototypeHasOwnProperty,
  SafeSet,
  StringPrototypeIncludes,
  StringPrototypeStartsWith,
} = __nccwpck_require__(6326);

const { getOptionValue } = __nccwpck_require__(690);
const userConditions = getOptionValue('--conditions');

const noAddons = getOptionValue('--no-addons');
const addonConditions = noAddons ? [] : ['node-addons'];

// TODO: Use this set when resolving pkg#exports conditions in loader.js.
const cjsConditions = new SafeSet([
  'require',
  'node',
  ...addonConditions,
  ...userConditions,
]);

/**
 * @param {any} object
 * @param {string} [dummyModuleName]
 * @return {void}
 */
function addBuiltinLibsToObject(object, dummyModuleName) {
  // Make built-in modules available directly (loaded lazily).
  const Module = (__nccwpck_require__(8188).Module);
  const { builtinModules } = Module;

  // To require built-in modules in user-land and ignore modules whose
  // `canBeRequiredByUsers` is false. So we create a dummy module object and not
  // use `require()` directly.
  const dummyModule = new Module(dummyModuleName);

  ArrayPrototypeForEach(builtinModules, (name) => {
    // Neither add underscored modules, nor ones that contain slashes (e.g.,
    // 'fs/promises') or ones that are already defined.
    if (StringPrototypeStartsWith(name, '_') ||
        StringPrototypeIncludes(name, '/') ||
        ObjectPrototypeHasOwnProperty(object, name)) {
      return;
    }
    // Goals of this mechanism are:
    // - Lazy loading of built-in modules
    // - Having all built-in modules available as non-enumerable properties
    // - Allowing the user to re-assign these variables as if there were no
    //   pre-existing globals with the same name.

    const setReal = (val) => {
      // Deleting the property before re-assigning it disables the
      // getter/setter mechanism.
      delete object[name];
      object[name] = val;
    };

    ObjectDefineProperty(object, name, {
      get: () => {
        // Node 12 hack; remove when we drop node12 support
        const lib = (dummyModule.require || require)(name);

        // Disable the current getter/setter and set up a new
        // non-enumerable property.
        delete object[name];
        ObjectDefineProperty(object, name, {
          get: () => lib,
          set: setReal,
          configurable: true,
          enumerable: false
        });

        return lib;
      },
      set: setReal,
      configurable: true,
      enumerable: false
    });
  });
}

exports.addBuiltinLibsToObject = addBuiltinLibsToObject;
exports.cjsConditions = cjsConditions;


/***/ }),

/***/ 1633:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// Copied from several files in node's source code.
// https://github.com/nodejs/node/blob/2d5d77306f6dff9110c1f77fefab25f973415770/lib/internal/modules/cjs/loader.js
// Each function and variable below must have a comment linking to the source in node's github repo.



const {
  ArrayIsArray,
  ArrayPrototypeIncludes,
  ArrayPrototypeJoin,
  ArrayPrototypePush,
  JSONParse,
  ObjectKeys,
  RegExpPrototypeTest,
  SafeMap,
  SafeWeakMap,
  StringPrototypeCharCodeAt,
  StringPrototypeEndsWith,
  StringPrototypeLastIndexOf,
  StringPrototypeIndexOf,
  StringPrototypeMatch,
  StringPrototypeSlice,
  StringPrototypeStartsWith,
} = __nccwpck_require__(6326);
const { NativeModule } = __nccwpck_require__(1597);
const { pathToFileURL, fileURLToPath } = __nccwpck_require__(7310);
const fs = __nccwpck_require__(7147);
const path = __nccwpck_require__(1017);
const { sep } = path;
const { internalModuleStat } = __nccwpck_require__(3601);
const packageJsonReader = __nccwpck_require__(3348);
const {
  cjsConditions,
} = __nccwpck_require__(6755);
const { getOptionValue } = __nccwpck_require__(690);
const preserveSymlinks = getOptionValue('--preserve-symlinks');
const preserveSymlinksMain = getOptionValue('--preserve-symlinks-main');
const {normalizeSlashes} = __nccwpck_require__(4745);
const {createErrRequireEsm} = __nccwpck_require__(1858);
const {
  codes: {
    ERR_INVALID_MODULE_SPECIFIER,
  },
} = __nccwpck_require__(1858);

const {
  CHAR_FORWARD_SLASH,
} = __nccwpck_require__(8375);

const Module = __nccwpck_require__(8188);

const isWindows = process.platform === 'win32';

let statCache = null;

function stat(filename) {
  filename = path.toNamespacedPath(filename);
  if (statCache !== null) {
    const result = statCache.get(filename);
    if (result !== undefined) return result;
  }
  const result = internalModuleStat(filename);
  if (statCache !== null && result >= 0) {
    // Only set cache when `internalModuleStat(filename)` succeeds.
    statCache.set(filename, result);
  }
  return result;
}

// Note:
// we cannot get access to node's internal cache, which is populated from
// within node's Module constructor.  So the cache here will always be empty.
// It's possible we could approximate our own cache by building it up with
// hacky workarounds, but it's not worth the complexity and flakiness.
const moduleParentCache = new SafeWeakMap();

// Given a module name, and a list of paths to test, returns the first
// matching file in the following precedence.
//
// require("a.<ext>")
//   -> a.<ext>
//
// require("a")
//   -> a
//   -> a.<ext>
//   -> a/index.<ext>

const packageJsonCache = new SafeMap();

function readPackage(requestPath) {
  const jsonPath = path.resolve(requestPath, 'package.json');

  const existing = packageJsonCache.get(jsonPath);
  if (existing !== undefined) return existing;

  const result = packageJsonReader.read(jsonPath);
  const json = result.containsKeys === false ? '{}' : result.string;
  if (json === undefined) {
    packageJsonCache.set(jsonPath, false);
    return false;
  }

  try {
    const parsed = JSONParse(json);
    const filtered = {
      name: parsed.name,
      main: parsed.main,
      exports: parsed.exports,
      imports: parsed.imports,
      type: parsed.type
    };
    packageJsonCache.set(jsonPath, filtered);
    return filtered;
  } catch (e) {
    e.path = jsonPath;
    e.message = 'Error parsing ' + jsonPath + ': ' + e.message;
    throw e;
  }
}

function readPackageScope(checkPath) {
  const rootSeparatorIndex = StringPrototypeIndexOf(checkPath, sep);
  let separatorIndex;
  do {
    separatorIndex = StringPrototypeLastIndexOf(checkPath, sep);
    checkPath = StringPrototypeSlice(checkPath, 0, separatorIndex);
    if (StringPrototypeEndsWith(checkPath, sep + 'node_modules'))
      return false;
    const pjson = readPackage(checkPath + sep);
    if (pjson) return {
      data: pjson,
      path: checkPath,
    };
  } while (separatorIndex > rootSeparatorIndex);
  return false;
}

/**
 * @param {{
 *   nodeEsmResolver: ReturnType<typeof import('./node-internal-modules-esm-resolve').createResolve>,
 *   extensions: import('../src/file-extensions').Extensions,
 *   preferTsExts
 * }} opts
 */
function createCjsLoader(opts) {
const {nodeEsmResolver, preferTsExts} = opts;
const {replacementsForCjs, replacementsForJs, replacementsForMjs, replacementsForJsx} = opts.extensions;
const {
  encodedSepRegEx,
  packageExportsResolve,
  packageImportsResolve
} = nodeEsmResolver;

function tryPackage(requestPath, exts, isMain, originalPath) {
  // const pkg = readPackage(requestPath)?.main;
  const tmp = readPackage(requestPath)
  const pkg = tmp != null ? tmp.main : undefined;

  if (!pkg) {
    return tryExtensions(path.resolve(requestPath, 'index'), exts, isMain);
  }

  const filename = path.resolve(requestPath, pkg);
  let actual = tryReplacementExtensions(filename, isMain) ||
    tryFile(filename, isMain) ||
    tryExtensions(filename, exts, isMain) ||
    tryExtensions(path.resolve(filename, 'index'), exts, isMain);
  if (actual === false) {
    actual = tryExtensions(path.resolve(requestPath, 'index'), exts, isMain);
    if (!actual) {
      // eslint-disable-next-line no-restricted-syntax
      const err = new Error(
        `Cannot find module '${filename}'. ` +
        'Please verify that the package.json has a valid "main" entry'
      );
      err.code = 'MODULE_NOT_FOUND';
      err.path = path.resolve(requestPath, 'package.json');
      err.requestPath = originalPath;
      // TODO(BridgeAR): Add the requireStack as well.
      throw err;
    } else {
      const jsonPath = path.resolve(requestPath, 'package.json');
      process.emitWarning(
        `Invalid 'main' field in '${jsonPath}' of '${pkg}'. ` +
          'Please either fix that or report it to the module author',
        'DeprecationWarning',
        'DEP0128'
      );
    }
  }
  return actual;
}

// In order to minimize unnecessary lstat() calls,
// this cache is a list of known-real paths.
// Set to an empty Map to reset.
const realpathCache = new SafeMap();

// Check if the file exists and is not a directory
// if using --preserve-symlinks and isMain is false,
// keep symlinks intact, otherwise resolve to the
// absolute realpath.
function tryFile(requestPath, isMain) {
  const rc = stat(requestPath);
  if (rc !== 0) return;
  if (preserveSymlinks && !isMain) {
    return path.resolve(requestPath);
  }
  return toRealPath(requestPath);
}

function toRealPath(requestPath) {
  return fs.realpathSync(requestPath, {
    // [internalFS.realpathCacheKey]: realpathCache
  });
}

function statReplacementExtensions(p) {
  const lastDotIndex = p.lastIndexOf('.');
  if(lastDotIndex >= 0) {
    const ext = p.slice(lastDotIndex);
    if (ext === '.js' || ext === '.jsx' || ext === '.mjs' || ext === '.cjs') {
      const pathnameWithoutExtension = p.slice(0, lastDotIndex);
      const replacementExts =
        ext === '.js' ? replacementsForJs
        : ext === '.jsx' ? replacementsForJsx
        : ext === '.mjs' ? replacementsForMjs
        : replacementsForCjs;
      for (let i = 0; i < replacementExts.length; i++) {
        const filename = pathnameWithoutExtension + replacementExts[i];
        const rc = stat(filename);
        if (rc === 0) {
          return [rc, filename];
        }
      }
    }
  }
  return [stat(p), p];
}
function tryReplacementExtensions(p, isMain) {
  const lastDotIndex = p.lastIndexOf('.');
  if(lastDotIndex >= 0) {
    const ext = p.slice(lastDotIndex);
    if (ext === '.js' || ext === '.jsx' || ext === '.mjs' || ext === '.cjs') {
      const pathnameWithoutExtension = p.slice(0, lastDotIndex);
      const replacementExts =
        ext === '.js' ? replacementsForJs
        : ext === '.jsx' ? replacementsForJsx
        : ext === '.mjs' ? replacementsForMjs
        : replacementsForCjs;
      for (let i = 0; i < replacementExts.length; i++) {
        const filename = tryFile(pathnameWithoutExtension + replacementExts[i], isMain);
        if (filename) {
          return filename;
        }
      }
    }
  }
  return false;
}

// Given a path, check if the file exists with any of the set extensions
function tryExtensions(p, exts, isMain) {
  for (let i = 0; i < exts.length; i++) {
    const filename = tryFile(p + exts[i], isMain);

    if (filename) {
      return filename;
    }
  }
  return false;
}

function trySelfParentPath(parent) {
  if (!parent) return false;

  if (parent.filename) {
    return parent.filename;
  } else if (parent.id === '<repl>' || parent.id === 'internal/preload') {
    try {
      return process.cwd() + path.sep;
    } catch {
      return false;
    }
  }
}

function trySelf(parentPath, request) {
  if (!parentPath) return false;

  const { data: pkg, path: pkgPath } = readPackageScope(parentPath) || {};
  if (!pkg || pkg.exports === undefined) return false;
  if (typeof pkg.name !== 'string') return false;

  let expansion;
  if (request === pkg.name) {
    expansion = '.';
  } else if (StringPrototypeStartsWith(request, `${pkg.name}/`)) {
    expansion = '.' + StringPrototypeSlice(request, pkg.name.length);
  } else {
    return false;
  }

  try {
    return finalizeEsmResolution(packageExportsResolve(
      pathToFileURL(pkgPath + '/package.json'), expansion, pkg,
      pathToFileURL(parentPath), cjsConditions).resolved, parentPath, pkgPath);
  } catch (e) {
    if (e.code === 'ERR_MODULE_NOT_FOUND')
      throw createEsmNotFoundErr(request, pkgPath + '/package.json');
    throw e;
  }
}

// This only applies to requests of a specific form:
// 1. name/.*
// 2. @scope/name/.*
const EXPORTS_PATTERN = /^((?:@[^/\\%]+\/)?[^./\\%][^/\\%]*)(\/.*)?$/;
function resolveExports(nmPath, request) {
  // The implementation's behavior is meant to mirror resolution in ESM.
  const { 1: name, 2: expansion = '' } =
    StringPrototypeMatch(request, EXPORTS_PATTERN) || [];
  if (!name)
    return;
  const pkgPath = path.resolve(nmPath, name);
  const pkg = readPackage(pkgPath);
  // if (pkg?.exports != null) {
  if (pkg != null && pkg.exports != null) {
    try {
      return finalizeEsmResolution(packageExportsResolve(
        pathToFileURL(pkgPath + '/package.json'), '.' + expansion, pkg, null,
        cjsConditions).resolved, null, pkgPath);
    } catch (e) {
      if (e.code === 'ERR_MODULE_NOT_FOUND')
        throw createEsmNotFoundErr(request, pkgPath + '/package.json');
      throw e;
    }
  }
}

// Backwards compat for old node versions
const hasModulePathCache = !!(__nccwpck_require__(8188)._pathCache);
const Module_pathCache = Object.create(null);
const Module_pathCache_get = hasModulePathCache ? (cacheKey) => Module._pathCache[cacheKey] : (cacheKey) => Module_pathCache[cacheKey];
const Module_pathCache_set = hasModulePathCache ? (cacheKey, value) => (Module._pathCache[cacheKey] = value) : (cacheKey) => (Module_pathCache[cacheKey] = value);

const trailingSlashRegex = /(?:^|\/)\.?\.$/;
const Module_findPath = function _findPath(request, paths, isMain) {
  const absoluteRequest = path.isAbsolute(request);
  if (absoluteRequest) {
    paths = [''];
  } else if (!paths || paths.length === 0) {
    return false;
  }

  const cacheKey = request + '\x00' + ArrayPrototypeJoin(paths, '\x00');
  const entry = Module_pathCache_get(cacheKey);
  if (entry)
    return entry;

  let exts;
  let trailingSlash = request.length > 0 &&
    StringPrototypeCharCodeAt(request, request.length - 1) ===
    CHAR_FORWARD_SLASH;
  if (!trailingSlash) {
    trailingSlash = RegExpPrototypeTest(trailingSlashRegex, request);
  }

  // For each path
  for (let i = 0; i < paths.length; i++) {
    // Don't search further if path doesn't exist
    const curPath = paths[i];
    if (curPath && stat(curPath) < 1) continue;

    if (!absoluteRequest) {
      const exportsResolved = resolveExports(curPath, request);
      if (exportsResolved)
        return exportsResolved;
    }

    const _basePath = path.resolve(curPath, request);
    let filename;

    const [rc, basePath] = statReplacementExtensions(_basePath);
    if (!trailingSlash) {
      if (rc === 0) {  // File.
        if (!isMain) {
          if (preserveSymlinks) {
            filename = path.resolve(basePath);
          } else {
            filename = toRealPath(basePath);
          }
        } else if (preserveSymlinksMain) {
          // For the main module, we use the preserveSymlinksMain flag instead
          // mainly for backward compatibility, as the preserveSymlinks flag
          // historically has not applied to the main module.  Most likely this
          // was intended to keep .bin/ binaries working, as following those
          // symlinks is usually required for the imports in the corresponding
          // files to resolve; that said, in some use cases following symlinks
          // causes bigger problems which is why the preserveSymlinksMain option
          // is needed.
          filename = path.resolve(basePath);
        } else {
          filename = toRealPath(basePath);
        }
      }

      if (!filename) {
        // Try it with each of the extensions
        if (exts === undefined)
          exts = ObjectKeys(Module._extensions);
        filename = tryExtensions(basePath, exts, isMain);
      }
    }

    if (!filename && rc === 1) {  // Directory.
      // try it with each of the extensions at "index"
      if (exts === undefined)
        exts = ObjectKeys(Module._extensions);
      filename = tryPackage(basePath, exts, isMain, request);
    }

    if (filename) {
      Module_pathCache_set(cacheKey, filename);
      return filename;
    }
  }

  return false;
};

const Module_resolveFilename = function _resolveFilename(request, parent, isMain, options) {
  if (StringPrototypeStartsWith(request, 'node:') ||
      NativeModule.canBeRequiredByUsers(request)) {
    return request;
  }

  let paths;

  if (typeof options === 'object' && options !== null) {
    if (ArrayIsArray(options.paths)) {
      const isRelative = StringPrototypeStartsWith(request, './') ||
          StringPrototypeStartsWith(request, '../') ||
          ((isWindows && StringPrototypeStartsWith(request, '.\\')) ||
          StringPrototypeStartsWith(request, '..\\'));

      if (isRelative) {
        paths = options.paths;
      } else {
        const fakeParent = new Module('', null);

        paths = [];

        for (let i = 0; i < options.paths.length; i++) {
          const path = options.paths[i];
          fakeParent.paths = Module._nodeModulePaths(path);
          const lookupPaths = Module._resolveLookupPaths(request, fakeParent);

          for (let j = 0; j < lookupPaths.length; j++) {
            if (!ArrayPrototypeIncludes(paths, lookupPaths[j]))
              ArrayPrototypePush(paths, lookupPaths[j]);
          }
        }
      }
    } else if (options.paths === undefined) {
      paths = Module._resolveLookupPaths(request, parent);
    } else {
      throw new ERR_INVALID_ARG_VALUE('options.paths', options.paths);
    }
  } else {
    paths = Module._resolveLookupPaths(request, parent);
  }

  // if (parent?.filename) {
  // node 12 hack
  if (parent != null && parent.filename) {
    if (request[0] === '#') {
      const pkg = readPackageScope(parent.filename) || {};

      // if (pkg.data?.imports != null) {
      // node 12 hack
      if (pkg.data != null && pkg.data.imports != null) {
        try {
          return finalizeEsmResolution(
            packageImportsResolve(request, pathToFileURL(parent.filename),
                                  cjsConditions), parent.filename,
            pkg.path);
        } catch (e) {
          if (e.code === 'ERR_MODULE_NOT_FOUND')
            throw createEsmNotFoundErr(request);
          throw e;
        }
      }
    }
  }

  // Try module self resolution first
  const parentPath = trySelfParentPath(parent);
  const selfResolved = trySelf(parentPath, request);
  if (selfResolved) {
    const cacheKey = request + '\x00' +
         (paths.length === 1 ? paths[0] : ArrayPrototypeJoin(paths, '\x00'));
    Module._pathCache[cacheKey] = selfResolved;
    return selfResolved;
  }

  // Look up the filename first, since that's the cache key.
  const filename = Module._findPath(request, paths, isMain, false);
  if (filename) return filename;
  const requireStack = [];
  for (let cursor = parent;
    cursor;
    cursor = moduleParentCache.get(cursor)) {
    ArrayPrototypePush(requireStack, cursor.filename || cursor.id);
  }
  let message = `Cannot find module '${request}'`;
  if (requireStack.length > 0) {
    message = message + '\nRequire stack:\n- ' +
              ArrayPrototypeJoin(requireStack, '\n- ');
  }
  // eslint-disable-next-line no-restricted-syntax
  const err = new Error(message);
  err.code = 'MODULE_NOT_FOUND';
  err.requireStack = requireStack;
  throw err;
};

function finalizeEsmResolution(resolved, parentPath, pkgPath) {
  if (RegExpPrototypeTest(encodedSepRegEx, resolved))
    throw new ERR_INVALID_MODULE_SPECIFIER(
      resolved, 'must not include encoded "/" or "\\" characters', parentPath);
  const filename = fileURLToPath(resolved);
  const actual = tryReplacementExtensions(filename) || tryFile(filename);
  if (actual)
    return actual;
  const err = createEsmNotFoundErr(filename,
                                   path.resolve(pkgPath, 'package.json'));
  throw err;
}

function createEsmNotFoundErr(request, path) {
  // eslint-disable-next-line no-restricted-syntax
  const err = new Error(`Cannot find module '${request}'`);
  err.code = 'MODULE_NOT_FOUND';
  if (path)
    err.path = path;
  // TODO(BridgeAR): Add the requireStack as well.
  return err;
}


return {
  Module_findPath,
  Module_resolveFilename
}

}

/**
 * copied from Module._extensions['.js']
 * https://github.com/nodejs/node/blob/v15.3.0/lib/internal/modules/cjs/loader.js#L1113-L1120
 * @param {import('../src/index').Service} service
 * @param {NodeJS.Module} module
 * @param {string} filename
 */
function assertScriptCanLoadAsCJSImpl(service, module, filename) {
  const pkg = readPackageScope(filename);

  // ts-node modification: allow our configuration to override
  const tsNodeClassification = service.moduleTypeClassifier.classifyModuleByModuleTypeOverrides(normalizeSlashes(filename));
  if(tsNodeClassification.moduleType === 'cjs') return;

  // ignore package.json when file extension is ESM-only or CJS-only
  // [MUST_UPDATE_FOR_NEW_FILE_EXTENSIONS]
  const lastDotIndex = filename.lastIndexOf('.');
  const ext = lastDotIndex >= 0 ? filename.slice(lastDotIndex) : '';

  if((ext === '.cts' || ext === '.cjs') && tsNodeClassification.moduleType === 'auto') return;

  // Function require shouldn't be used in ES modules.
  if (ext === '.mts' || ext === '.mjs' || tsNodeClassification.moduleType === 'esm' || (pkg && pkg.data && pkg.data.type === 'module')) {
    const parentPath = module.parent && module.parent.filename;
    const packageJsonPath = pkg ? path.resolve(pkg.path, 'package.json') : null;
    throw createErrRequireEsm(filename, parentPath, packageJsonPath);
  }
}


module.exports = {
  createCjsLoader,
  assertScriptCanLoadAsCJSImpl,
  readPackageScope
};


/***/ }),

/***/ 7207:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// Copied from https://raw.githubusercontent.com/nodejs/node/v15.3.0/lib/internal/modules/esm/get_format.js


const {
  RegExpPrototypeExec,
  StringPrototypeStartsWith,
} = __nccwpck_require__(6326);
const { extname } = __nccwpck_require__(1017);
const { getOptionValue } = __nccwpck_require__(690);

const [nodeMajor, nodeMinor] = process.versions.node.split('.').map(s => parseInt(s, 10));
const experimentalJsonModules =
  nodeMajor > 17
  || (nodeMajor === 17 && nodeMinor >= 5)
  || (nodeMajor === 16 && nodeMinor >= 15)
  || getOptionValue('--experimental-json-modules');
const experimentalWasmModules = getOptionValue('--experimental-wasm-modules');
const { URL, fileURLToPath } = __nccwpck_require__(7310);
const { ERR_UNKNOWN_FILE_EXTENSION } = (__nccwpck_require__(1858).codes);

const extensionFormatMap = {
  '__proto__': null,
  '.cjs': 'commonjs',
  '.js': 'module',
  '.mjs': 'module'
};

const legacyExtensionFormatMap = {
  '__proto__': null,
  '.cjs': 'commonjs',
  '.js': 'commonjs',
  '.json': 'commonjs',
  '.mjs': 'module',
  '.node': 'commonjs'
};

if (experimentalWasmModules)
  extensionFormatMap['.wasm'] = legacyExtensionFormatMap['.wasm'] = 'wasm';

if (experimentalJsonModules)
  extensionFormatMap['.json'] = legacyExtensionFormatMap['.json'] = 'json';

/**
 *
 * @param {'node' | 'explicit'} [tsNodeExperimentalSpecifierResolution]
 * @param {ReturnType<
 *  typeof import('../dist-raw/node-internal-modules-esm-resolve').createResolve
 * >} nodeEsmResolver
 */
function createGetFormat(tsNodeExperimentalSpecifierResolution, nodeEsmResolver) {
// const experimentalSpeciferResolution = tsNodeExperimentalSpecifierResolution ?? getOptionValue('--experimental-specifier-resolution');
let experimentalSpeciferResolution = tsNodeExperimentalSpecifierResolution != null ? tsNodeExperimentalSpecifierResolution : getOptionValue('--experimental-specifier-resolution');
const { getPackageType } = nodeEsmResolver;

/**
 * @param {string} url
 * @param {{}} context
 * @param {any} defaultGetFormatUnused
 * @returns {ReturnType<import('../src/esm').NodeLoaderHooksAPI1.GetFormatHook>}
 */
function defaultGetFormat(url, context, defaultGetFormatUnused) {
  if (StringPrototypeStartsWith(url, 'node:')) {
    return { format: 'builtin' };
  }
  const parsed = new URL(url);
  if (parsed.protocol === 'data:') {
    const [ , mime ] = RegExpPrototypeExec(
      /^([^/]+\/[^;,]+)(?:[^,]*?)(;base64)?,/,
      parsed.pathname,
    ) || [ null, null, null ];
    const format = ({
      '__proto__': null,
      'text/javascript': 'module',
      'application/json': experimentalJsonModules ? 'json' : null,
      'application/wasm': experimentalWasmModules ? 'wasm' : null
    })[mime] || null;
    return { format };
  } else if (parsed.protocol === 'file:') {
    const ext = extname(parsed.pathname);
    let format;
    if (ext === '.js') {
      format = getPackageType(parsed.href) === 'module' ? 'module' : 'commonjs';
    } else {
      format = extensionFormatMap[ext];
    }
    if (!format) {
      if (experimentalSpeciferResolution === 'node') {
        process.emitWarning(
          'The Node.js specifier resolution in ESM is experimental.',
          'ExperimentalWarning');
        format = legacyExtensionFormatMap[ext];
      } else {
        throw new ERR_UNKNOWN_FILE_EXTENSION(ext, fileURLToPath(url));
      }
    }
    return { format: format || null };
  }
  return { format: null };
}

return {defaultGetFormat};
}

module.exports = {
  createGetFormat
};


/***/ }),

/***/ 7968:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// Copied from https://raw.githubusercontent.com/nodejs/node/v15.3.0/lib/internal/modules/esm/resolve.js



const {versionGteLt} = __nccwpck_require__(4745);

// Test for node >14.13.1 || (>=12.20.0 && <13)
const builtinModuleProtocol =
  versionGteLt(process.versions.node, '14.13.1') ||
  versionGteLt(process.versions.node, '12.20.0', '13.0.0')
    ? 'node:'
    : 'nodejs:';

const {
  ArrayIsArray,
  ArrayPrototypeJoin,
  ArrayPrototypeShift,
  JSONParse,
  JSONStringify,
  ObjectFreeze,
  ObjectGetOwnPropertyNames,
  ObjectPrototypeHasOwnProperty,
  RegExpPrototypeTest,
  SafeMap,
  SafeSet,
  StringPrototypeEndsWith,
  StringPrototypeIndexOf,
  StringPrototypeLastIndexOf,
  StringPrototypeReplace,
  StringPrototypeSlice,
  StringPrototypeSplit,
  StringPrototypeStartsWith,
  StringPrototypeSubstr,
} = __nccwpck_require__(6326);

// const internalFS = require('internal/fs/utils');
const Module = __nccwpck_require__(8188);
const { NativeModule } = __nccwpck_require__(1597);
const {
  realpathSync,
  statSync,
  Stats,
} = __nccwpck_require__(7147);
// const { getOptionValue } = require('internal/options');
const { getOptionValue } = __nccwpck_require__(690);
// // Do not eagerly grab .manifest, it may be in TDZ
// const policy = getOptionValue('--experimental-policy') ?
//   require('internal/process/policy') :
//   null;
// disabled for now.  I am not sure if/how we should support this
const policy = null;
const { sep, relative } = __nccwpck_require__(1017);
const preserveSymlinks = getOptionValue('--preserve-symlinks');
const preserveSymlinksMain = getOptionValue('--preserve-symlinks-main');
const typeFlag = getOptionValue('--input-type');
// const { URL, pathToFileURL, fileURLToPath } = require('internal/url');
const { URL, pathToFileURL, fileURLToPath } = __nccwpck_require__(7310);
const {
  ERR_INPUT_TYPE_NOT_ALLOWED,
  ERR_INVALID_ARG_VALUE,
  ERR_INVALID_MODULE_SPECIFIER,
  ERR_INVALID_PACKAGE_CONFIG,
  ERR_INVALID_PACKAGE_TARGET,
  ERR_MANIFEST_DEPENDENCY_MISSING,
  ERR_MODULE_NOT_FOUND,
  ERR_PACKAGE_IMPORT_NOT_DEFINED,
  ERR_PACKAGE_PATH_NOT_EXPORTED,
  ERR_UNSUPPORTED_DIR_IMPORT,
  ERR_UNSUPPORTED_ESM_URL_SCHEME,
// } = require('internal/errors').codes;
} = (__nccwpck_require__(1858).codes);

// const { Module: CJSModule } = require('internal/modules/cjs/loader');
const CJSModule = Module;

// const packageJsonReader = require('internal/modules/package_json_reader');
const packageJsonReader = __nccwpck_require__(3348);
const userConditions = getOptionValue('--conditions');
const DEFAULT_CONDITIONS = ObjectFreeze(['node', 'import', ...userConditions]);
const DEFAULT_CONDITIONS_SET = new SafeSet(DEFAULT_CONDITIONS);

const pendingDeprecation = getOptionValue('--pending-deprecation');

/**
 * @param {{
 *  extensions: import('../src/file-extensions').Extensions,
 *  preferTsExts: boolean | undefined;
 *  tsNodeExperimentalSpecifierResolution: import('../src/index').ExperimentalSpecifierResolution | undefined;
 * }} opts
 */
function createResolve(opts) {
// TODO receive cached fs implementations here
const {preferTsExts, tsNodeExperimentalSpecifierResolution, extensions} = opts;
const esrnExtensions = extensions.experimentalSpecifierResolutionAddsIfOmitted;
const {legacyMainResolveAddsIfOmitted, replacementsForCjs, replacementsForJs, replacementsForMjs, replacementsForJsx} = extensions;
// const experimentalSpecifierResolution = tsNodeExperimentalSpecifierResolution ?? getOptionValue('--experimental-specifier-resolution');
const experimentalSpecifierResolution = tsNodeExperimentalSpecifierResolution != null ? tsNodeExperimentalSpecifierResolution : getOptionValue('--experimental-specifier-resolution');

const emittedPackageWarnings = new SafeSet();
function emitFolderMapDeprecation(match, pjsonUrl, isExports, base) {
  const pjsonPath = fileURLToPath(pjsonUrl);
  if (!pendingDeprecation) {
    const nodeModulesIndex = StringPrototypeLastIndexOf(pjsonPath,
                                                        '/node_modules/');
    if (nodeModulesIndex !== -1) {
      const afterNodeModulesPath = StringPrototypeSlice(pjsonPath,
                                                        nodeModulesIndex + 14,
                                                        -13);
      try {
        const { packageSubpath } = parsePackageName(afterNodeModulesPath);
        if (packageSubpath === '.')
          return;
      } catch {}
    }
  }
  if (emittedPackageWarnings.has(pjsonPath + '|' + match))
    return;
  emittedPackageWarnings.add(pjsonPath + '|' + match);
  process.emitWarning(
    `Use of deprecated folder mapping "${match}" in the ${isExports ?
      '"exports"' : '"imports"'} field module resolution of the package at ${
      pjsonPath}${base ? ` imported from ${fileURLToPath(base)}` : ''}.\n` +
      `Update this package.json to use a subpath pattern like "${match}*".`,
    'DeprecationWarning',
    'DEP0148'
  );
}

function getConditionsSet(conditions) {
  if (conditions !== undefined && conditions !== DEFAULT_CONDITIONS) {
    if (!ArrayIsArray(conditions)) {
      throw new ERR_INVALID_ARG_VALUE('conditions', conditions,
                                      'expected an array');
    }
    return new SafeSet(conditions);
  }
  return DEFAULT_CONDITIONS_SET;
}

const realpathCache = new SafeMap();
const packageJSONCache = new SafeMap();  /* string -> PackageConfig */

const statSupportsThrowIfNoEntry = versionGteLt(process.versions.node, '15.3.0') ||
  versionGteLt(process.versions.node, '14.17.0', '15.0.0');
const tryStatSync = statSupportsThrowIfNoEntry ? tryStatSyncWithoutErrors : tryStatSyncWithErrors;
const statsIfNotFound = new Stats();
function tryStatSyncWithoutErrors(path) {
  const stats = statSync(path, { throwIfNoEntry: false });
  if(stats != null) return stats;
  return statsIfNotFound;
}
function tryStatSyncWithErrors(path) {
  try {
    return statSync(path);
  } catch {
    return statsIfNotFound;
  }
}

function getPackageConfig(path, specifier, base) {
  const existing = packageJSONCache.get(path);
  if (existing !== undefined) {
    return existing;
  }
  const source = packageJsonReader.read(path).string;
  if (source === undefined) {
    const packageConfig = {
      pjsonPath: path,
      exists: false,
      main: undefined,
      name: undefined,
      type: 'none',
      exports: undefined,
      imports: undefined,
    };
    packageJSONCache.set(path, packageConfig);
    return packageConfig;
  }

  let packageJSON;
  try {
    packageJSON = JSONParse(source);
  } catch (error) {
    throw new ERR_INVALID_PACKAGE_CONFIG(
      path,
      (base ? `"${specifier}" from ` : '') + fileURLToPath(base || specifier),
      error.message
    );
  }

  let { imports, main, name, type } = packageJSON;
  const { exports } = packageJSON;
  if (typeof imports !== 'object' || imports === null) imports = undefined;
  if (typeof main !== 'string') main = undefined;
  if (typeof name !== 'string') name = undefined;
  // Ignore unknown types for forwards compatibility
  if (type !== 'module' && type !== 'commonjs') type = 'none';

  const packageConfig = {
    pjsonPath: path,
    exists: true,
    main,
    name,
    type,
    exports,
    imports,
  };
  packageJSONCache.set(path, packageConfig);
  return packageConfig;
}

function getPackageScopeConfig(resolved) {
  let packageJSONUrl = new URL('./package.json', resolved);
  while (true) {
    const packageJSONPath = packageJSONUrl.pathname;
    if (StringPrototypeEndsWith(packageJSONPath, 'node_modules/package.json'))
      break;
    const packageConfig = getPackageConfig(fileURLToPath(packageJSONUrl),
                                           resolved);
    if (packageConfig.exists) return packageConfig;

    const lastPackageJSONUrl = packageJSONUrl;
    packageJSONUrl = new URL('../package.json', packageJSONUrl);

    // Terminates at root where ../package.json equals ../../package.json
    // (can't just check "/package.json" for Windows support).
    if (packageJSONUrl.pathname === lastPackageJSONUrl.pathname) break;
  }
  const packageJSONPath = fileURLToPath(packageJSONUrl);
  const packageConfig = {
    pjsonPath: packageJSONPath,
    exists: false,
    main: undefined,
    name: undefined,
    type: 'none',
    exports: undefined,
    imports: undefined,
  };
  packageJSONCache.set(packageJSONPath, packageConfig);
  return packageConfig;
}

/*
 * Legacy CommonJS main resolution:
 * 1. let M = pkg_url + (json main field)
 * 2. TRY(M, M.js, M.json, M.node)
 * 3. TRY(M/index.js, M/index.json, M/index.node)
 * 4. TRY(pkg_url/index.js, pkg_url/index.json, pkg_url/index.node)
 * 5. NOT_FOUND
 */
function fileExists(url) {
  return tryStatSync(fileURLToPath(url)).isFile();
}

function legacyMainResolve(packageJSONUrl, packageConfig, base) {
  let guess;
  if (packageConfig.main !== undefined) {
    // Note: fs check redundances will be handled by Descriptor cache here.
    if(guess = resolveReplacementExtensions(new URL(`./${packageConfig.main}`, packageJSONUrl))) {
      return guess;
    }
    if (fileExists(guess = new URL(`./${packageConfig.main}`,
                                   packageJSONUrl))) {
      return guess;
    }
    for(const extension of legacyMainResolveAddsIfOmitted) {
      if (fileExists(guess = new URL(`./${packageConfig.main}${extension}`,
                                    packageJSONUrl))) {
        return guess;
      }
    }
    for(const extension of legacyMainResolveAddsIfOmitted) {
      if (fileExists(guess = new URL(`./${packageConfig.main}/index${extension}`,
                                    packageJSONUrl))) {
        return guess;
      }
    }
    // Fallthrough.
  }
  for(const extension of legacyMainResolveAddsIfOmitted) {
    if (fileExists(guess = new URL(`./index${extension}`, packageJSONUrl))) {
      return guess;
    }
  }
  // Not found.
  throw new ERR_MODULE_NOT_FOUND(
    fileURLToPath(new URL('.', packageJSONUrl)), fileURLToPath(base));
}

/** attempts replacement extensions, then tries exact name, then attempts appending extensions */
function resolveExtensionsWithTryExactName(search) {
  const resolvedReplacementExtension = resolveReplacementExtensions(search);
  if(resolvedReplacementExtension) return resolvedReplacementExtension;
  if (fileExists(search)) return search;
  return resolveExtensions(search);
}

// This appends missing extensions
function resolveExtensions(search) {
  for (let i = 0; i < esrnExtensions.length; i++) {
    const extension = esrnExtensions[i];
    const guess = new URL(`${search.pathname}${extension}`, search);
    if (fileExists(guess)) return guess;
  }
  return undefined;
}

/** This replaces JS with TS extensions */
function resolveReplacementExtensions(search) {
  const lastDotIndex = search.pathname.lastIndexOf('.');
  if(lastDotIndex >= 0) {
    const ext = search.pathname.slice(lastDotIndex);
    if (ext === '.js' || ext === '.jsx' || ext === '.mjs' || ext === '.cjs') {
      const pathnameWithoutExtension = search.pathname.slice(0, lastDotIndex);
      const replacementExts =
        ext === '.js' ? replacementsForJs
        : ext === '.jsx' ? replacementsForJsx
        : ext === '.mjs' ? replacementsForMjs
        : replacementsForCjs;
      const guess = new URL(search.toString());
      for (let i = 0; i < replacementExts.length; i++) {
        const extension = replacementExts[i];
        guess.pathname = `${pathnameWithoutExtension}${extension}`;
        if (fileExists(guess)) return guess;
      }
    }
  }
  return undefined;
}

function resolveIndex(search) {
  return resolveExtensions(new URL('index', search));
}

const encodedSepRegEx = /%2F|%2C/i;
function finalizeResolution(resolved, base) {
  if (RegExpPrototypeTest(encodedSepRegEx, resolved.pathname))
    throw new ERR_INVALID_MODULE_SPECIFIER(
      resolved.pathname, 'must not include encoded "/" or "\\" characters',
      fileURLToPath(base));

  if (experimentalSpecifierResolution === 'node') {
    const path = fileURLToPath(resolved);
    let file = resolveExtensionsWithTryExactName(resolved);
    if (file !== undefined) return file;
    if (!StringPrototypeEndsWith(path, '/')) {
      file = resolveIndex(new URL(`${resolved}/`));
      if (file !== undefined) return file;
    } else {
      return resolveIndex(resolved) || resolved;
    }
    throw new ERR_MODULE_NOT_FOUND(
      resolved.pathname, fileURLToPath(base), 'module');
  }

  const file = resolveReplacementExtensions(resolved) || resolved;
  const path = fileURLToPath(file);

  const stats = tryStatSync(StringPrototypeEndsWith(path, '/') ?
    StringPrototypeSlice(path, -1) : path);
  if (stats.isDirectory()) {
    const err = new ERR_UNSUPPORTED_DIR_IMPORT(path, fileURLToPath(base));
    err.url = String(resolved);
    throw err;
  } else if (!stats.isFile()) {
    throw new ERR_MODULE_NOT_FOUND(
      path || resolved.pathname, fileURLToPath(base), 'module');
  }

  return file;
}

function throwImportNotDefined(specifier, packageJSONUrl, base) {
  throw new ERR_PACKAGE_IMPORT_NOT_DEFINED(
    specifier, packageJSONUrl && fileURLToPath(new URL('.', packageJSONUrl)),
    fileURLToPath(base));
}

function throwExportsNotFound(subpath, packageJSONUrl, base) {
  throw new ERR_PACKAGE_PATH_NOT_EXPORTED(
    fileURLToPath(new URL('.', packageJSONUrl)), subpath,
    base && fileURLToPath(base));
}

function throwInvalidSubpath(subpath, packageJSONUrl, internal, base) {
  const reason = `request is not a valid subpath for the "${internal ?
    'imports' : 'exports'}" resolution of ${fileURLToPath(packageJSONUrl)}`;
  throw new ERR_INVALID_MODULE_SPECIFIER(subpath, reason,
                                         base && fileURLToPath(base));
}

function throwInvalidPackageTarget(
  subpath, target, packageJSONUrl, internal, base) {
  if (typeof target === 'object' && target !== null) {
    target = JSONStringify(target, null, '');
  } else {
    target = `${target}`;
  }
  throw new ERR_INVALID_PACKAGE_TARGET(
    fileURLToPath(new URL('.', packageJSONUrl)), subpath, target,
    internal, base && fileURLToPath(base));
}

const invalidSegmentRegEx = /(^|\\|\/)(\.\.?|node_modules)(\\|\/|$)/;
const patternRegEx = /\*/g;

function resolvePackageTargetString(
  target, subpath, match, packageJSONUrl, base, pattern, internal, conditions) {
  if (subpath !== '' && !pattern && target[target.length - 1] !== '/')
    throwInvalidPackageTarget(match, target, packageJSONUrl, internal, base);

  if (!StringPrototypeStartsWith(target, './')) {
    if (internal && !StringPrototypeStartsWith(target, '../') &&
        !StringPrototypeStartsWith(target, '/')) {
      let isURL = false;
      try {
        new URL(target);
        isURL = true;
      } catch {}
      if (!isURL) {
        const exportTarget = pattern ?
          StringPrototypeReplace(target, patternRegEx, subpath) :
          target + subpath;
        return packageResolve(exportTarget, packageJSONUrl, conditions);
      }
    }
    throwInvalidPackageTarget(match, target, packageJSONUrl, internal, base);
  }

  if (RegExpPrototypeTest(invalidSegmentRegEx, StringPrototypeSlice(target, 2)))
    throwInvalidPackageTarget(match, target, packageJSONUrl, internal, base);

  const resolved = new URL(target, packageJSONUrl);
  const resolvedPath = resolved.pathname;
  const packagePath = new URL('.', packageJSONUrl).pathname;

  if (!StringPrototypeStartsWith(resolvedPath, packagePath))
    throwInvalidPackageTarget(match, target, packageJSONUrl, internal, base);

  if (subpath === '') return resolved;

  if (RegExpPrototypeTest(invalidSegmentRegEx, subpath))
    throwInvalidSubpath(match + subpath, packageJSONUrl, internal, base);

  if (pattern)
    return new URL(StringPrototypeReplace(resolved.href, patternRegEx,
                                          subpath));
  return new URL(subpath, resolved);
}

/**
 * @param {string} key
 * @returns {boolean}
 */
function isArrayIndex(key) {
  const keyNum = +key;
  if (`${keyNum}` !== key) return false;
  return keyNum >= 0 && keyNum < 0xFFFF_FFFF;
}

function resolvePackageTarget(packageJSONUrl, target, subpath, packageSubpath,
                              base, pattern, internal, conditions) {
  if (typeof target === 'string') {
    return resolvePackageTargetString(
      target, subpath, packageSubpath, packageJSONUrl, base, pattern, internal,
      conditions);
  } else if (ArrayIsArray(target)) {
    if (target.length === 0)
      return null;

    let lastException;
    for (let i = 0; i < target.length; i++) {
      const targetItem = target[i];
      let resolved;
      try {
        resolved = resolvePackageTarget(
          packageJSONUrl, targetItem, subpath, packageSubpath, base, pattern,
          internal, conditions);
      } catch (e) {
        lastException = e;
        if (e.code === 'ERR_INVALID_PACKAGE_TARGET')
          continue;
        throw e;
      }
      if (resolved === undefined)
        continue;
      if (resolved === null) {
        lastException = null;
        continue;
      }
      return resolved;
    }
    if (lastException === undefined || lastException === null)
      return lastException;
    throw lastException;
  } else if (typeof target === 'object' && target !== null) {
    const keys = ObjectGetOwnPropertyNames(target);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (isArrayIndex(key)) {
        throw new ERR_INVALID_PACKAGE_CONFIG(
          fileURLToPath(packageJSONUrl), base,
          '"exports" cannot contain numeric property keys.');
      }
    }
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (key === 'default' || conditions.has(key)) {
        const conditionalTarget = target[key];
        const resolved = resolvePackageTarget(
          packageJSONUrl, conditionalTarget, subpath, packageSubpath, base,
          pattern, internal, conditions);
        if (resolved === undefined)
          continue;
        return resolved;
      }
    }
    return undefined;
  } else if (target === null) {
    return null;
  }
  throwInvalidPackageTarget(packageSubpath, target, packageJSONUrl, internal,
                            base);
}

function isConditionalExportsMainSugar(exports, packageJSONUrl, base) {
  if (typeof exports === 'string' || ArrayIsArray(exports)) return true;
  if (typeof exports !== 'object' || exports === null) return false;

  const keys = ObjectGetOwnPropertyNames(exports);
  let isConditionalSugar = false;
  let i = 0;
  for (let j = 0; j < keys.length; j++) {
    const key = keys[j];
    const curIsConditionalSugar = key === '' || key[0] !== '.';
    if (i++ === 0) {
      isConditionalSugar = curIsConditionalSugar;
    } else if (isConditionalSugar !== curIsConditionalSugar) {
      throw new ERR_INVALID_PACKAGE_CONFIG(
        fileURLToPath(packageJSONUrl), base,
        '"exports" cannot contain some keys starting with \'.\' and some not.' +
        ' The exports object must either be an object of package subpath keys' +
        ' or an object of main entry condition name keys only.');
    }
  }
  return isConditionalSugar;
}

/**
 * @param {URL} packageJSONUrl
 * @param {string} packageSubpath
 * @param {object} packageConfig
 * @param {string} base
 * @param {Set<string>} conditions
 * @returns {{resolved: URL, exact: boolean}}
 */
function packageExportsResolve(
  packageJSONUrl, packageSubpath, packageConfig, base, conditions) {
  let exports = packageConfig.exports;
  if (isConditionalExportsMainSugar(exports, packageJSONUrl, base))
    exports = { '.': exports };

  if (ObjectPrototypeHasOwnProperty(exports, packageSubpath)) {
    const target = exports[packageSubpath];
    const resolved = resolvePackageTarget(
      packageJSONUrl, target, '', packageSubpath, base, false, false, conditions
    );
    if (resolved === null || resolved === undefined)
      throwExportsNotFound(packageSubpath, packageJSONUrl, base);
    return { resolved, exact: true };
  }

  let bestMatch = '';
  const keys = ObjectGetOwnPropertyNames(exports);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (key[key.length - 1] === '*' &&
        StringPrototypeStartsWith(packageSubpath,
                                  StringPrototypeSlice(key, 0, -1)) &&
        packageSubpath.length >= key.length &&
        key.length > bestMatch.length) {
      bestMatch = key;
    } else if (key[key.length - 1] === '/' &&
      StringPrototypeStartsWith(packageSubpath, key) &&
      key.length > bestMatch.length) {
      bestMatch = key;
    }
  }

  if (bestMatch) {
    const target = exports[bestMatch];
    const pattern = bestMatch[bestMatch.length - 1] === '*';
    const subpath = StringPrototypeSubstr(packageSubpath, bestMatch.length -
      (pattern ? 1 : 0));
    const resolved = resolvePackageTarget(packageJSONUrl, target, subpath,
                                          bestMatch, base, pattern, false,
                                          conditions);
    if (resolved === null || resolved === undefined)
      throwExportsNotFound(packageSubpath, packageJSONUrl, base);
    if (!pattern)
      emitFolderMapDeprecation(bestMatch, packageJSONUrl, true, base);
    return { resolved, exact: pattern };
  }

  throwExportsNotFound(packageSubpath, packageJSONUrl, base);
}

function packageImportsResolve(name, base, conditions) {
  if (name === '#' || StringPrototypeStartsWith(name, '#/')) {
    const reason = 'is not a valid internal imports specifier name';
    throw new ERR_INVALID_MODULE_SPECIFIER(name, reason, fileURLToPath(base));
  }
  let packageJSONUrl;
  const packageConfig = getPackageScopeConfig(base);
  if (packageConfig.exists) {
    packageJSONUrl = pathToFileURL(packageConfig.pjsonPath);
    const imports = packageConfig.imports;
    if (imports) {
      if (ObjectPrototypeHasOwnProperty(imports, name)) {
        const resolved = resolvePackageTarget(
          packageJSONUrl, imports[name], '', name, base, false, true, conditions
        );
        if (resolved !== null)
          return { resolved, exact: true };
      } else {
        let bestMatch = '';
        const keys = ObjectGetOwnPropertyNames(imports);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          if (key[key.length - 1] === '*' &&
              StringPrototypeStartsWith(name,
                                        StringPrototypeSlice(key, 0, -1)) &&
              name.length >= key.length &&
              key.length > bestMatch.length) {
            bestMatch = key;
          } else if (key[key.length - 1] === '/' &&
            StringPrototypeStartsWith(name, key) &&
            key.length > bestMatch.length) {
            bestMatch = key;
          }
        }

        if (bestMatch) {
          const target = imports[bestMatch];
          const pattern = bestMatch[bestMatch.length - 1] === '*';
          const subpath = StringPrototypeSubstr(name, bestMatch.length -
            (pattern ? 1 : 0));
          const resolved = resolvePackageTarget(
            packageJSONUrl, target, subpath, bestMatch, base, pattern, true,
            conditions);
          if (resolved !== null) {
            if (!pattern)
              emitFolderMapDeprecation(bestMatch, packageJSONUrl, false, base);
            return { resolved, exact: pattern };
          }
        }
      }
    }
  }
  throwImportNotDefined(name, packageJSONUrl, base);
}

function getPackageType(url) {
  const packageConfig = getPackageScopeConfig(url);
  return packageConfig.type;
}

function parsePackageName(specifier, base) {
  let separatorIndex = StringPrototypeIndexOf(specifier, '/');
  let validPackageName = true;
  let isScoped = false;
  if (specifier[0] === '@') {
    isScoped = true;
    if (separatorIndex === -1 || specifier.length === 0) {
      validPackageName = false;
    } else {
      separatorIndex = StringPrototypeIndexOf(
        specifier, '/', separatorIndex + 1);
    }
  }

  const packageName = separatorIndex === -1 ?
    specifier : StringPrototypeSlice(specifier, 0, separatorIndex);

  // Package name cannot have leading . and cannot have percent-encoding or
  // separators.
  for (let i = 0; i < packageName.length; i++) {
    if (packageName[i] === '%' || packageName[i] === '\\') {
      validPackageName = false;
      break;
    }
  }

  if (!validPackageName) {
    throw new ERR_INVALID_MODULE_SPECIFIER(
      specifier, 'is not a valid package name', fileURLToPath(base));
  }

  const packageSubpath = '.' + (separatorIndex === -1 ? '' :
    StringPrototypeSlice(specifier, separatorIndex));

  return { packageName, packageSubpath, isScoped };
}

/**
 * @param {string} specifier
 * @param {URL} base
 * @param {Set<string>} conditions
 * @returns {URL}
 */
function packageResolve(specifier, base, conditions) {
  const { packageName, packageSubpath, isScoped } =
    parsePackageName(specifier, base);

  // ResolveSelf
  const packageConfig = getPackageScopeConfig(base);
  if (packageConfig.exists) {
    const packageJSONUrl = pathToFileURL(packageConfig.pjsonPath);
    if (packageConfig.name === packageName &&
        packageConfig.exports !== undefined && packageConfig.exports !== null) {
      return packageExportsResolve(
        packageJSONUrl, packageSubpath, packageConfig, base, conditions
      ).resolved;
    }
  }

  let packageJSONUrl =
    new URL('./node_modules/' + packageName + '/package.json', base);
  let packageJSONPath = fileURLToPath(packageJSONUrl);
  let lastPath;
  do {
    const stat = tryStatSync(StringPrototypeSlice(packageJSONPath, 0,
                                                  packageJSONPath.length - 13));
    if (!stat.isDirectory()) {
      lastPath = packageJSONPath;
      packageJSONUrl = new URL((isScoped ?
        '../../../../node_modules/' : '../../../node_modules/') +
        packageName + '/package.json', packageJSONUrl);
      packageJSONPath = fileURLToPath(packageJSONUrl);
      continue;
    }

    // Package match.
    const packageConfig = getPackageConfig(packageJSONPath, specifier, base);
    if (packageConfig.exports !== undefined && packageConfig.exports !== null)
      return packageExportsResolve(
        packageJSONUrl, packageSubpath, packageConfig, base, conditions
      ).resolved;
    if (packageSubpath === '.')
      return legacyMainResolve(packageJSONUrl, packageConfig, base);
    return new URL(packageSubpath, packageJSONUrl);
    // Cross-platform root check.
  } while (packageJSONPath.length !== lastPath.length);

  // eslint can't handle the above code.
  // eslint-disable-next-line no-unreachable
  throw new ERR_MODULE_NOT_FOUND(packageName, fileURLToPath(base));
}

function isBareSpecifier(specifier) {
  return specifier[0] && specifier[0] !== '/' && specifier[0] !== '.';
}

function isRelativeSpecifier(specifier) {
  if (specifier[0] === '.') {
    if (specifier.length === 1 || specifier[1] === '/') return true;
    if (specifier[1] === '.') {
      if (specifier.length === 2 || specifier[2] === '/') return true;
    }
  }
  return false;
}

function shouldBeTreatedAsRelativeOrAbsolutePath(specifier) {
  if (specifier === '') return false;
  if (specifier[0] === '/') return true;
  return isRelativeSpecifier(specifier);
}

/**
 * @param {string} specifier
 * @param {URL} base
 * @param {Set<string>} conditions
 * @returns {URL}
 */
function moduleResolve(specifier, base, conditions) {
  // Order swapped from spec for minor perf gain.
  // Ok since relative URLs cannot parse as URLs.
  let resolved;
  if (shouldBeTreatedAsRelativeOrAbsolutePath(specifier)) {
    resolved = new URL(specifier, base);
  } else if (specifier[0] === '#') {
    ({ resolved } = packageImportsResolve(specifier, base, conditions));
  } else {
    try {
      resolved = new URL(specifier);
    } catch {
      resolved = packageResolve(specifier, base, conditions);
    }
  }
  return finalizeResolution(resolved, base);
}

/**
 * Try to resolve an import as a CommonJS module
 * @param {string} specifier
 * @param {string} parentURL
 * @returns {boolean|string}
 */
function resolveAsCommonJS(specifier, parentURL) {
  try {
    const parent = fileURLToPath(parentURL);
    const tmpModule = new CJSModule(parent, null);
    tmpModule.paths = CJSModule._nodeModulePaths(parent);

    let found = CJSModule._resolveFilename(specifier, tmpModule, false);

    // If it is a relative specifier return the relative path
    // to the parent
    if (isRelativeSpecifier(specifier)) {
      found = relative(parent, found);
      // Add '.separator if the path does not start with '..separator'
      // This should be a safe assumption because when loading
      // esm modules there should be always a file specified so
      // there should not be a specifier like '..' or '.'
      if (!StringPrototypeStartsWith(found, `..${sep}`)) {
        found = `.${sep}${found}`;
      }
    } else if (isBareSpecifier(specifier)) {
      // If it is a bare specifier return the relative path within the
      // module
      const pkg = StringPrototypeSplit(specifier, '/')[0];
      const index = StringPrototypeIndexOf(found, pkg);
      if (index !== -1) {
        found = StringPrototypeSlice(found, index);
      }
    }
    // Normalize the path separator to give a valid suggestion
    // on Windows
    if (process.platform === 'win32') {
      found = StringPrototypeReplace(found, new RegExp(`\\${sep}`, 'g'), '/');
    }
    return found;
  } catch {
    return false;
  }
}

function defaultResolve(specifier, context = {}, defaultResolveUnused) {
  let { parentURL, conditions } = context;
  if (parentURL && policy != null && policy.manifest) {
    const redirects = policy.manifest.getDependencyMapper(parentURL);
    if (redirects) {
      const { resolve, reaction } = redirects;
      const destination = resolve(specifier, new SafeSet(conditions));
      let missing = true;
      if (destination === true) {
        missing = false;
      } else if (destination) {
        const href = destination.href;
        return { url: href };
      }
      if (missing) {
        reaction(new ERR_MANIFEST_DEPENDENCY_MISSING(
          parentURL,
          specifier,
          ArrayPrototypeJoin([...conditions], ', '))
        );
      }
    }
  }
  let parsed;
  try {
    parsed = new URL(specifier);
    if (parsed.protocol === 'data:') {
      return {
        url: specifier
      };
    }
  } catch {}
  if (parsed && parsed.protocol === builtinModuleProtocol)
    return { url: specifier };
  if (parsed && parsed.protocol !== 'file:' && parsed.protocol !== 'data:')
    throw new ERR_UNSUPPORTED_ESM_URL_SCHEME(parsed);
  if (NativeModule.canBeRequiredByUsers(specifier)) {
    return {
      url: builtinModuleProtocol + specifier
    };
  }
  if (parentURL && StringPrototypeStartsWith(parentURL, 'data:')) {
    // This is gonna blow up, we want the error
    new URL(specifier, parentURL);
  }

  const isMain = parentURL === undefined;
  if (isMain) {
    parentURL = pathToFileURL(`${process.cwd()}/`).href;

    // This is the initial entry point to the program, and --input-type has
    // been passed as an option; but --input-type can only be used with
    // --eval, --print or STDIN string input. It is not allowed with file
    // input, to avoid user confusion over how expansive the effect of the
    // flag should be (i.e. entry point only, package scope surrounding the
    // entry point, etc.).
    if (typeFlag)
      throw new ERR_INPUT_TYPE_NOT_ALLOWED();
  }

  conditions = getConditionsSet(conditions);
  let url;
  try {
    url = moduleResolve(specifier, parentURL, conditions);
  } catch (error) {
    // Try to give the user a hint of what would have been the
    // resolved CommonJS module
    if (error.code === 'ERR_MODULE_NOT_FOUND' ||
        error.code === 'ERR_UNSUPPORTED_DIR_IMPORT') {
      if (StringPrototypeStartsWith(specifier, 'file://')) {
        specifier = fileURLToPath(specifier);
      }
      const found = resolveAsCommonJS(specifier, parentURL);
      if (found) {
        // Modify the stack and message string to include the hint
        const lines = StringPrototypeSplit(error.stack, '\n');
        const hint = `Did you mean to import ${found}?`;
        error.stack =
          ArrayPrototypeShift(lines) + '\n' +
          hint + '\n' +
          ArrayPrototypeJoin(lines, '\n');
        error.message += `\n${hint}`;
      }
    }
    throw error;
  }

  if (isMain ? !preserveSymlinksMain : !preserveSymlinks) {
    const urlPath = fileURLToPath(url);
    const real = realpathSync(urlPath, {
      // [internalFS.realpathCacheKey]: realpathCache
    });
    const old = url;
    url = pathToFileURL(
      real + (StringPrototypeEndsWith(urlPath, sep) ? '/' : ''));
    url.search = old.search;
    url.hash = old.hash;
  }

  return { url: `${url}` };
}

return {
  DEFAULT_CONDITIONS,
  defaultResolve,
  encodedSepRegEx,
  getPackageType,
  packageExportsResolve,
  packageImportsResolve
};
}
module.exports = {
  createResolve
};


/***/ }),

/***/ 3348:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// copied from https://github.com/nodejs/node/blob/v15.3.0/lib/internal/modules/package_json_reader.js


const { SafeMap } = __nccwpck_require__(6326);
const { internalModuleReadJSON } = __nccwpck_require__(3601);
const { pathToFileURL } = __nccwpck_require__(7310);
const { toNamespacedPath } = __nccwpck_require__(1017);
// const { getOptionValue } = require('./node-options');

const cache = new SafeMap();

let manifest;

/**
 * @param {string} jsonPath
 * @return {{string: string, containsKeys: boolean}}
 */
function read(jsonPath) {
  if (cache.has(jsonPath)) {
    return cache.get(jsonPath);
  }

  const [string, containsKeys] = internalModuleReadJSON(
    toNamespacedPath(jsonPath)
  );
  const result = { string, containsKeys };
  if (string !== undefined) {
    if (manifest === undefined) {
      // manifest = getOptionValue('--experimental-policy') ?
      //   require('internal/process/policy').manifest :
      //   null;
      // disabled for now.  I am not sure if/how we should support this
      manifest = null;
    }
    if (manifest !== null) {
      const jsonURL = pathToFileURL(jsonPath);
      manifest.assertIntegrity(jsonURL, string);
    }
  }
  cache.set(jsonPath, result);
  return result;
}

module.exports = { read };


/***/ }),

/***/ 5818:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// copied from https://github.com/nodejs/node/blob/88799930794045795e8abac874730f9eba7e2300/lib/internal/repl/await.js


const {
  ArrayFrom,
  ArrayPrototypeForEach,
  ArrayPrototypeIncludes,
  ArrayPrototypeJoin,
  ArrayPrototypePop,
  ArrayPrototypePush,
  FunctionPrototype,
  ObjectKeys,
  RegExpPrototypeSymbolReplace,
  StringPrototypeEndsWith,
  StringPrototypeIncludes,
  StringPrototypeIndexOf,
  StringPrototypeRepeat,
  StringPrototypeSplit,
  StringPrototypeStartsWith,
  SyntaxError,
} = __nccwpck_require__(6326);

const parser = (__nccwpck_require__(390).Parser);
const walk = __nccwpck_require__(8390);
const { Recoverable } = __nccwpck_require__(8102);

function isTopLevelDeclaration(state) {
  return state.ancestors[state.ancestors.length - 2] === state.body;
}

const noop = FunctionPrototype;
const visitorsWithoutAncestors = {
  ClassDeclaration(node, state, c) {
    if (isTopLevelDeclaration(state)) {
      state.prepend(node, `${node.id.name}=`);
      ArrayPrototypePush(
        state.hoistedDeclarationStatements,
        `let ${node.id.name}; `
      );
    }

    walk.base.ClassDeclaration(node, state, c);
  },
  ForOfStatement(node, state, c) {
    if (node.await === true) {
      state.containsAwait = true;
    }
    walk.base.ForOfStatement(node, state, c);
  },
  FunctionDeclaration(node, state, c) {
    state.prepend(node, `${node.id.name}=`);
    ArrayPrototypePush(
      state.hoistedDeclarationStatements,
      `var ${node.id.name}; `
    );
  },
  FunctionExpression: noop,
  ArrowFunctionExpression: noop,
  MethodDefinition: noop,
  AwaitExpression(node, state, c) {
    state.containsAwait = true;
    walk.base.AwaitExpression(node, state, c);
  },
  ReturnStatement(node, state, c) {
    state.containsReturn = true;
    walk.base.ReturnStatement(node, state, c);
  },
  VariableDeclaration(node, state, c) {
    const variableKind = node.kind;
    const isIterableForDeclaration = ArrayPrototypeIncludes(
      ['ForOfStatement', 'ForInStatement'],
      state.ancestors[state.ancestors.length - 2].type
    );

    if (variableKind === 'var' || isTopLevelDeclaration(state)) {
      state.replace(
        node.start,
        node.start + variableKind.length + (isIterableForDeclaration ? 1 : 0),
        variableKind === 'var' && isIterableForDeclaration ?
          '' :
          'void' + (node.declarations.length === 1 ? '' : ' (')
      );

      if (!isIterableForDeclaration) {
        ArrayPrototypeForEach(node.declarations, (decl) => {
          state.prepend(decl, '(');
          state.append(decl, decl.init ? ')' : '=undefined)');
        });

        if (node.declarations.length !== 1) {
          state.append(node.declarations[node.declarations.length - 1], ')');
        }
      }

      const variableIdentifiersToHoist = [
        ['var', []],
        ['let', []],
      ];
      function registerVariableDeclarationIdentifiers(node) {
        switch (node.type) {
          case 'Identifier':
            ArrayPrototypePush(
              variableIdentifiersToHoist[variableKind === 'var' ? 0 : 1][1],
              node.name
            );
            break;
          case 'ObjectPattern':
            ArrayPrototypeForEach(node.properties, (property) => {
              registerVariableDeclarationIdentifiers(property.value);
            });
            break;
          case 'ArrayPattern':
            ArrayPrototypeForEach(node.elements, (element) => {
              registerVariableDeclarationIdentifiers(element);
            });
            break;
        }
      }

      ArrayPrototypeForEach(node.declarations, (decl) => {
        registerVariableDeclarationIdentifiers(decl.id);
      });

      ArrayPrototypeForEach(
        variableIdentifiersToHoist,
        ({ 0: kind, 1: identifiers }) => {
          if (identifiers.length > 0) {
            ArrayPrototypePush(
              state.hoistedDeclarationStatements,
              `${kind} ${ArrayPrototypeJoin(identifiers, ', ')}; `
            );
          }
        }
      );
    }

    walk.base.VariableDeclaration(node, state, c);
  }
};

const visitors = {};
for (const nodeType of ObjectKeys(walk.base)) {
  const callback = visitorsWithoutAncestors[nodeType] || walk.base[nodeType];
  visitors[nodeType] = (node, state, c) => {
    const isNew = node !== state.ancestors[state.ancestors.length - 1];
    if (isNew) {
      ArrayPrototypePush(state.ancestors, node);
    }
    callback(node, state, c);
    if (isNew) {
      ArrayPrototypePop(state.ancestors);
    }
  };
}

function processTopLevelAwait(src) {
  const wrapPrefix = '(async () => { ';
  const wrapped = `${wrapPrefix}${src} })()`;
  const wrappedArray = ArrayFrom(wrapped);
  let root;
  try {
    root = parser.parse(wrapped, { ecmaVersion: 'latest' });
  } catch (e) {
    if (StringPrototypeStartsWith(e.message, 'Unterminated '))
      throw new Recoverable(e);
    // If the parse error is before the first "await", then use the execution
    // error. Otherwise we must emit this parse error, making it look like a
    // proper syntax error.
    const awaitPos = StringPrototypeIndexOf(src, 'await');
    const errPos = e.pos - wrapPrefix.length;
    if (awaitPos > errPos)
      return null;
    // Convert keyword parse errors on await into their original errors when
    // possible.
    if (errPos === awaitPos + 6 &&
        StringPrototypeIncludes(e.message, 'Expecting Unicode escape sequence'))
      return null;
    if (errPos === awaitPos + 7 &&
        StringPrototypeIncludes(e.message, 'Unexpected token'))
      return null;
    const line = e.loc.line;
    const column = line === 1 ? e.loc.column - wrapPrefix.length : e.loc.column;
    let message = '\n' + StringPrototypeSplit(src, '\n')[line - 1] + '\n' +
        StringPrototypeRepeat(' ', column) +
        '^\n\n' + RegExpPrototypeSymbolReplace(/ \([^)]+\)/, e.message, '');
    // V8 unexpected token errors include the token string.
    if (StringPrototypeEndsWith(message, 'Unexpected token'))
      message += " '" +
        // Wrapper end may cause acorn to report error position after the source
        ((src.length - 1) >= (e.pos - wrapPrefix.length)
          ? src[e.pos - wrapPrefix.length]
          : src[src.length - 1]) +
        "'";
    // eslint-disable-next-line no-restricted-syntax
    throw new SyntaxError(message);
  }
  const body = root.body[0].expression.callee.body;
  const state = {
    body,
    ancestors: [],
    hoistedDeclarationStatements: [],
    replace(from, to, str) {
      for (let i = from; i < to; i++) {
        wrappedArray[i] = '';
      }
      if (from === to) str += wrappedArray[from];
      wrappedArray[from] = str;
    },
    prepend(node, str) {
      wrappedArray[node.start] = str + wrappedArray[node.start];
    },
    append(node, str) {
      wrappedArray[node.end - 1] += str;
    },
    containsAwait: false,
    containsReturn: false
  };

  walk.recursive(body, state, visitors);

  // Do not transform if
  // 1. False alarm: there isn't actually an await expression.
  // 2. There is a top-level return, which is not allowed.
  if (!state.containsAwait || state.containsReturn) {
    return null;
  }

  const last = body.body[body.body.length - 1];
  if (last.type === 'ExpressionStatement') {
    // For an expression statement of the form
    // ( expr ) ;
    // ^^^^^^^^^^   // last
    //   ^^^^       // last.expression
    //
    // We do not want the left parenthesis before the `return` keyword;
    // therefore we prepend the `return (` to `last`.
    //
    // On the other hand, we do not want the right parenthesis after the
    // semicolon. Since there can only be more right parentheses between
    // last.expression.end and the semicolon, appending one more to
    // last.expression should be fine.
    state.prepend(last, 'return (');
    state.append(last.expression, ')');
  }

  return (
    ArrayPrototypeJoin(state.hoistedDeclarationStatements, '') +
    ArrayPrototypeJoin(wrappedArray, '')
  );
}

module.exports = {
  processTopLevelAwait
};


/***/ }),

/***/ 3601:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const fs = __nccwpck_require__(7147);
const {versionGteLt} = __nccwpck_require__(4745);

// In node's core, this is implemented in C
// https://github.com/nodejs/node/blob/v15.3.0/src/node_file.cc#L891-L985
/**
 * @param {string} path
 * @returns {[] | [string, boolean]}
 */
function internalModuleReadJSON(path) {
  let string
  try {
    string = fs.readFileSync(path, 'utf8')
  } catch (e) {
    if (e.code === 'ENOENT') return []
    throw e
  }
  // Node's implementation checks for the presence of relevant keys: main, name, type, exports, imports
  // Node does this for performance to skip unnecessary parsing.
  // This would slow us down and, based on our usage, we can skip it.
  const containsKeys = true
  return [string, containsKeys]
}

// In node's core, this is implemented in C
// https://github.com/nodejs/node/blob/63e7dc1e5c71b70c80ed9eda230991edb00811e2/src/node_file.cc#L987-L1005
/**
 * @param {string} path
 * @returns {number} 0 = file, 1 = dir, negative = error
 */
function internalModuleStat(path) {
  const stat = fs.statSync(path, { throwIfNoEntry: false });
  if(!stat) return -1;
  if(stat.isFile()) return 0;
  if(stat.isDirectory()) return 1;
}

/**
 * @param {string} path
 * @returns {number} 0 = file, 1 = dir, negative = error
 */
function internalModuleStatInefficient(path) {
  try {
    const stat = fs.statSync(path);
    if(stat.isFile()) return 0;
    if(stat.isDirectory()) return 1;
  } catch(e) {
    return -e.errno || -1;
  }
}

const statSupportsThrowIfNoEntry = versionGteLt(process.versions.node, '15.3.0') ||
  versionGteLt(process.versions.node, '14.17.0', '15.0.0');

module.exports = {
  internalModuleReadJSON,
  internalModuleStat: statSupportsThrowIfNoEntry ? internalModuleStat : internalModuleStatInefficient
};


/***/ }),

/***/ 1597:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


// Node imports this from 'internal/bootstrap/loaders'
const Module = __nccwpck_require__(8188);
const NativeModule = {
  canBeRequiredByUsers(specifier) {
    return Module.builtinModules.includes(specifier)
  }
};
exports.NativeModule = NativeModule;


/***/ }),

/***/ 690:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

// Replacement for node's internal 'internal/options' module

exports.getOptionValue = getOptionValue;
function getOptionValue(opt) {
  parseOptions();
  return options[opt];
}

let options;
function parseOptions() {
  if (!options) {
    options = {
      '--preserve-symlinks': false,
      '--preserve-symlinks-main': false,
      '--input-type': undefined,
      '--experimental-specifier-resolution': 'explicit',
      '--experimental-policy': undefined,
      '--conditions': [],
      '--pending-deprecation': false,
      ...parseArgv(getNodeOptionsEnvArgv()),
      ...parseArgv(process.execArgv),
      ...getOptionValuesFromOtherEnvVars()
    }
  }
}

function parseArgv(argv) {
  return __nccwpck_require__(9482)({
    '--preserve-symlinks': Boolean,
    '--preserve-symlinks-main': Boolean,
    '--input-type': String,
    '--experimental-specifier-resolution': String,
    // Legacy alias for node versions prior to 12.16
    '--es-module-specifier-resolution': '--experimental-specifier-resolution',
    '--experimental-policy': String,
    '--conditions': [String],
    '--pending-deprecation': Boolean,
    '--experimental-json-modules': Boolean,
    '--experimental-wasm-modules': Boolean,
  }, {
    argv,
    permissive: true
  });
}

function getNodeOptionsEnvArgv() {
  const errors = [];
  const envArgv = ParseNodeOptionsEnvVar(process.env.NODE_OPTIONS || '', errors);
  if (errors.length !== 0) {
    // TODO: handle errors somehow
  }
  return envArgv;
}

// Direct JS port of C implementation: https://github.com/nodejs/node/blob/67ba825037b4082d5d16f922fb9ce54516b4a869/src/node_options.cc#L1024-L1063
function ParseNodeOptionsEnvVar(node_options, errors) {
  const env_argv = [];

  let is_in_string = false;
  let will_start_new_arg = true;
  for (let index = 0; index < node_options.length; ++index) {
      let c = node_options[index];

      // Backslashes escape the following character
      if (c === '\\' && is_in_string) {
          if (index + 1 === node_options.length) {
              errors.push("invalid value for NODE_OPTIONS " +
                  "(invalid escape)\n");
              return env_argv;
          } else {
              c = node_options[++index];
          }
      } else if (c === ' ' && !is_in_string) {
          will_start_new_arg = true;
          continue;
      } else if (c === '"') {
          is_in_string = !is_in_string;
          continue;
      }

      if (will_start_new_arg) {
          env_argv.push(c);
          will_start_new_arg = false;
      } else {
          env_argv[env_argv.length - 1] += c;
      }
  }

  if (is_in_string) {
      errors.push("invalid value for NODE_OPTIONS " +
          "(unterminated string)\n");
  }
  return env_argv;
}

// Get option values that can be specified via env vars besides NODE_OPTIONS
function getOptionValuesFromOtherEnvVars() {
  const options = {};
  if(process.env.NODE_PENDING_DEPRECATION === '1') {
    options['--pending-deprecation'] = true;
  }
  return options;
}


/***/ }),

/***/ 6326:
/***/ ((module) => {

module.exports = {
  ArrayFrom: Array.from,
  ArrayIsArray: Array.isArray,
  ArrayPrototypeShift: (obj) => Array.prototype.shift.call(obj),
  ArrayPrototypeForEach: (arr, ...rest) => Array.prototype.forEach.apply(arr, rest),
  ArrayPrototypeIncludes: (arr, ...rest) => Array.prototype.includes.apply(arr, rest),
  ArrayPrototypeJoin: (arr, ...rest) => Array.prototype.join.apply(arr, rest),
  ArrayPrototypePop: (arr, ...rest) => Array.prototype.pop.apply(arr, rest),
  ArrayPrototypePush: (arr, ...rest) => Array.prototype.push.apply(arr, rest),
  FunctionPrototype: Function.prototype,
  JSONParse: JSON.parse,
  JSONStringify: JSON.stringify,
  ObjectFreeze: Object.freeze,
  ObjectKeys: Object.keys,
  ObjectGetOwnPropertyNames: Object.getOwnPropertyNames,
  ObjectDefineProperty: Object.defineProperty,
  ObjectPrototypeHasOwnProperty: (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop),
  RegExpPrototypeExec: (obj, string) => RegExp.prototype.exec.call(obj, string),
  RegExpPrototypeTest: (obj, string) => RegExp.prototype.test.call(obj, string),
  RegExpPrototypeSymbolReplace: (obj, ...rest) => RegExp.prototype[Symbol.replace].apply(obj, rest),
  SafeMap: Map,
  SafeSet: Set,
  SafeWeakMap: WeakMap,
  StringPrototypeEndsWith: (str, ...rest) => String.prototype.endsWith.apply(str, rest),
  StringPrototypeIncludes: (str, ...rest) => String.prototype.includes.apply(str, rest),
  StringPrototypeLastIndexOf: (str, ...rest) => String.prototype.lastIndexOf.apply(str, rest),
  StringPrototypeIndexOf: (str, ...rest) => String.prototype.indexOf.apply(str, rest),
  StringPrototypeRepeat: (str, ...rest) => String.prototype.repeat.apply(str, rest),
  StringPrototypeReplace: (str, ...rest) => String.prototype.replace.apply(str, rest),
  StringPrototypeSlice: (str, ...rest) => String.prototype.slice.apply(str, rest),
  StringPrototypeSplit: (str, ...rest) => String.prototype.split.apply(str, rest),
  StringPrototypeStartsWith: (str, ...rest) => String.prototype.startsWith.apply(str, rest),
  StringPrototypeSubstr: (str, ...rest) => String.prototype.substr.apply(str, rest),
  StringPrototypeCharCodeAt: (str, ...rest) => String.prototype.charCodeAt.apply(str, rest),
  StringPrototypeMatch: (str, ...rest) => String.prototype.match.apply(str, rest),
  SyntaxError: SyntaxError
};


/***/ }),

/***/ 4414:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.installCommonjsResolveHooksIfNecessary = void 0;
/**
 * @internal
 */
function installCommonjsResolveHooksIfNecessary(tsNodeService) {
    const Module = __nccwpck_require__(8188);
    const originalResolveFilename = Module._resolveFilename;
    const originalFindPath = Module._findPath;
    const shouldInstallHook = tsNodeService.options.experimentalResolver;
    if (shouldInstallHook) {
        const { Module_findPath, Module_resolveFilename } = tsNodeService.getNodeCjsLoader();
        Module._resolveFilename = _resolveFilename;
        Module._findPath = _findPath;
        function _resolveFilename(request, parent, isMain, options, ...rest) {
            if (!tsNodeService.enabled())
                return originalResolveFilename.call(this, request, parent, isMain, options, ...rest);
            return Module_resolveFilename.call(this, request, parent, isMain, options, ...rest);
        }
        function _findPath() {
            if (!tsNodeService.enabled())
                return originalFindPath.apply(this, arguments);
            return Module_findPath.apply(this, arguments);
        }
    }
}
exports.installCommonjsResolveHooksIfNecessary = installCommonjsResolveHooksIfNecessary;
//# sourceMappingURL=cjs-resolve-hooks.js.map

/***/ }),

/***/ 9906:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getTsConfigDefaults = exports.ComputeAsCommonRootOfFiles = exports.loadCompiler = exports.resolveAndLoadCompiler = exports.readConfig = exports.findAndReadConfig = void 0;
const path_1 = __nccwpck_require__(1017);
const index_1 = __nccwpck_require__(2719);
const ts_internals_1 = __nccwpck_require__(4851);
const tsconfigs_1 = __nccwpck_require__(1533);
const util_1 = __nccwpck_require__(4745);
/**
 * TypeScript compiler option values required by `ts-node` which cannot be overridden.
 */
const TS_NODE_COMPILER_OPTIONS = {
    sourceMap: true,
    inlineSourceMap: false,
    inlineSources: true,
    declaration: false,
    noEmit: false,
    outDir: '.ts-node',
};
/*
 * Do post-processing on config options to support `ts-node`.
 */
function fixConfig(ts, config) {
    // Delete options that *should not* be passed through.
    delete config.options.out;
    delete config.options.outFile;
    delete config.options.composite;
    delete config.options.declarationDir;
    delete config.options.declarationMap;
    delete config.options.emitDeclarationOnly;
    // Target ES5 output by default (instead of ES3).
    if (config.options.target === undefined) {
        config.options.target = ts.ScriptTarget.ES5;
    }
    // Target CommonJS modules by default (instead of magically switching to ES6 when the target is ES6).
    if (config.options.module === undefined) {
        config.options.module = ts.ModuleKind.CommonJS;
    }
    return config;
}
/** @internal */
function findAndReadConfig(rawOptions) {
    var _a, _b, _c, _d, _e;
    const cwd = (0, path_1.resolve)((_c = (_b = (_a = rawOptions.cwd) !== null && _a !== void 0 ? _a : rawOptions.dir) !== null && _b !== void 0 ? _b : index_1.DEFAULTS.cwd) !== null && _c !== void 0 ? _c : process.cwd());
    const compilerName = (_d = rawOptions.compiler) !== null && _d !== void 0 ? _d : index_1.DEFAULTS.compiler;
    // Compute minimum options to read the config file.
    let projectLocalResolveDir = (0, util_1.getBasePathForProjectLocalDependencyResolution)(undefined, rawOptions.projectSearchDir, rawOptions.project, cwd);
    let { compiler, ts } = resolveAndLoadCompiler(compilerName, projectLocalResolveDir);
    // Read config file and merge new options between env and CLI options.
    const { configFilePath, config, tsNodeOptionsFromTsconfig, optionBasePaths } = readConfig(cwd, ts, rawOptions);
    const options = (0, util_1.assign)({}, index_1.DEFAULTS, tsNodeOptionsFromTsconfig || {}, { optionBasePaths }, rawOptions);
    options.require = [
        ...(tsNodeOptionsFromTsconfig.require || []),
        ...(rawOptions.require || []),
    ];
    // Re-resolve the compiler in case it has changed.
    // Compiler is loaded relative to tsconfig.json, so tsconfig discovery may cause us to load a
    // different compiler than we did above, even if the name has not changed.
    if (configFilePath) {
        projectLocalResolveDir = (0, util_1.getBasePathForProjectLocalDependencyResolution)(configFilePath, rawOptions.projectSearchDir, rawOptions.project, cwd);
        ({ compiler } = resolveCompiler(options.compiler, (_e = optionBasePaths.compiler) !== null && _e !== void 0 ? _e : projectLocalResolveDir));
    }
    return {
        options,
        config,
        projectLocalResolveDir,
        optionBasePaths,
        configFilePath,
        cwd,
        compiler,
    };
}
exports.findAndReadConfig = findAndReadConfig;
/**
 * Load TypeScript configuration. Returns the parsed TypeScript config and
 * any `ts-node` options specified in the config file.
 *
 * Even when a tsconfig.json is not loaded, this function still handles merging
 * compilerOptions from various sources: API, environment variables, etc.
 *
 * @internal
 */
function readConfig(cwd, ts, rawApiOptions) {
    var _a, _b, _c;
    // Ordered [a, b, c] where config a extends b extends c
    const configChain = [];
    let config = { compilerOptions: {} };
    let basePath = cwd;
    let configFilePath = undefined;
    const projectSearchDir = (0, path_1.resolve)(cwd, (_a = rawApiOptions.projectSearchDir) !== null && _a !== void 0 ? _a : cwd);
    const { fileExists = ts.sys.fileExists, readFile = ts.sys.readFile, skipProject = index_1.DEFAULTS.skipProject, project = index_1.DEFAULTS.project, tsTrace = index_1.DEFAULTS.tsTrace, } = rawApiOptions;
    // Read project configuration when available.
    if (!skipProject) {
        if (project) {
            const resolved = (0, path_1.resolve)(cwd, project);
            const nested = (0, path_1.join)(resolved, 'tsconfig.json');
            configFilePath = fileExists(nested) ? nested : resolved;
        }
        else {
            configFilePath = ts.findConfigFile(projectSearchDir, fileExists);
        }
        if (configFilePath) {
            let pathToNextConfigInChain = configFilePath;
            const tsInternals = (0, ts_internals_1.createTsInternals)(ts);
            const errors = [];
            // Follow chain of "extends"
            while (true) {
                const result = ts.readConfigFile(pathToNextConfigInChain, readFile);
                // Return diagnostics.
                if (result.error) {
                    return {
                        configFilePath,
                        config: { errors: [result.error], fileNames: [], options: {} },
                        tsNodeOptionsFromTsconfig: {},
                        optionBasePaths: {},
                    };
                }
                const c = result.config;
                const bp = (0, path_1.dirname)(pathToNextConfigInChain);
                configChain.push({
                    config: c,
                    basePath: bp,
                    configPath: pathToNextConfigInChain,
                });
                if (c.extends == null)
                    break;
                const resolvedExtendedConfigPath = tsInternals.getExtendsConfigPath(c.extends, {
                    fileExists,
                    readDirectory: ts.sys.readDirectory,
                    readFile,
                    useCaseSensitiveFileNames: ts.sys.useCaseSensitiveFileNames,
                    trace: tsTrace,
                }, bp, errors, ts.createCompilerDiagnostic);
                if (errors.length) {
                    return {
                        configFilePath,
                        config: { errors, fileNames: [], options: {} },
                        tsNodeOptionsFromTsconfig: {},
                        optionBasePaths: {},
                    };
                }
                if (resolvedExtendedConfigPath == null)
                    break;
                pathToNextConfigInChain = resolvedExtendedConfigPath;
            }
            ({ config, basePath } = configChain[0]);
        }
    }
    // Merge and fix ts-node options that come from tsconfig.json(s)
    const tsNodeOptionsFromTsconfig = {};
    const optionBasePaths = {};
    for (let i = configChain.length - 1; i >= 0; i--) {
        const { config, basePath, configPath } = configChain[i];
        const options = filterRecognizedTsConfigTsNodeOptions(config['ts-node']).recognized;
        // Some options are relative to the config file, so must be converted to absolute paths here
        if (options.require) {
            // Modules are found relative to the tsconfig file, not the `dir` option
            const tsconfigRelativeResolver = (0, util_1.createProjectLocalResolveHelper)((0, path_1.dirname)(configPath));
            options.require = options.require.map((path) => tsconfigRelativeResolver(path, false));
        }
        if (options.scopeDir) {
            options.scopeDir = (0, path_1.resolve)(basePath, options.scopeDir);
        }
        // Downstream code uses the basePath; we do not do that here.
        if (options.moduleTypes) {
            optionBasePaths.moduleTypes = basePath;
        }
        if (options.transpiler != null) {
            optionBasePaths.transpiler = basePath;
        }
        if (options.compiler != null) {
            optionBasePaths.compiler = basePath;
        }
        if (options.swc != null) {
            optionBasePaths.swc = basePath;
        }
        (0, util_1.assign)(tsNodeOptionsFromTsconfig, options);
    }
    // Remove resolution of "files".
    const files = (_c = (_b = rawApiOptions.files) !== null && _b !== void 0 ? _b : tsNodeOptionsFromTsconfig.files) !== null && _c !== void 0 ? _c : index_1.DEFAULTS.files;
    // Only if a config file is *not* loaded, load an implicit configuration from @tsconfig/bases
    const skipDefaultCompilerOptions = configFilePath != null;
    const defaultCompilerOptionsForNodeVersion = skipDefaultCompilerOptions
        ? undefined
        : {
            ...(0, tsconfigs_1.getDefaultTsconfigJsonForNodeVersion)(ts).compilerOptions,
            types: ['node'],
        };
    // Merge compilerOptions from all sources
    config.compilerOptions = Object.assign({}, 
    // automatically-applied options from @tsconfig/bases
    defaultCompilerOptionsForNodeVersion, 
    // tsconfig.json "compilerOptions"
    config.compilerOptions, 
    // from env var
    index_1.DEFAULTS.compilerOptions, 
    // tsconfig.json "ts-node": "compilerOptions"
    tsNodeOptionsFromTsconfig.compilerOptions, 
    // passed programmatically
    rawApiOptions.compilerOptions, 
    // overrides required by ts-node, cannot be changed
    TS_NODE_COMPILER_OPTIONS);
    const fixedConfig = fixConfig(ts, ts.parseJsonConfigFileContent(config, {
        fileExists,
        readFile,
        // Only used for globbing "files", "include", "exclude"
        // When `files` option disabled, we want to avoid the fs calls
        readDirectory: files ? ts.sys.readDirectory : () => [],
        useCaseSensitiveFileNames: ts.sys.useCaseSensitiveFileNames,
    }, basePath, undefined, configFilePath));
    return {
        configFilePath,
        config: fixedConfig,
        tsNodeOptionsFromTsconfig,
        optionBasePaths,
    };
}
exports.readConfig = readConfig;
/**
 * Load the typescript compiler. It is required to load the tsconfig but might
 * be changed by the tsconfig, so we have to do this twice.
 * @internal
 */
function resolveAndLoadCompiler(name, relativeToPath) {
    const { compiler } = resolveCompiler(name, relativeToPath);
    const ts = loadCompiler(compiler);
    return { compiler, ts };
}
exports.resolveAndLoadCompiler = resolveAndLoadCompiler;
function resolveCompiler(name, relativeToPath) {
    const projectLocalResolveHelper = (0, util_1.createProjectLocalResolveHelper)(relativeToPath);
    const compiler = projectLocalResolveHelper(name || 'typescript', true);
    return { compiler };
}
/** @internal */
function loadCompiler(compiler) {
    return (0, util_1.attemptRequireWithV8CompileCache)(require, compiler);
}
exports.loadCompiler = loadCompiler;
/**
 * Given the raw "ts-node" sub-object from a tsconfig, return an object with only the properties
 * recognized by "ts-node"
 */
function filterRecognizedTsConfigTsNodeOptions(jsonObject) {
    if (jsonObject == null)
        return { recognized: {}, unrecognized: {} };
    const { compiler, compilerHost, compilerOptions, emit, files, ignore, ignoreDiagnostics, logError, preferTsExts, pretty, require, skipIgnore, transpileOnly, typeCheck, transpiler, scope, scopeDir, moduleTypes, experimentalReplAwait, swc, experimentalResolver, esm, experimentalSpecifierResolution, experimentalTsImportSpecifiers, ...unrecognized } = jsonObject;
    const filteredTsConfigOptions = {
        compiler,
        compilerHost,
        compilerOptions,
        emit,
        experimentalReplAwait,
        files,
        ignore,
        ignoreDiagnostics,
        logError,
        preferTsExts,
        pretty,
        require,
        skipIgnore,
        transpileOnly,
        typeCheck,
        transpiler,
        scope,
        scopeDir,
        moduleTypes,
        swc,
        experimentalResolver,
        esm,
        experimentalSpecifierResolution,
        experimentalTsImportSpecifiers,
    };
    // Use the typechecker to make sure this implementation has the correct set of properties
    const catchExtraneousProps = null;
    const catchMissingProps = null;
    return { recognized: filteredTsConfigOptions, unrecognized };
}
/** @internal */
exports.ComputeAsCommonRootOfFiles = Symbol();
/**
 * Some TS compiler options have defaults which are not provided by TS's config parsing functions.
 * This function centralizes the logic for computing those defaults.
 * @internal
 */
function getTsConfigDefaults(config, basePath, _files, _include, _exclude) {
    const { composite = false } = config.options;
    let rootDir = config.options.rootDir;
    if (rootDir == null) {
        if (composite)
            rootDir = basePath;
        // Return this symbol to avoid computing from `files`, which would require fs calls
        else
            rootDir = exports.ComputeAsCommonRootOfFiles;
    }
    const { outDir = rootDir } = config.options;
    // Docs are wrong: https://www.typescriptlang.org/tsconfig#include
    // Docs say **, but it's actually **/*; compiler throws error for **
    const include = _files ? [] : ['**/*'];
    const files = _files !== null && _files !== void 0 ? _files : [];
    // Docs are misleading: https://www.typescriptlang.org/tsconfig#exclude
    // Docs say it excludes node_modules, bower_components, jspm_packages, but actually those are excluded via behavior of "include"
    const exclude = _exclude !== null && _exclude !== void 0 ? _exclude : [outDir]; // TODO technically, outDir is absolute path, but exclude should be relative glob pattern?
    // TODO compute baseUrl
    return { rootDir, outDir, include, files, exclude, composite };
}
exports.getTsConfigDefaults = getTsConfigDefaults;
//# sourceMappingURL=configuration.js.map

/***/ }),

/***/ 4998:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
exports.lT = __webpack_unused_export__ = __webpack_unused_export__ = void 0;
const index_1 = __nccwpck_require__(2719);
const url_1 = __nccwpck_require__(7310);
const path_1 = __nccwpck_require__(1017);
const assert = __nccwpck_require__(9491);
const util_1 = __nccwpck_require__(4745);
const module_1 = __nccwpck_require__(8188);
// The hooks API changed in node version X so we need to check for backwards compatibility.
const newHooksAPI = (0, util_1.versionGteLt)(process.versions.node, '16.12.0');
/** @internal */
function filterHooksByAPIVersion(hooks) {
    const { getFormat, load, resolve, transformSource } = hooks;
    // Explicit return type to avoid TS's non-ideal inferred type
    const hooksAPI = newHooksAPI
        ? { resolve, load, getFormat: undefined, transformSource: undefined }
        : { resolve, getFormat, transformSource, load: undefined };
    return hooksAPI;
}
__webpack_unused_export__ = filterHooksByAPIVersion;
/** @internal */
function registerAndCreateEsmHooks(opts) {
    // Automatically performs registration just like `-r ts-node/register`
    const tsNodeInstance = (0, index_1.register)(opts);
    return createEsmHooks(tsNodeInstance);
}
__webpack_unused_export__ = registerAndCreateEsmHooks;
function createEsmHooks(tsNodeService) {
    tsNodeService.enableExperimentalEsmLoaderInterop();
    // Custom implementation that considers additional file extensions and automatically adds file extensions
    const nodeResolveImplementation = tsNodeService.getNodeEsmResolver();
    const nodeGetFormatImplementation = tsNodeService.getNodeEsmGetFormat();
    const extensions = tsNodeService.extensions;
    const hooksAPI = filterHooksByAPIVersion({
        resolve,
        load,
        getFormat,
        transformSource,
    });
    function isFileUrlOrNodeStyleSpecifier(parsed) {
        // We only understand file:// URLs, but in node, the specifier can be a node-style `./foo` or `foo`
        const { protocol } = parsed;
        return protocol === null || protocol === 'file:';
    }
    /**
     * Named "probably" as a reminder that this is a guess.
     * node does not explicitly tell us if we're resolving the entrypoint or not.
     */
    function isProbablyEntrypoint(specifier, parentURL) {
        return parentURL === undefined && specifier.startsWith('file://');
    }
    // Side-channel between `resolve()` and `load()` hooks
    const rememberIsProbablyEntrypoint = new Set();
    const rememberResolvedViaCommonjsFallback = new Set();
    async function resolve(specifier, context, defaultResolve) {
        const defer = async () => {
            const r = await defaultResolve(specifier, context, defaultResolve);
            return r;
        };
        // See: https://github.com/nodejs/node/discussions/41711
        // nodejs will likely implement a similar fallback.  Till then, we can do our users a favor and fallback today.
        async function entrypointFallback(cb) {
            try {
                const resolution = await cb();
                if ((resolution === null || resolution === void 0 ? void 0 : resolution.url) &&
                    isProbablyEntrypoint(specifier, context.parentURL))
                    rememberIsProbablyEntrypoint.add(resolution.url);
                return resolution;
            }
            catch (esmResolverError) {
                if (!isProbablyEntrypoint(specifier, context.parentURL))
                    throw esmResolverError;
                try {
                    let cjsSpecifier = specifier;
                    // Attempt to convert from ESM file:// to CommonJS path
                    try {
                        if (specifier.startsWith('file://'))
                            cjsSpecifier = (0, url_1.fileURLToPath)(specifier);
                    }
                    catch { }
                    const resolution = (0, url_1.pathToFileURL)((0, module_1.createRequire)(process.cwd()).resolve(cjsSpecifier)).toString();
                    rememberIsProbablyEntrypoint.add(resolution);
                    rememberResolvedViaCommonjsFallback.add(resolution);
                    return { url: resolution, format: 'commonjs' };
                }
                catch (commonjsResolverError) {
                    throw esmResolverError;
                }
            }
        }
        return addShortCircuitFlag(async () => {
            const parsed = (0, url_1.parse)(specifier);
            const { pathname, protocol, hostname } = parsed;
            if (!isFileUrlOrNodeStyleSpecifier(parsed)) {
                return entrypointFallback(defer);
            }
            if (protocol !== null && protocol !== 'file:') {
                return entrypointFallback(defer);
            }
            // Malformed file:// URL?  We should always see `null` or `''`
            if (hostname) {
                // TODO file://./foo sets `hostname` to `'.'`.  Perhaps we should special-case this.
                return entrypointFallback(defer);
            }
            // pathname is the path to be resolved
            return entrypointFallback(() => nodeResolveImplementation.defaultResolve(specifier, context, defaultResolve));
        });
    }
    // `load` from new loader hook API (See description at the top of this file)
    async function load(url, context, defaultLoad) {
        return addShortCircuitFlag(async () => {
            var _a;
            // If we get a format hint from resolve() on the context then use it
            // otherwise call the old getFormat() hook using node's old built-in defaultGetFormat() that ships with ts-node
            const format = (_a = context.format) !== null && _a !== void 0 ? _a : (await getFormat(url, context, nodeGetFormatImplementation.defaultGetFormat)).format;
            let source = undefined;
            if (format !== 'builtin' && format !== 'commonjs') {
                // Call the new defaultLoad() to get the source
                const { source: rawSource } = await defaultLoad(url, {
                    ...context,
                    format,
                }, defaultLoad);
                if (rawSource === undefined || rawSource === null) {
                    throw new Error(`Failed to load raw source: Format was '${format}' and url was '${url}''.`);
                }
                // Emulate node's built-in old defaultTransformSource() so we can re-use the old transformSource() hook
                const defaultTransformSource = async (source, _context, _defaultTransformSource) => ({ source });
                // Call the old hook
                const { source: transformedSource } = await transformSource(rawSource, { url, format }, defaultTransformSource);
                source = transformedSource;
            }
            return { format, source };
        });
    }
    async function getFormat(url, context, defaultGetFormat) {
        const defer = (overrideUrl = url) => defaultGetFormat(overrideUrl, context, defaultGetFormat);
        // See: https://github.com/nodejs/node/discussions/41711
        // nodejs will likely implement a similar fallback.  Till then, we can do our users a favor and fallback today.
        async function entrypointFallback(cb) {
            try {
                return await cb();
            }
            catch (getFormatError) {
                if (!rememberIsProbablyEntrypoint.has(url))
                    throw getFormatError;
                return { format: 'commonjs' };
            }
        }
        const parsed = (0, url_1.parse)(url);
        if (!isFileUrlOrNodeStyleSpecifier(parsed)) {
            return entrypointFallback(defer);
        }
        const { pathname } = parsed;
        assert(pathname !== null, 'ESM getFormat() hook: URL should never have null pathname');
        const nativePath = (0, url_1.fileURLToPath)(url);
        let nodeSays;
        // If file has extension not understood by node, then ask node how it would treat the emitted extension.
        // E.g. .mts compiles to .mjs, so ask node how to classify an .mjs file.
        const ext = (0, path_1.extname)(nativePath);
        const tsNodeIgnored = tsNodeService.ignored(nativePath);
        const nodeEquivalentExt = extensions.nodeEquivalents.get(ext);
        if (nodeEquivalentExt && !tsNodeIgnored) {
            nodeSays = await entrypointFallback(() => defer((0, url_1.format)((0, url_1.pathToFileURL)(nativePath + nodeEquivalentExt))));
        }
        else {
            try {
                nodeSays = await entrypointFallback(defer);
            }
            catch (e) {
                if (e instanceof Error &&
                    tsNodeIgnored &&
                    extensions.nodeDoesNotUnderstand.includes(ext)) {
                    e.message +=
                        `\n\n` +
                            `Hint:\n` +
                            `ts-node is configured to ignore this file.\n` +
                            `If you want ts-node to handle this file, consider enabling the "skipIgnore" option or adjusting your "ignore" patterns.\n` +
                            `https://typestrong.org/ts-node/docs/scope\n`;
                }
                throw e;
            }
        }
        // For files compiled by ts-node that node believes are either CJS or ESM, check if we should override that classification
        if (!tsNodeService.ignored(nativePath) &&
            (nodeSays.format === 'commonjs' || nodeSays.format === 'module')) {
            const { moduleType } = tsNodeService.moduleTypeClassifier.classifyModuleByModuleTypeOverrides((0, util_1.normalizeSlashes)(nativePath));
            if (moduleType === 'cjs') {
                return { format: 'commonjs' };
            }
            else if (moduleType === 'esm') {
                return { format: 'module' };
            }
        }
        return nodeSays;
    }
    async function transformSource(source, context, defaultTransformSource) {
        if (source === null || source === undefined) {
            throw new Error('No source');
        }
        const defer = () => defaultTransformSource(source, context, defaultTransformSource);
        const sourceAsString = typeof source === 'string' ? source : source.toString('utf8');
        const { url } = context;
        const parsed = (0, url_1.parse)(url);
        if (!isFileUrlOrNodeStyleSpecifier(parsed)) {
            return defer();
        }
        const nativePath = (0, url_1.fileURLToPath)(url);
        if (tsNodeService.ignored(nativePath)) {
            return defer();
        }
        const emittedJs = tsNodeService.compile(sourceAsString, nativePath);
        return { source: emittedJs };
    }
    return hooksAPI;
}
exports.lT = createEsmHooks;
async function addShortCircuitFlag(fn) {
    const ret = await fn();
    // Not sure if this is necessary; being lazy.  Can revisit in the future.
    if (ret == null)
        return ret;
    return {
        ...ret,
        shortCircuit: true,
    };
}
//# sourceMappingURL=esm.js.map

/***/ }),

/***/ 5183:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getExtensions = void 0;
const util_1 = __nccwpck_require__(4745);
const nodeEquivalents = new Map([
    ['.ts', '.js'],
    ['.tsx', '.js'],
    ['.jsx', '.js'],
    ['.mts', '.mjs'],
    ['.cts', '.cjs'],
]);
const tsResolverEquivalents = new Map([
    ['.ts', ['.js']],
    ['.tsx', ['.js', '.jsx']],
    ['.mts', ['.mjs']],
    ['.cts', ['.cjs']],
]);
// All extensions understood by vanilla node
const vanillaNodeExtensions = [
    '.js',
    '.json',
    '.node',
    '.mjs',
    '.cjs',
];
// Extensions added by vanilla node's require() if you omit them:
// js, json, node
// Extensions added by vanilla node if you omit them with --experimental-specifier-resolution=node
// js, json, node, mjs
// Extensions added by ESM codepath's legacy package.json "main" resolver
// js, json, node (not mjs!)
const nodeDoesNotUnderstand = [
    '.ts',
    '.tsx',
    '.jsx',
    '.cts',
    '.mts',
];
/**
 * [MUST_UPDATE_FOR_NEW_FILE_EXTENSIONS]
 * @internal
 */
function getExtensions(config, options, tsVersion) {
    // TS 4.5 is first version to understand .cts, .mts, .cjs, and .mjs extensions
    const tsSupportsMtsCtsExts = (0, util_1.versionGteLt)(tsVersion, '4.5.0');
    const requiresHigherTypescriptVersion = [];
    if (!tsSupportsMtsCtsExts)
        requiresHigherTypescriptVersion.push('.cts', '.cjs', '.mts', '.mjs');
    const allPossibleExtensionsSortedByPreference = Array.from(new Set([
        ...(options.preferTsExts ? nodeDoesNotUnderstand : []),
        ...vanillaNodeExtensions,
        ...nodeDoesNotUnderstand,
    ]));
    const compiledJsUnsorted = ['.ts'];
    const compiledJsxUnsorted = [];
    if (config.options.jsx)
        compiledJsxUnsorted.push('.tsx');
    if (tsSupportsMtsCtsExts)
        compiledJsUnsorted.push('.mts', '.cts');
    if (config.options.allowJs) {
        compiledJsUnsorted.push('.js');
        if (config.options.jsx)
            compiledJsxUnsorted.push('.jsx');
        if (tsSupportsMtsCtsExts)
            compiledJsUnsorted.push('.mjs', '.cjs');
    }
    const compiledUnsorted = [...compiledJsUnsorted, ...compiledJsxUnsorted];
    const compiled = allPossibleExtensionsSortedByPreference.filter((ext) => compiledUnsorted.includes(ext));
    const compiledNodeDoesNotUnderstand = nodeDoesNotUnderstand.filter((ext) => compiled.includes(ext));
    /**
     * TS's resolver can resolve foo.js to foo.ts, by replacing .js extension with several source extensions.
     * IMPORTANT: Must preserve ordering according to preferTsExts!
     *            Must include the .js/.mjs/.cjs extension in the array!
     *            This affects resolution behavior!
     * [MUST_UPDATE_FOR_NEW_FILE_EXTENSIONS]
     */
    const r = allPossibleExtensionsSortedByPreference.filter((ext) => [...compiledUnsorted, '.js', '.mjs', '.cjs', '.mts', '.cts'].includes(ext));
    const replacementsForJs = r.filter((ext) => ['.js', '.jsx', '.ts', '.tsx'].includes(ext));
    const replacementsForJsx = r.filter((ext) => ['.jsx', '.tsx'].includes(ext));
    const replacementsForMjs = r.filter((ext) => ['.mjs', '.mts'].includes(ext));
    const replacementsForCjs = r.filter((ext) => ['.cjs', '.cts'].includes(ext));
    const replacementsForJsOrMjs = r.filter((ext) => ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.mts'].includes(ext));
    // Node allows omitting .js or .mjs extension in certain situations (CJS, ESM w/experimental flag)
    // So anything that compiles to .js or .mjs can also be omitted.
    const experimentalSpecifierResolutionAddsIfOmitted = Array.from(new Set([...replacementsForJsOrMjs, '.json', '.node']));
    // Same as above, except node curiuosly doesn't do .mjs here
    const legacyMainResolveAddsIfOmitted = Array.from(new Set([...replacementsForJs, '.json', '.node']));
    return {
        /** All file extensions we transform, ordered by resolution preference according to preferTsExts */
        compiled,
        /** Resolved extensions that vanilla node will not understand; we should handle them */
        nodeDoesNotUnderstand,
        /** Like the above, but only the ones we're compiling */
        compiledNodeDoesNotUnderstand,
        /**
         * Mapping from extensions understood by tsc to the equivalent for node,
         * as far as getFormat is concerned.
         */
        nodeEquivalents,
        /**
         * Mapping from extensions rejected by TSC in import specifiers, to the
         * possible alternatives that TS's resolver will accept.
         *
         * When we allow users to opt-in to .ts extensions in import specifiers, TS's
         * resolver requires us to replace the .ts extensions with .js alternatives.
         * Otherwise, resolution fails.
         *
         * Note TS's resolver is only used by, and only required for, typechecking.
         * This is separate from node's resolver, which we hook separately and which
         * does not require this mapping.
         */
        tsResolverEquivalents,
        /**
         * Extensions that we can support if the user upgrades their typescript version.
         * Used when raising hints.
         */
        requiresHigherTypescriptVersion,
        /**
         * --experimental-specifier-resolution=node will add these extensions.
         */
        experimentalSpecifierResolutionAddsIfOmitted,
        /**
         * ESM loader will add these extensions to package.json "main" field
         */
        legacyMainResolveAddsIfOmitted,
        replacementsForMjs,
        replacementsForCjs,
        replacementsForJsx,
        replacementsForJs,
    };
}
exports.getExtensions = getExtensions;
//# sourceMappingURL=file-extensions.js.map

/***/ }),

/***/ 2719:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createEsmHooks = exports.createFromPreloadedConfig = exports.create = exports.register = exports.TSError = exports.DEFAULTS = exports.VERSION = exports.debug = exports.INSPECT_CUSTOM = exports.env = exports.REGISTER_INSTANCE = exports.createRepl = void 0;
const path_1 = __nccwpck_require__(1017);
const module_1 = __nccwpck_require__(8188);
const util = __nccwpck_require__(3837);
const url_1 = __nccwpck_require__(7310);
const make_error_1 = __nccwpck_require__(1381);
const util_1 = __nccwpck_require__(4745);
const configuration_1 = __nccwpck_require__(9906);
const module_type_classifier_1 = __nccwpck_require__(3922);
const resolver_functions_1 = __nccwpck_require__(9148);
const cjs_resolve_hooks_1 = __nccwpck_require__(4414);
const node_module_type_classifier_1 = __nccwpck_require__(812);
const file_extensions_1 = __nccwpck_require__(5183);
const ts_transpile_module_1 = __nccwpck_require__(4444);
var repl_1 = __nccwpck_require__(204);
Object.defineProperty(exports, "createRepl", ({ enumerable: true, get: function () { return repl_1.createRepl; } }));
/**
 * Does this version of node obey the package.json "type" field
 * and throw ERR_REQUIRE_ESM when attempting to require() an ESM modules.
 */
const engineSupportsPackageTypeField = parseInt(process.versions.node.split('.')[0], 10) >= 12;
/**
 * Assert that script can be loaded as CommonJS when we attempt to require it.
 * If it should be loaded as ESM, throw ERR_REQUIRE_ESM like node does.
 *
 * Loaded conditionally so we don't need to support older node versions
 */
let assertScriptCanLoadAsCJS = engineSupportsPackageTypeField
    ? (__nccwpck_require__(1633).assertScriptCanLoadAsCJSImpl)
    : () => {
        /* noop */
    };
/**
 * Registered `ts-node` instance information.
 */
exports.REGISTER_INSTANCE = Symbol.for('ts-node.register.instance');
/** @internal */
exports.env = process.env;
/**
 * @internal
 */
exports.INSPECT_CUSTOM = util.inspect.custom || 'inspect';
/**
 * Debugging `ts-node`.
 */
const shouldDebug = (0, util_1.yn)(exports.env.TS_NODE_DEBUG);
/** @internal */
exports.debug = shouldDebug
    ? (...args) => console.log(`[ts-node ${new Date().toISOString()}]`, ...args)
    : () => undefined;
const debugFn = shouldDebug
    ? (key, fn) => {
        let i = 0;
        return (x) => {
            (0, exports.debug)(key, x, ++i);
            return fn(x);
        };
    }
    : (_, fn) => fn;
/**
 * Export the current version.
 */
exports.VERSION = __nccwpck_require__(6686).version;
/**
 * Default register options, including values specified via environment
 * variables.
 * @internal
 */
exports.DEFAULTS = {
    cwd: (_a = exports.env.TS_NODE_CWD) !== null && _a !== void 0 ? _a : exports.env.TS_NODE_DIR,
    emit: (0, util_1.yn)(exports.env.TS_NODE_EMIT),
    scope: (0, util_1.yn)(exports.env.TS_NODE_SCOPE),
    scopeDir: exports.env.TS_NODE_SCOPE_DIR,
    files: (0, util_1.yn)(exports.env.TS_NODE_FILES),
    pretty: (0, util_1.yn)(exports.env.TS_NODE_PRETTY),
    compiler: exports.env.TS_NODE_COMPILER,
    compilerOptions: (0, util_1.parse)(exports.env.TS_NODE_COMPILER_OPTIONS),
    ignore: (0, util_1.split)(exports.env.TS_NODE_IGNORE),
    project: exports.env.TS_NODE_PROJECT,
    skipProject: (0, util_1.yn)(exports.env.TS_NODE_SKIP_PROJECT),
    skipIgnore: (0, util_1.yn)(exports.env.TS_NODE_SKIP_IGNORE),
    preferTsExts: (0, util_1.yn)(exports.env.TS_NODE_PREFER_TS_EXTS),
    ignoreDiagnostics: (0, util_1.split)(exports.env.TS_NODE_IGNORE_DIAGNOSTICS),
    transpileOnly: (0, util_1.yn)(exports.env.TS_NODE_TRANSPILE_ONLY),
    typeCheck: (0, util_1.yn)(exports.env.TS_NODE_TYPE_CHECK),
    compilerHost: (0, util_1.yn)(exports.env.TS_NODE_COMPILER_HOST),
    logError: (0, util_1.yn)(exports.env.TS_NODE_LOG_ERROR),
    experimentalReplAwait: (_b = (0, util_1.yn)(exports.env.TS_NODE_EXPERIMENTAL_REPL_AWAIT)) !== null && _b !== void 0 ? _b : undefined,
    tsTrace: console.log.bind(console),
};
/**
 * TypeScript diagnostics error.
 */
class TSError extends make_error_1.BaseError {
    constructor(diagnosticText, diagnosticCodes, diagnostics = []) {
        super(`⨯ Unable to compile TypeScript:\n${diagnosticText}`);
        this.diagnosticCodes = diagnosticCodes;
        this.name = 'TSError';
        Object.defineProperty(this, 'diagnosticText', {
            configurable: true,
            writable: true,
            value: diagnosticText,
        });
        Object.defineProperty(this, 'diagnostics', {
            configurable: true,
            writable: true,
            value: diagnostics,
        });
    }
    /**
     * @internal
     */
    [exports.INSPECT_CUSTOM]() {
        return this.diagnosticText;
    }
}
exports.TSError = TSError;
const TS_NODE_SERVICE_BRAND = Symbol('TS_NODE_SERVICE_BRAND');
function register(serviceOrOpts) {
    // Is this a Service or a RegisterOptions?
    let service = serviceOrOpts;
    if (!(serviceOrOpts === null || serviceOrOpts === void 0 ? void 0 : serviceOrOpts[TS_NODE_SERVICE_BRAND])) {
        // Not a service; is options
        service = create((serviceOrOpts !== null && serviceOrOpts !== void 0 ? serviceOrOpts : {}));
    }
    const originalJsHandler = require.extensions['.js'];
    // Expose registered instance globally.
    process[exports.REGISTER_INSTANCE] = service;
    // Register the extensions.
    registerExtensions(service.options.preferTsExts, service.extensions.compiled, service, originalJsHandler);
    (0, cjs_resolve_hooks_1.installCommonjsResolveHooksIfNecessary)(service);
    // Require specified modules before start-up.
    module_1.Module._preloadModules(service.options.require);
    return service;
}
exports.register = register;
/**
 * Create TypeScript compiler instance.
 *
 * @category Basic
 */
function create(rawOptions = {}) {
    const foundConfigResult = (0, configuration_1.findAndReadConfig)(rawOptions);
    return createFromPreloadedConfig(foundConfigResult);
}
exports.create = create;
/** @internal */
function createFromPreloadedConfig(foundConfigResult) {
    var _a, _b, _c, _d;
    const { configFilePath, cwd, options, config, compiler, projectLocalResolveDir, optionBasePaths, } = foundConfigResult;
    const projectLocalResolveHelper = (0, util_1.createProjectLocalResolveHelper)(projectLocalResolveDir);
    const ts = (0, configuration_1.loadCompiler)(compiler);
    // Experimental REPL await is not compatible targets lower than ES2018
    const targetSupportsTla = config.options.target >= ts.ScriptTarget.ES2018;
    if (options.experimentalReplAwait === true && !targetSupportsTla) {
        throw new Error('Experimental REPL await is not compatible with targets lower than ES2018');
    }
    // Top-level await was added in TS 3.8
    const tsVersionSupportsTla = (0, util_1.versionGteLt)(ts.version, '3.8.0');
    if (options.experimentalReplAwait === true && !tsVersionSupportsTla) {
        throw new Error('Experimental REPL await is not compatible with TypeScript versions older than 3.8');
    }
    const shouldReplAwait = options.experimentalReplAwait !== false &&
        tsVersionSupportsTla &&
        targetSupportsTla;
    // swc implies two other options
    // typeCheck option was implemented specifically to allow overriding tsconfig transpileOnly from the command-line
    // So we should allow using typeCheck to override swc
    if (options.swc && !options.typeCheck) {
        if (options.transpileOnly === false) {
            throw new Error("Cannot enable 'swc' option with 'transpileOnly: false'.  'swc' implies 'transpileOnly'.");
        }
        if (options.transpiler) {
            throw new Error("Cannot specify both 'swc' and 'transpiler' options.  'swc' uses the built-in swc transpiler.");
        }
    }
    const readFile = options.readFile || ts.sys.readFile;
    const fileExists = options.fileExists || ts.sys.fileExists;
    // typeCheck can override transpileOnly, useful for CLI flag to override config file
    const transpileOnly = (options.transpileOnly === true || options.swc === true) &&
        options.typeCheck !== true;
    let transpiler = undefined;
    let transpilerBasePath = undefined;
    if (options.transpiler) {
        transpiler = options.transpiler;
        transpilerBasePath = optionBasePaths.transpiler;
    }
    else if (options.swc) {
        transpiler = __nccwpck_require__.ab + "swc.js";
        transpilerBasePath = optionBasePaths.swc;
    }
    const transformers = options.transformers || undefined;
    const diagnosticFilters = [
        {
            appliesToAllFiles: true,
            filenamesAbsolute: [],
            diagnosticsIgnored: [
                6059,
                18002,
                18003,
                ...(options.experimentalTsImportSpecifiers
                    ? [
                        2691, // "An import path cannot end with a '.ts' extension. Consider importing '<specifier without ext>' instead."
                    ]
                    : []),
                ...(options.ignoreDiagnostics || []),
            ].map(Number),
        },
    ];
    const configDiagnosticList = filterDiagnostics(config.errors, diagnosticFilters);
    const outputCache = new Map();
    const configFileDirname = configFilePath ? (0, path_1.dirname)(configFilePath) : null;
    const scopeDir = (_c = (_b = (_a = options.scopeDir) !== null && _a !== void 0 ? _a : config.options.rootDir) !== null && _b !== void 0 ? _b : configFileDirname) !== null && _c !== void 0 ? _c : cwd;
    const ignoreBaseDir = configFileDirname !== null && configFileDirname !== void 0 ? configFileDirname : cwd;
    const isScoped = options.scope
        ? (fileName) => (0, path_1.relative)(scopeDir, fileName).charAt(0) !== '.'
        : () => true;
    const shouldIgnore = createIgnore(ignoreBaseDir, options.skipIgnore
        ? []
        : (options.ignore || ['(?:^|/)node_modules/']).map((str) => new RegExp(str)));
    const diagnosticHost = {
        getNewLine: () => ts.sys.newLine,
        getCurrentDirectory: () => cwd,
        // TODO switch to getCanonicalFileName we already create later in scope
        getCanonicalFileName: ts.sys.useCaseSensitiveFileNames
            ? (x) => x
            : (x) => x.toLowerCase(),
    };
    if (options.transpileOnly && typeof transformers === 'function') {
        throw new TypeError('Transformers function is unavailable in "--transpile-only"');
    }
    let createTranspiler = initializeTranspilerFactory();
    function initializeTranspilerFactory() {
        var _a;
        if (__nccwpck_require__.ab + "swc.js") {
            if (!transpileOnly)
                throw new Error('Custom transpiler can only be used when transpileOnly is enabled.');
            const transpilerName = typeof transpiler === 'string' ? transpiler : transpiler[0];
            const transpilerOptions = typeof transpiler === 'string' ? {} : (_a = transpiler[1]) !== null && _a !== void 0 ? _a : {};
            const transpilerConfigLocalResolveHelper = transpilerBasePath
                ? (0, util_1.createProjectLocalResolveHelper)(transpilerBasePath)
                : projectLocalResolveHelper;
            const transpilerPath = transpilerConfigLocalResolveHelper(transpilerName, true);
            const transpilerFactory = __nccwpck_require__(3833)(transpilerPath)
                .create;
            return createTranspiler;
            function createTranspiler(compilerOptions, nodeModuleEmitKind) {
                return transpilerFactory === null || transpilerFactory === void 0 ? void 0 : transpilerFactory({
                    service: {
                        options,
                        config: {
                            ...config,
                            options: compilerOptions,
                        },
                        projectLocalResolveHelper,
                    },
                    transpilerConfigLocalResolveHelper,
                    nodeModuleEmitKind,
                    ...transpilerOptions,
                });
            }
        }
    }
    /**
     * True if require() hooks should interop with experimental ESM loader.
     * Enabled explicitly via a flag since it is a breaking change.
     */
    let experimentalEsmLoader = false;
    function enableExperimentalEsmLoaderInterop() {
        experimentalEsmLoader = true;
    }
    // Install source map support and read from memory cache.
    installSourceMapSupport();
    function installSourceMapSupport() {
        const sourceMapSupport = __nccwpck_require__(9964);
        sourceMapSupport.install({
            environment: 'node',
            retrieveFile(pathOrUrl) {
                var _a;
                let path = pathOrUrl;
                // If it's a file URL, convert to local path
                // Note: fileURLToPath does not exist on early node v10
                // I could not find a way to handle non-URLs except to swallow an error
                if (experimentalEsmLoader && path.startsWith('file://')) {
                    try {
                        path = (0, url_1.fileURLToPath)(path);
                    }
                    catch (e) {
                        /* swallow error */
                    }
                }
                path = (0, util_1.normalizeSlashes)(path);
                return ((_a = outputCache.get(path)) === null || _a === void 0 ? void 0 : _a.content) || '';
            },
            redirectConflictingLibrary: true,
            onConflictingLibraryRedirect(request, parent, isMain, options, redirectedRequest) {
                (0, exports.debug)(`Redirected an attempt to require source-map-support to instead receive @cspotcode/source-map-support.  "${parent.filename}" attempted to require or resolve "${request}" and was redirected to "${redirectedRequest}".`);
            },
        });
    }
    const shouldHavePrettyErrors = options.pretty === undefined ? process.stdout.isTTY : options.pretty;
    const formatDiagnostics = shouldHavePrettyErrors
        ? ts.formatDiagnosticsWithColorAndContext || ts.formatDiagnostics
        : ts.formatDiagnostics;
    function createTSError(diagnostics) {
        const diagnosticText = formatDiagnostics(diagnostics, diagnosticHost);
        const diagnosticCodes = diagnostics.map((x) => x.code);
        return new TSError(diagnosticText, diagnosticCodes, diagnostics);
    }
    function reportTSError(configDiagnosticList) {
        const error = createTSError(configDiagnosticList);
        if (options.logError) {
            // Print error in red color and continue execution.
            console.error('\x1b[31m%s\x1b[0m', error);
        }
        else {
            // Throw error and exit the script.
            throw error;
        }
    }
    // Render the configuration errors.
    if (configDiagnosticList.length)
        reportTSError(configDiagnosticList);
    const jsxEmitPreserve = config.options.jsx === ts.JsxEmit.Preserve;
    /**
     * Get the extension for a transpiled file.
     * [MUST_UPDATE_FOR_NEW_FILE_EXTENSIONS]
     */
    function getEmitExtension(path) {
        const lastDotIndex = path.lastIndexOf('.');
        if (lastDotIndex >= 0) {
            const ext = path.slice(lastDotIndex);
            switch (ext) {
                case '.js':
                case '.ts':
                    return '.js';
                case '.jsx':
                case '.tsx':
                    return jsxEmitPreserve ? '.jsx' : '.js';
                case '.mjs':
                case '.mts':
                    return '.mjs';
                case '.cjs':
                case '.cts':
                    return '.cjs';
            }
        }
        return '.js';
    }
    /**
     * Get output from TS compiler w/typechecking.  `undefined` in `transpileOnly`
     * mode.
     */
    let getOutput;
    let getTypeInfo;
    const getCanonicalFileName = ts.createGetCanonicalFileName(ts.sys.useCaseSensitiveFileNames);
    const moduleTypeClassifier = (0, module_type_classifier_1.createModuleTypeClassifier)({
        basePath: (_d = options.optionBasePaths) === null || _d === void 0 ? void 0 : _d.moduleTypes,
        patterns: options.moduleTypes,
    });
    const extensions = (0, file_extensions_1.getExtensions)(config, options, ts.version);
    // Use full language services when the fast option is disabled.
    if (!transpileOnly) {
        const fileContents = new Map();
        const rootFileNames = new Set(config.fileNames);
        const cachedReadFile = (0, util_1.cachedLookup)(debugFn('readFile', readFile));
        // Use language services by default
        if (!options.compilerHost) {
            let projectVersion = 1;
            const fileVersions = new Map(Array.from(rootFileNames).map((fileName) => [fileName, 0]));
            const getCustomTransformers = () => {
                if (typeof transformers === 'function') {
                    const program = service.getProgram();
                    return program ? transformers(program) : undefined;
                }
                return transformers;
            };
            // Create the compiler host for type checking.
            const serviceHost = {
                getProjectVersion: () => String(projectVersion),
                getScriptFileNames: () => Array.from(rootFileNames),
                getScriptVersion: (fileName) => {
                    const version = fileVersions.get(fileName);
                    return version ? version.toString() : '';
                },
                getScriptSnapshot(fileName) {
                    // TODO ordering of this with getScriptVersion?  Should they sync up?
                    let contents = fileContents.get(fileName);
                    // Read contents into TypeScript memory cache.
                    if (contents === undefined) {
                        contents = cachedReadFile(fileName);
                        if (contents === undefined)
                            return;
                        fileVersions.set(fileName, 1);
                        fileContents.set(fileName, contents);
                        projectVersion++;
                    }
                    return ts.ScriptSnapshot.fromString(contents);
                },
                readFile: cachedReadFile,
                readDirectory: ts.sys.readDirectory,
                getDirectories: (0, util_1.cachedLookup)(debugFn('getDirectories', ts.sys.getDirectories)),
                fileExists: (0, util_1.cachedLookup)(debugFn('fileExists', fileExists)),
                directoryExists: (0, util_1.cachedLookup)(debugFn('directoryExists', ts.sys.directoryExists)),
                realpath: ts.sys.realpath
                    ? (0, util_1.cachedLookup)(debugFn('realpath', ts.sys.realpath))
                    : undefined,
                getNewLine: () => ts.sys.newLine,
                useCaseSensitiveFileNames: () => ts.sys.useCaseSensitiveFileNames,
                getCurrentDirectory: () => cwd,
                getCompilationSettings: () => config.options,
                getDefaultLibFileName: () => ts.getDefaultLibFilePath(config.options),
                getCustomTransformers: getCustomTransformers,
                trace: options.tsTrace,
            };
            const { resolveModuleNames, getResolvedModuleWithFailedLookupLocationsFromCache, resolveTypeReferenceDirectives, isFileKnownToBeInternal, markBucketOfFilenameInternal, } = (0, resolver_functions_1.createResolverFunctions)({
                host: serviceHost,
                getCanonicalFileName,
                ts,
                cwd,
                config,
                projectLocalResolveHelper,
                options,
                extensions,
            });
            serviceHost.resolveModuleNames = resolveModuleNames;
            serviceHost.getResolvedModuleWithFailedLookupLocationsFromCache =
                getResolvedModuleWithFailedLookupLocationsFromCache;
            serviceHost.resolveTypeReferenceDirectives =
                resolveTypeReferenceDirectives;
            const registry = ts.createDocumentRegistry(ts.sys.useCaseSensitiveFileNames, cwd);
            const service = ts.createLanguageService(serviceHost, registry);
            const updateMemoryCache = (contents, fileName) => {
                // Add to `rootFiles` as necessary, either to make TS include a file it has not seen,
                // or to trigger a re-classification of files from external to internal.
                if (!rootFileNames.has(fileName) &&
                    !isFileKnownToBeInternal(fileName)) {
                    markBucketOfFilenameInternal(fileName);
                    rootFileNames.add(fileName);
                    // Increment project version for every change to rootFileNames.
                    projectVersion++;
                }
                const previousVersion = fileVersions.get(fileName) || 0;
                const previousContents = fileContents.get(fileName);
                // Avoid incrementing cache when nothing has changed.
                if (contents !== previousContents) {
                    fileVersions.set(fileName, previousVersion + 1);
                    fileContents.set(fileName, contents);
                    // Increment project version for every file change.
                    projectVersion++;
                }
            };
            let previousProgram = undefined;
            getOutput = (code, fileName) => {
                updateMemoryCache(code, fileName);
                const programBefore = service.getProgram();
                if (programBefore !== previousProgram) {
                    (0, exports.debug)(`compiler rebuilt Program instance when getting output for ${fileName}`);
                }
                const output = service.getEmitOutput(fileName);
                // Get the relevant diagnostics - this is 3x faster than `getPreEmitDiagnostics`.
                const diagnostics = service
                    .getSemanticDiagnostics(fileName)
                    .concat(service.getSyntacticDiagnostics(fileName));
                const programAfter = service.getProgram();
                (0, exports.debug)('invariant: Is service.getProject() identical before and after getting emit output and diagnostics? (should always be true) ', programBefore === programAfter);
                previousProgram = programAfter;
                const diagnosticList = filterDiagnostics(diagnostics, diagnosticFilters);
                if (diagnosticList.length)
                    reportTSError(diagnosticList);
                if (output.emitSkipped) {
                    return [undefined, undefined, true];
                }
                // Throw an error when requiring `.d.ts` files.
                if (output.outputFiles.length === 0) {
                    throw new TypeError(`Unable to require file: ${(0, path_1.relative)(cwd, fileName)}\n` +
                        'This is usually the result of a faulty configuration or import. ' +
                        'Make sure there is a `.js`, `.json` or other executable extension with ' +
                        'loader attached before `ts-node` available.');
                }
                return [output.outputFiles[1].text, output.outputFiles[0].text, false];
            };
            getTypeInfo = (code, fileName, position) => {
                const normalizedFileName = (0, util_1.normalizeSlashes)(fileName);
                updateMemoryCache(code, normalizedFileName);
                const info = service.getQuickInfoAtPosition(normalizedFileName, position);
                const name = ts.displayPartsToString(info ? info.displayParts : []);
                const comment = ts.displayPartsToString(info ? info.documentation : []);
                return { name, comment };
            };
        }
        else {
            const sys = {
                ...ts.sys,
                ...diagnosticHost,
                readFile: (fileName) => {
                    const cacheContents = fileContents.get(fileName);
                    if (cacheContents !== undefined)
                        return cacheContents;
                    const contents = cachedReadFile(fileName);
                    if (contents)
                        fileContents.set(fileName, contents);
                    return contents;
                },
                readDirectory: ts.sys.readDirectory,
                getDirectories: (0, util_1.cachedLookup)(debugFn('getDirectories', ts.sys.getDirectories)),
                fileExists: (0, util_1.cachedLookup)(debugFn('fileExists', fileExists)),
                directoryExists: (0, util_1.cachedLookup)(debugFn('directoryExists', ts.sys.directoryExists)),
                resolvePath: (0, util_1.cachedLookup)(debugFn('resolvePath', ts.sys.resolvePath)),
                realpath: ts.sys.realpath
                    ? (0, util_1.cachedLookup)(debugFn('realpath', ts.sys.realpath))
                    : undefined,
            };
            const host = ts.createIncrementalCompilerHost
                ? ts.createIncrementalCompilerHost(config.options, sys)
                : {
                    ...sys,
                    getSourceFile: (fileName, languageVersion) => {
                        const contents = sys.readFile(fileName);
                        if (contents === undefined)
                            return;
                        return ts.createSourceFile(fileName, contents, languageVersion);
                    },
                    getDefaultLibLocation: () => (0, util_1.normalizeSlashes)((0, path_1.dirname)(compiler)),
                    getDefaultLibFileName: () => (0, util_1.normalizeSlashes)((0, path_1.join)((0, path_1.dirname)(compiler), ts.getDefaultLibFileName(config.options))),
                    useCaseSensitiveFileNames: () => sys.useCaseSensitiveFileNames,
                };
            host.trace = options.tsTrace;
            const { resolveModuleNames, resolveTypeReferenceDirectives, isFileKnownToBeInternal, markBucketOfFilenameInternal, } = (0, resolver_functions_1.createResolverFunctions)({
                host,
                cwd,
                config,
                ts,
                getCanonicalFileName,
                projectLocalResolveHelper,
                options,
                extensions,
            });
            host.resolveModuleNames = resolveModuleNames;
            host.resolveTypeReferenceDirectives = resolveTypeReferenceDirectives;
            // Fallback for older TypeScript releases without incremental API.
            let builderProgram = ts.createIncrementalProgram
                ? ts.createIncrementalProgram({
                    rootNames: Array.from(rootFileNames),
                    options: config.options,
                    host,
                    configFileParsingDiagnostics: config.errors,
                    projectReferences: config.projectReferences,
                })
                : ts.createEmitAndSemanticDiagnosticsBuilderProgram(Array.from(rootFileNames), config.options, host, undefined, config.errors, config.projectReferences);
            // Read and cache custom transformers.
            const customTransformers = typeof transformers === 'function'
                ? transformers(builderProgram.getProgram())
                : transformers;
            // Set the file contents into cache manually.
            const updateMemoryCache = (contents, fileName) => {
                const previousContents = fileContents.get(fileName);
                const contentsChanged = previousContents !== contents;
                if (contentsChanged) {
                    fileContents.set(fileName, contents);
                }
                // Add to `rootFiles` when discovered by compiler for the first time.
                let addedToRootFileNames = false;
                if (!rootFileNames.has(fileName) &&
                    !isFileKnownToBeInternal(fileName)) {
                    markBucketOfFilenameInternal(fileName);
                    rootFileNames.add(fileName);
                    addedToRootFileNames = true;
                }
                // Update program when file changes.
                if (addedToRootFileNames || contentsChanged) {
                    builderProgram = ts.createEmitAndSemanticDiagnosticsBuilderProgram(Array.from(rootFileNames), config.options, host, builderProgram, config.errors, config.projectReferences);
                }
            };
            getOutput = (code, fileName) => {
                let outText = '';
                let outMap = '';
                updateMemoryCache(code, fileName);
                const sourceFile = builderProgram.getSourceFile(fileName);
                if (!sourceFile)
                    throw new TypeError(`Unable to read file: ${fileName}`);
                const program = builderProgram.getProgram();
                const diagnostics = ts.getPreEmitDiagnostics(program, sourceFile);
                const diagnosticList = filterDiagnostics(diagnostics, diagnosticFilters);
                if (diagnosticList.length)
                    reportTSError(diagnosticList);
                const result = builderProgram.emit(sourceFile, (path, file, writeByteOrderMark) => {
                    if (path.endsWith('.map')) {
                        outMap = file;
                    }
                    else {
                        outText = file;
                    }
                    if (options.emit)
                        sys.writeFile(path, file, writeByteOrderMark);
                }, undefined, undefined, customTransformers);
                if (result.emitSkipped) {
                    return [undefined, undefined, true];
                }
                // Throw an error when requiring files that cannot be compiled.
                if (outText === '') {
                    if (program.isSourceFileFromExternalLibrary(sourceFile)) {
                        throw new TypeError(`Unable to compile file from external library: ${(0, path_1.relative)(cwd, fileName)}`);
                    }
                    throw new TypeError(`Unable to require file: ${(0, path_1.relative)(cwd, fileName)}\n` +
                        'This is usually the result of a faulty configuration or import. ' +
                        'Make sure there is a `.js`, `.json` or other executable extension with ' +
                        'loader attached before `ts-node` available.');
                }
                return [outText, outMap, false];
            };
            getTypeInfo = (code, fileName, position) => {
                const normalizedFileName = (0, util_1.normalizeSlashes)(fileName);
                updateMemoryCache(code, normalizedFileName);
                const sourceFile = builderProgram.getSourceFile(normalizedFileName);
                if (!sourceFile)
                    throw new TypeError(`Unable to read file: ${fileName}`);
                const node = getTokenAtPosition(ts, sourceFile, position);
                const checker = builderProgram.getProgram().getTypeChecker();
                const symbol = checker.getSymbolAtLocation(node);
                if (!symbol)
                    return { name: '', comment: '' };
                const type = checker.getTypeOfSymbolAtLocation(symbol, node);
                const signatures = [
                    ...type.getConstructSignatures(),
                    ...type.getCallSignatures(),
                ];
                return {
                    name: signatures.length
                        ? signatures.map((x) => checker.signatureToString(x)).join('\n')
                        : checker.typeToString(type),
                    comment: ts.displayPartsToString(symbol ? symbol.getDocumentationComment(checker) : []),
                };
            };
            // Write `.tsbuildinfo` when `--build` is enabled.
            if (options.emit && config.options.incremental) {
                process.on('exit', () => {
                    // Emits `.tsbuildinfo` to filesystem.
                    builderProgram.getProgram().emitBuildInfo();
                });
            }
        }
    }
    else {
        getTypeInfo = () => {
            throw new TypeError('Type information is unavailable in "--transpile-only"');
        };
    }
    function createTranspileOnlyGetOutputFunction(overrideModuleType, nodeModuleEmitKind) {
        const compilerOptions = { ...config.options };
        if (overrideModuleType !== undefined)
            compilerOptions.module = overrideModuleType;
        let customTranspiler = createTranspiler === null || createTranspiler === void 0 ? void 0 : createTranspiler(compilerOptions, nodeModuleEmitKind);
        let tsTranspileModule = (0, util_1.versionGteLt)(ts.version, '4.7.0')
            ? (0, ts_transpile_module_1.createTsTranspileModule)(ts, {
                compilerOptions,
                reportDiagnostics: true,
                transformers: transformers,
            })
            : undefined;
        return (code, fileName) => {
            let result;
            if (customTranspiler) {
                result = customTranspiler.transpile(code, {
                    fileName,
                });
            }
            else if (tsTranspileModule) {
                result = tsTranspileModule(code, {
                    fileName,
                }, nodeModuleEmitKind === 'nodeesm' ? 'module' : 'commonjs');
            }
            else {
                result = ts.transpileModule(code, {
                    fileName,
                    compilerOptions,
                    reportDiagnostics: true,
                    transformers: transformers,
                });
            }
            const diagnosticList = filterDiagnostics(result.diagnostics || [], diagnosticFilters);
            if (diagnosticList.length)
                reportTSError(diagnosticList);
            return [result.outputText, result.sourceMapText, false];
        };
    }
    // When true, these mean that a `moduleType` override will cause a different emit
    // than the TypeScript compiler, so we *must* overwrite the emit.
    const shouldOverwriteEmitWhenForcingCommonJS = config.options.module !== ts.ModuleKind.CommonJS;
    // [MUST_UPDATE_FOR_NEW_MODULEKIND]
    const shouldOverwriteEmitWhenForcingEsm = !(config.options.module === ts.ModuleKind.ES2015 ||
        (ts.ModuleKind.ES2020 && config.options.module === ts.ModuleKind.ES2020) ||
        (ts.ModuleKind.ES2022 && config.options.module === ts.ModuleKind.ES2022) ||
        config.options.module === ts.ModuleKind.ESNext);
    /**
     * node16 or nodenext
     * [MUST_UPDATE_FOR_NEW_MODULEKIND]
     */
    const isNodeModuleType = (ts.ModuleKind.Node16 && config.options.module === ts.ModuleKind.Node16) ||
        (ts.ModuleKind.NodeNext &&
            config.options.module === ts.ModuleKind.NodeNext);
    const getOutputForceCommonJS = createTranspileOnlyGetOutputFunction(ts.ModuleKind.CommonJS);
    const getOutputForceNodeCommonJS = createTranspileOnlyGetOutputFunction(ts.ModuleKind.NodeNext, 'nodecjs');
    const getOutputForceNodeESM = createTranspileOnlyGetOutputFunction(ts.ModuleKind.NodeNext, 'nodeesm');
    // [MUST_UPDATE_FOR_NEW_MODULEKIND]
    const getOutputForceESM = createTranspileOnlyGetOutputFunction(ts.ModuleKind.ES2022 || ts.ModuleKind.ES2020 || ts.ModuleKind.ES2015);
    const getOutputTranspileOnly = createTranspileOnlyGetOutputFunction();
    // Create a simple TypeScript compiler proxy.
    function compile(code, fileName, lineOffset = 0) {
        const normalizedFileName = (0, util_1.normalizeSlashes)(fileName);
        const classification = moduleTypeClassifier.classifyModuleByModuleTypeOverrides(normalizedFileName);
        let value = '';
        let sourceMap = '';
        let emitSkipped = true;
        if (getOutput) {
            // Must always call normal getOutput to throw typechecking errors
            [value, sourceMap, emitSkipped] = getOutput(code, normalizedFileName);
        }
        // If module classification contradicts the above, call the relevant transpiler
        if (classification.moduleType === 'cjs' &&
            (shouldOverwriteEmitWhenForcingCommonJS || emitSkipped)) {
            [value, sourceMap] = getOutputForceCommonJS(code, normalizedFileName);
        }
        else if (classification.moduleType === 'esm' &&
            (shouldOverwriteEmitWhenForcingEsm || emitSkipped)) {
            [value, sourceMap] = getOutputForceESM(code, normalizedFileName);
        }
        else if (emitSkipped) {
            // Happens when ts compiler skips emit or in transpileOnly mode
            const classification = (0, node_module_type_classifier_1.classifyModule)(fileName, isNodeModuleType);
            [value, sourceMap] =
                classification === 'nodecjs'
                    ? getOutputForceNodeCommonJS(code, normalizedFileName)
                    : classification === 'nodeesm'
                        ? getOutputForceNodeESM(code, normalizedFileName)
                        : classification === 'cjs'
                            ? getOutputForceCommonJS(code, normalizedFileName)
                            : classification === 'esm'
                                ? getOutputForceESM(code, normalizedFileName)
                                : getOutputTranspileOnly(code, normalizedFileName);
        }
        const output = updateOutput(value, normalizedFileName, sourceMap, getEmitExtension);
        outputCache.set(normalizedFileName, { content: output });
        return output;
    }
    let active = true;
    const enabled = (enabled) => enabled === undefined ? active : (active = !!enabled);
    const ignored = (fileName) => {
        if (!active)
            return true;
        const ext = (0, path_1.extname)(fileName);
        if (extensions.compiled.includes(ext)) {
            return !isScoped(fileName) || shouldIgnore(fileName);
        }
        return true;
    };
    function addDiagnosticFilter(filter) {
        diagnosticFilters.push({
            ...filter,
            filenamesAbsolute: filter.filenamesAbsolute.map((f) => (0, util_1.normalizeSlashes)(f)),
        });
    }
    const getNodeEsmResolver = (0, util_1.once)(() => (__nccwpck_require__(7968).createResolve)({
        extensions,
        preferTsExts: options.preferTsExts,
        tsNodeExperimentalSpecifierResolution: options.experimentalSpecifierResolution,
    }));
    const getNodeEsmGetFormat = (0, util_1.once)(() => (__nccwpck_require__(7207).createGetFormat)(options.experimentalSpecifierResolution, getNodeEsmResolver()));
    const getNodeCjsLoader = (0, util_1.once)(() => (__nccwpck_require__(1633).createCjsLoader)({
        extensions,
        preferTsExts: options.preferTsExts,
        nodeEsmResolver: getNodeEsmResolver(),
    }));
    return {
        [TS_NODE_SERVICE_BRAND]: true,
        ts,
        compilerPath: compiler,
        config,
        compile,
        getTypeInfo,
        ignored,
        enabled,
        options,
        configFilePath,
        moduleTypeClassifier,
        shouldReplAwait,
        addDiagnosticFilter,
        installSourceMapSupport,
        enableExperimentalEsmLoaderInterop,
        transpileOnly,
        projectLocalResolveHelper,
        getNodeEsmResolver,
        getNodeEsmGetFormat,
        getNodeCjsLoader,
        extensions,
    };
}
exports.createFromPreloadedConfig = createFromPreloadedConfig;
/**
 * Check if the filename should be ignored.
 */
function createIgnore(ignoreBaseDir, ignore) {
    return (fileName) => {
        const relname = (0, path_1.relative)(ignoreBaseDir, fileName);
        const path = (0, util_1.normalizeSlashes)(relname);
        return ignore.some((x) => x.test(path));
    };
}
/**
 * Register the extensions to support when importing files.
 */
function registerExtensions(preferTsExts, extensions, service, originalJsHandler) {
    const exts = new Set(extensions);
    // Can't add these extensions cuz would allow omitting file extension; node requires ext for .cjs and .mjs
    // Unless they're already registered by something else (nyc does this):
    // then we *must* hook them or else our transformer will not be called.
    for (const cannotAdd of ['.mts', '.cts', '.mjs', '.cjs']) {
        if (exts.has(cannotAdd) && !(0, util_1.hasOwnProperty)(require.extensions, cannotAdd)) {
            // Unrecognized file exts can be transformed via the `.js` handler.
            exts.add('.js');
            exts.delete(cannotAdd);
        }
    }
    // Register new extensions.
    for (const ext of exts) {
        registerExtension(ext, service, originalJsHandler);
    }
    if (preferTsExts) {
        const preferredExtensions = new Set([
            ...exts,
            ...Object.keys(require.extensions),
        ]);
        // Re-sort iteration order of Object.keys()
        for (const ext of preferredExtensions) {
            const old = Object.getOwnPropertyDescriptor(require.extensions, ext);
            delete require.extensions[ext];
            Object.defineProperty(require.extensions, ext, old);
        }
    }
}
/**
 * Register the extension for node.
 */
function registerExtension(ext, service, originalHandler) {
    const old = require.extensions[ext] || originalHandler;
    require.extensions[ext] = function (m, filename) {
        if (service.ignored(filename))
            return old(m, filename);
        assertScriptCanLoadAsCJS(service, m, filename);
        const _compile = m._compile;
        m._compile = function (code, fileName) {
            (0, exports.debug)('module._compile', fileName);
            const result = service.compile(code, fileName);
            return _compile.call(this, result, fileName);
        };
        return old(m, filename);
    };
}
/**
 * Update the output remapping the source map.
 */
function updateOutput(outputText, fileName, sourceMap, getEmitExtension) {
    const base64Map = Buffer.from(updateSourceMap(sourceMap, fileName), 'utf8').toString('base64');
    const sourceMapContent = `//# sourceMappingURL=data:application/json;charset=utf-8;base64,${base64Map}`;
    // Expected form: `//# sourceMappingURL=foo bar.js.map` or `//# sourceMappingURL=foo%20bar.js.map` for input file "foo bar.tsx"
    // Percent-encoding behavior added in TS 4.1.1: https://github.com/microsoft/TypeScript/issues/40951
    const prefix = '//# sourceMappingURL=';
    const prefixLength = prefix.length;
    const baseName = /*foo.tsx*/ (0, path_1.basename)(fileName);
    const extName = /*.tsx*/ (0, path_1.extname)(fileName);
    const extension = /*.js*/ getEmitExtension(fileName);
    const sourcemapFilename = baseName.slice(0, -extName.length) + extension + '.map';
    const sourceMapLengthWithoutPercentEncoding = prefixLength + sourcemapFilename.length;
    /*
     * Only rewrite if existing directive exists at the location we expect, to support:
     *   a) compilers that do not append a sourcemap directive
     *   b) situations where we did the math wrong
     *     Not ideal, but appending our sourcemap *after* a pre-existing sourcemap still overrides, so the end-user is happy.
     */
    if (outputText.substr(-sourceMapLengthWithoutPercentEncoding, prefixLength) ===
        prefix) {
        return (outputText.slice(0, -sourceMapLengthWithoutPercentEncoding) +
            sourceMapContent);
    }
    // If anyone asks why we're not using URL, the URL equivalent is: `u = new URL('http://d'); u.pathname = "/" + sourcemapFilename; return u.pathname.slice(1);
    const sourceMapLengthWithPercentEncoding = prefixLength + encodeURI(sourcemapFilename).length;
    if (outputText.substr(-sourceMapLengthWithPercentEncoding, prefixLength) ===
        prefix) {
        return (outputText.slice(0, -sourceMapLengthWithPercentEncoding) +
            sourceMapContent);
    }
    return `${outputText}\n${sourceMapContent}`;
}
/**
 * Update the source map contents for improved output.
 */
function updateSourceMap(sourceMapText, fileName) {
    const sourceMap = JSON.parse(sourceMapText);
    sourceMap.file = fileName;
    sourceMap.sources = [fileName];
    delete sourceMap.sourceRoot;
    return JSON.stringify(sourceMap);
}
/**
 * Filter diagnostics.
 */
function filterDiagnostics(diagnostics, filters) {
    return diagnostics.filter((d) => filters.every((f) => {
        var _a;
        return (!f.appliesToAllFiles &&
            f.filenamesAbsolute.indexOf((_a = d.file) === null || _a === void 0 ? void 0 : _a.fileName) === -1) ||
            f.diagnosticsIgnored.indexOf(d.code) === -1;
    }));
}
/**
 * Get token at file position.
 *
 * Reference: https://github.com/microsoft/TypeScript/blob/fcd9334f57d85b73dd66ad2d21c02e84822f4841/src/services/utilities.ts#L705-L731
 */
function getTokenAtPosition(ts, sourceFile, position) {
    let current = sourceFile;
    outer: while (true) {
        for (const child of current.getChildren(sourceFile)) {
            const start = child.getFullStart();
            if (start > position)
                break;
            const end = child.getEnd();
            if (position <= end) {
                current = child;
                continue outer;
            }
        }
        return current;
    }
}
/**
 * Create an implementation of node's ESM loader hooks.
 *
 * This may be useful if you
 * want to wrap or compose the loader hooks to add additional functionality or
 * combine with another loader.
 *
 * Node changed the hooks API, so there are two possible APIs.  This function
 * detects your node version and returns the appropriate API.
 *
 * @category ESM Loader
 */
const createEsmHooks = (tsNodeService) => (__nccwpck_require__(4998)/* .createEsmHooks */ .lT)(tsNodeService);
exports.createEsmHooks = createEsmHooks;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3922:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createModuleTypeClassifier = void 0;
const ts_internals_1 = __nccwpck_require__(4851);
const util_1 = __nccwpck_require__(4745);
/**
 * @internal
 * May receive non-normalized options -- basePath and patterns -- and will normalize them
 * internally.
 * However, calls to `classifyModule` must pass pre-normalized paths!
 */
function createModuleTypeClassifier(options) {
    const { patterns, basePath: _basePath } = options;
    const basePath = _basePath !== undefined
        ? (0, util_1.normalizeSlashes)(_basePath).replace(/\/$/, '')
        : undefined;
    const patternTypePairs = Object.entries(patterns !== null && patterns !== void 0 ? patterns : []).map(([_pattern, type]) => {
        const pattern = (0, util_1.normalizeSlashes)(_pattern);
        return { pattern: parsePattern(basePath, pattern), type };
    });
    const classifications = {
        package: {
            moduleType: 'auto',
        },
        cjs: {
            moduleType: 'cjs',
        },
        esm: {
            moduleType: 'esm',
        },
    };
    const auto = classifications.package;
    // Passed path must be normalized!
    function classifyModuleNonCached(path) {
        const matched = matchPatterns(patternTypePairs, (_) => _.pattern, path);
        if (matched)
            return classifications[matched.type];
        return auto;
    }
    const classifyModule = (0, util_1.cachedLookup)(classifyModuleNonCached);
    function classifyModuleAuto(path) {
        return auto;
    }
    return {
        classifyModuleByModuleTypeOverrides: patternTypePairs.length
            ? classifyModule
            : classifyModuleAuto,
    };
}
exports.createModuleTypeClassifier = createModuleTypeClassifier;
function parsePattern(basePath, patternString) {
    const pattern = (0, ts_internals_1.getPatternFromSpec)(patternString, basePath);
    return pattern !== undefined ? new RegExp(pattern) : /(?:)/;
}
function matchPatterns(objects, getPattern, candidate) {
    for (let i = objects.length - 1; i >= 0; i--) {
        const object = objects[i];
        const pattern = getPattern(object);
        if (pattern === null || pattern === void 0 ? void 0 : pattern.test(candidate)) {
            return object;
        }
    }
}
//# sourceMappingURL=module-type-classifier.js.map

/***/ }),

/***/ 812:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.classifyModule = void 0;
const node_internal_modules_cjs_loader_1 = __nccwpck_require__(1633);
/**
 * Determine how to emit a module based on tsconfig "module" and package.json "type"
 *
 * Supports module=nodenext/node16 with transpileOnly, where we cannot ask the
 * TS typechecker to tell us if a file is CJS or ESM.
 *
 * Return values indicate:
 * - cjs
 * - esm
 * - nodecjs == node-flavored cjs where dynamic imports are *not* transformed into `require()`
 * - undefined == emit according to tsconfig `module` config, whatever that is
 * @internal
 */
function classifyModule(nativeFilename, isNodeModuleType) {
    // [MUST_UPDATE_FOR_NEW_FILE_EXTENSIONS]
    const lastDotIndex = nativeFilename.lastIndexOf('.');
    const ext = lastDotIndex >= 0 ? nativeFilename.slice(lastDotIndex) : '';
    switch (ext) {
        case '.cjs':
        case '.cts':
            return isNodeModuleType ? 'nodecjs' : 'cjs';
        case '.mjs':
        case '.mts':
            return isNodeModuleType ? 'nodeesm' : 'esm';
    }
    if (isNodeModuleType) {
        const packageScope = (0, node_internal_modules_cjs_loader_1.readPackageScope)(nativeFilename);
        if (packageScope && packageScope.data.type === 'module')
            return 'nodeesm';
        return 'nodecjs';
    }
    return undefined;
}
exports.classifyModule = classifyModule;
//# sourceMappingURL=node-module-type-classifier.js.map

/***/ }),

/***/ 204:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.setupContext = exports.createEvalAwarePartialHost = exports.EvalState = exports.createRepl = exports.REPL_NAME = exports.REPL_FILENAME = exports.STDIN_NAME = exports.STDIN_FILENAME = exports.EVAL_NAME = exports.EVAL_FILENAME = void 0;
const os_1 = __nccwpck_require__(2037);
const path_1 = __nccwpck_require__(1017);
const repl_1 = __nccwpck_require__(8102);
const vm_1 = __nccwpck_require__(6144);
const index_1 = __nccwpck_require__(2719);
const fs_1 = __nccwpck_require__(7147);
const console_1 = __nccwpck_require__(6206);
const assert = __nccwpck_require__(9491);
const module_1 = __nccwpck_require__(8188);
// Lazy-loaded.
let _processTopLevelAwait;
function getProcessTopLevelAwait() {
    if (_processTopLevelAwait === undefined) {
        ({
            processTopLevelAwait: _processTopLevelAwait,
        } = __nccwpck_require__(5818));
    }
    return _processTopLevelAwait;
}
let diff;
function getDiffLines() {
    if (diff === undefined) {
        diff = __nccwpck_require__(1672);
    }
    return diff.diffLines;
}
/** @internal */
exports.EVAL_FILENAME = `[eval].ts`;
/** @internal */
exports.EVAL_NAME = `[eval]`;
/** @internal */
exports.STDIN_FILENAME = `[stdin].ts`;
/** @internal */
exports.STDIN_NAME = `[stdin]`;
/** @internal */
exports.REPL_FILENAME = '<repl>.ts';
/** @internal */
exports.REPL_NAME = '<repl>';
/**
 * Create a ts-node REPL instance.
 *
 * Pay close attention to the example below.  Today, the API requires a few lines
 * of boilerplate to correctly bind the `ReplService` to the ts-node `Service` and
 * vice-versa.
 *
 * Usage example:
 *
 *     const repl = tsNode.createRepl();
 *     const service = tsNode.create({...repl.evalAwarePartialHost});
 *     repl.setService(service);
 *     repl.start();
 *
 * @category REPL
 */
function createRepl(options = {}) {
    var _a, _b, _c, _d, _e;
    const { ignoreDiagnosticsThatAreAnnoyingInInteractiveRepl = true } = options;
    let service = options.service;
    let nodeReplServer;
    // If `useGlobal` is not true, then REPL creates a context when started.
    // This stores a reference to it or to `global`, whichever is used, after REPL has started.
    let context;
    const state = (_a = options.state) !== null && _a !== void 0 ? _a : new EvalState((0, path_1.join)(process.cwd(), exports.REPL_FILENAME));
    const evalAwarePartialHost = createEvalAwarePartialHost(state, options.composeWithEvalAwarePartialHost);
    const stdin = (_b = options.stdin) !== null && _b !== void 0 ? _b : process.stdin;
    const stdout = (_c = options.stdout) !== null && _c !== void 0 ? _c : process.stdout;
    const stderr = (_d = options.stderr) !== null && _d !== void 0 ? _d : process.stderr;
    const _console = stdout === process.stdout && stderr === process.stderr
        ? console
        : new console_1.Console(stdout, stderr);
    const replService = {
        state: (_e = options.state) !== null && _e !== void 0 ? _e : new EvalState((0, path_1.join)(process.cwd(), exports.EVAL_FILENAME)),
        setService,
        evalCode,
        evalCodeInternal,
        nodeEval,
        evalAwarePartialHost,
        start,
        startInternal,
        stdin,
        stdout,
        stderr,
        console: _console,
    };
    return replService;
    function setService(_service) {
        service = _service;
        if (ignoreDiagnosticsThatAreAnnoyingInInteractiveRepl) {
            service.addDiagnosticFilter({
                appliesToAllFiles: false,
                filenamesAbsolute: [state.path],
                diagnosticsIgnored: [
                    2393,
                    6133,
                    7027,
                    ...(service.shouldReplAwait ? topLevelAwaitDiagnosticCodes : []),
                ],
            });
        }
    }
    function evalCode(code) {
        const result = appendCompileAndEvalInput({
            service: service,
            state,
            input: code,
            context,
            overrideIsCompletion: false,
        });
        assert(result.containsTopLevelAwait === false);
        return result.value;
    }
    function evalCodeInternal(options) {
        const { code, enableTopLevelAwait, context } = options;
        return appendCompileAndEvalInput({
            service: service,
            state,
            input: code,
            enableTopLevelAwait,
            context,
        });
    }
    function nodeEval(code, context, _filename, callback) {
        // TODO: Figure out how to handle completion here.
        if (code === '.scope') {
            callback(null);
            return;
        }
        try {
            const evalResult = evalCodeInternal({
                code,
                enableTopLevelAwait: true,
                context,
            });
            if (evalResult.containsTopLevelAwait) {
                (async () => {
                    try {
                        callback(null, await evalResult.valuePromise);
                    }
                    catch (promiseError) {
                        handleError(promiseError);
                    }
                })();
            }
            else {
                callback(null, evalResult.value);
            }
        }
        catch (error) {
            handleError(error);
        }
        // Log TSErrors, check if they're recoverable, log helpful hints for certain
        // well-known errors, and invoke `callback()`
        // TODO should evalCode API get the same error-handling benefits?
        function handleError(error) {
            var _a, _b;
            // Don't show TLA hint if the user explicitly disabled repl top level await
            const canLogTopLevelAwaitHint = service.options.experimentalReplAwait !== false &&
                !service.shouldReplAwait;
            if (error instanceof index_1.TSError) {
                // Support recoverable compilations using >= node 6.
                if (repl_1.Recoverable && isRecoverable(error)) {
                    callback(new repl_1.Recoverable(error));
                    return;
                }
                else {
                    _console.error(error);
                    if (canLogTopLevelAwaitHint &&
                        error.diagnosticCodes.some((dC) => topLevelAwaitDiagnosticCodes.includes(dC))) {
                        _console.error(getTopLevelAwaitHint());
                    }
                    callback(null);
                }
            }
            else {
                let _error = error;
                if (canLogTopLevelAwaitHint &&
                    _error instanceof SyntaxError &&
                    ((_a = _error.message) === null || _a === void 0 ? void 0 : _a.includes('await is only valid'))) {
                    try {
                        // Only way I know to make our hint appear after the error
                        _error.message += `\n\n${getTopLevelAwaitHint()}`;
                        _error.stack = (_b = _error.stack) === null || _b === void 0 ? void 0 : _b.replace(/(SyntaxError:.*)/, (_, $1) => `${$1}\n\n${getTopLevelAwaitHint()}`);
                    }
                    catch { }
                }
                callback(_error);
            }
        }
        function getTopLevelAwaitHint() {
            return `Hint: REPL top-level await requires TypeScript version 3.8 or higher and target ES2018 or higher. You are using TypeScript ${service.ts.version} and target ${service.ts.ScriptTarget[service.config.options.target]}.`;
        }
    }
    // Note: `code` argument is deprecated
    function start(code) {
        startInternal({ code });
    }
    // Note: `code` argument is deprecated
    function startInternal(options) {
        const { code, forceToBeModule = true, ...optionsOverride } = options !== null && options !== void 0 ? options : {};
        // TODO assert that `service` is set; remove all `service!` non-null assertions
        // Eval incoming code before the REPL starts.
        // Note: deprecated
        if (code) {
            try {
                evalCode(`${code}\n`);
            }
            catch (err) {
                _console.error(err);
                // Note: should not be killing the process here, but this codepath is deprecated anyway
                process.exit(1);
            }
        }
        // In case the typescript compiler hasn't compiled anything yet,
        // make it run though compilation at least one time before
        // the REPL starts for a snappier user experience on startup.
        service === null || service === void 0 ? void 0 : service.compile('', state.path);
        const repl = (0, repl_1.start)({
            prompt: '> ',
            input: replService.stdin,
            output: replService.stdout,
            // Mimicking node's REPL implementation: https://github.com/nodejs/node/blob/168b22ba073ee1cbf8d0bcb4ded7ff3099335d04/lib/internal/repl.js#L28-L30
            terminal: stdout.isTTY &&
                !parseInt(index_1.env.NODE_NO_READLINE, 10),
            eval: nodeEval,
            useGlobal: true,
            ...optionsOverride,
        });
        nodeReplServer = repl;
        context = repl.context;
        // Bookmark the point where we should reset the REPL state.
        const resetEval = appendToEvalState(state, '');
        function reset() {
            resetEval();
            // Hard fix for TypeScript forcing `Object.defineProperty(exports, ...)`.
            runInContext('exports = module.exports', state.path, context);
            if (forceToBeModule) {
                state.input += 'export {};void 0;\n';
            }
            // Declare node builtins.
            // Skip the same builtins as `addBuiltinLibsToObject`:
            //   those starting with _
            //   those containing /
            //   those that already exist as globals
            // Intentionally suppress type errors in case @types/node does not declare any of them, and because
            // `declare import` is technically invalid syntax.
            // Avoid this when in transpileOnly, because third-party transpilers may not handle `declare import`.
            if (!(service === null || service === void 0 ? void 0 : service.transpileOnly)) {
                state.input += `// @ts-ignore\n${module_1.builtinModules
                    .filter((name) => !name.startsWith('_') &&
                    !name.includes('/') &&
                    !['console', 'module', 'process'].includes(name))
                    .map((name) => `declare import ${name} = require('${name}')`)
                    .join(';')}\n`;
            }
        }
        reset();
        repl.on('reset', reset);
        repl.defineCommand('type', {
            help: 'Check the type of a TypeScript identifier',
            action: function (identifier) {
                if (!identifier) {
                    repl.displayPrompt();
                    return;
                }
                const undo = appendToEvalState(state, identifier);
                const { name, comment } = service.getTypeInfo(state.input, state.path, state.input.length);
                undo();
                if (name)
                    repl.outputStream.write(`${name}\n`);
                if (comment)
                    repl.outputStream.write(`${comment}\n`);
                repl.displayPrompt();
            },
        });
        // Set up REPL history when available natively via node.js >= 11.
        if (repl.setupHistory) {
            const historyPath = index_1.env.TS_NODE_HISTORY || (0, path_1.join)((0, os_1.homedir)(), '.ts_node_repl_history');
            repl.setupHistory(historyPath, (err) => {
                if (!err)
                    return;
                _console.error(err);
                process.exit(1);
            });
        }
        return repl;
    }
}
exports.createRepl = createRepl;
/**
 * Eval state management. Stores virtual `[eval].ts` file
 */
class EvalState {
    constructor(path) {
        this.path = path;
        /** @internal */
        this.input = '';
        /** @internal */
        this.output = '';
        /** @internal */
        this.version = 0;
        /** @internal */
        this.lines = 0;
    }
}
exports.EvalState = EvalState;
function createEvalAwarePartialHost(state, composeWith) {
    function readFile(path) {
        if (path === state.path)
            return state.input;
        if (composeWith === null || composeWith === void 0 ? void 0 : composeWith.readFile)
            return composeWith.readFile(path);
        try {
            return (0, fs_1.readFileSync)(path, 'utf8');
        }
        catch (err) {
            /* Ignore. */
        }
    }
    function fileExists(path) {
        if (path === state.path)
            return true;
        if (composeWith === null || composeWith === void 0 ? void 0 : composeWith.fileExists)
            return composeWith.fileExists(path);
        try {
            const stats = (0, fs_1.statSync)(path);
            return stats.isFile() || stats.isFIFO();
        }
        catch (err) {
            return false;
        }
    }
    return { readFile, fileExists };
}
exports.createEvalAwarePartialHost = createEvalAwarePartialHost;
const sourcemapCommentRe = /\/\/# ?sourceMappingURL=\S+[\s\r\n]*$/;
/**
 * Evaluate the code snippet.
 *
 * Append it to virtual .ts file, compile, handle compiler errors, compute a diff of the JS, and eval any code that
 * appears as "added" in the diff.
 */
function appendCompileAndEvalInput(options) {
    const { service, state, wrappedErr, enableTopLevelAwait = false, context, overrideIsCompletion, } = options;
    let { input } = options;
    // It's confusing for `{ a: 1 }` to be interpreted as a block statement
    // rather than an object literal. So, we first try to wrap it in
    // parentheses, so that it will be interpreted as an expression.
    // Based on https://github.com/nodejs/node/blob/c2e6822153bad023ab7ebd30a6117dcc049e475c/lib/repl.js#L413-L422
    let wrappedCmd = false;
    if (!wrappedErr && /^\s*{/.test(input) && !/;\s*$/.test(input)) {
        input = `(${input.trim()})\n`;
        wrappedCmd = true;
    }
    const lines = state.lines;
    const isCompletion = overrideIsCompletion !== null && overrideIsCompletion !== void 0 ? overrideIsCompletion : !/\n$/.test(input);
    const undo = appendToEvalState(state, input);
    let output;
    // Based on https://github.com/nodejs/node/blob/92573721c7cff104ccb82b6ed3e8aa69c4b27510/lib/repl.js#L457-L461
    function adjustUseStrict(code) {
        // "void 0" keeps the repl from returning "use strict" as the result
        // value for statements and declarations that don't return a value.
        return code.replace(/^"use strict";/, '"use strict"; void 0;');
    }
    try {
        output = service.compile(state.input, state.path, -lines);
    }
    catch (err) {
        undo();
        if (wrappedCmd) {
            if (err instanceof index_1.TSError && err.diagnosticCodes[0] === 2339) {
                // Ensure consistent and more sane behavior between { a: 1 }['b'] and ({ a: 1 }['b'])
                throw err;
            }
            // Unwrap and try again
            return appendCompileAndEvalInput({
                ...options,
                wrappedErr: err,
            });
        }
        if (wrappedErr)
            throw wrappedErr;
        throw err;
    }
    output = adjustUseStrict(output);
    // Note: REPL does not respect sourcemaps!
    // To properly do that, we'd need to prefix the code we eval -- which comes
    // from `diffLines` -- with newlines so that it's at the proper line numbers.
    // Then we'd need to ensure each bit of eval-ed code, if there are multiples,
    // has the sourcemap appended to it.
    // We might also need to integrate with our sourcemap hooks' cache; I'm not sure.
    const outputWithoutSourcemapComment = output.replace(sourcemapCommentRe, '');
    const oldOutputWithoutSourcemapComment = state.output.replace(sourcemapCommentRe, '');
    // Use `diff` to check for new JavaScript to execute.
    const changes = getDiffLines()(oldOutputWithoutSourcemapComment, outputWithoutSourcemapComment);
    if (isCompletion) {
        undo();
    }
    else {
        state.output = output;
        // Insert a semicolon to make sure that the code doesn't interact with the next line,
        // for example to prevent `2\n+ 2` from producing 4.
        // This is safe since the output will not change since we can only get here with successful inputs,
        // and adding a semicolon to the end of a successful input won't ever change the output.
        state.input = state.input.replace(/([^\n\s])([\n\s]*)$/, (all, lastChar, whitespace) => {
            if (lastChar !== ';')
                return `${lastChar};${whitespace}`;
            return all;
        });
    }
    let commands = [];
    let containsTopLevelAwait = false;
    // Build a list of "commands": bits of JS code in the diff that must be executed.
    for (const change of changes) {
        if (change.added) {
            if (enableTopLevelAwait &&
                service.shouldReplAwait &&
                change.value.indexOf('await') > -1) {
                const processTopLevelAwait = getProcessTopLevelAwait();
                // Newline prevents comments to mess with wrapper
                const wrappedResult = processTopLevelAwait(change.value + '\n');
                if (wrappedResult !== null) {
                    containsTopLevelAwait = true;
                    commands.push({
                        mustAwait: true,
                        execCommand: () => runInContext(wrappedResult, state.path, context),
                    });
                    continue;
                }
            }
            commands.push({
                execCommand: () => runInContext(change.value, state.path, context),
            });
        }
    }
    // Execute all commands asynchronously if necessary, returning the result or a
    // promise of the result.
    if (containsTopLevelAwait) {
        return {
            containsTopLevelAwait,
            valuePromise: (async () => {
                let value;
                for (const command of commands) {
                    const r = command.execCommand();
                    value = command.mustAwait ? await r : r;
                }
                return value;
            })(),
        };
    }
    else {
        return {
            containsTopLevelAwait: false,
            value: commands.reduce((_, c) => c.execCommand(), undefined),
        };
    }
}
/**
 * Low-level execution of JS code in context
 */
function runInContext(code, filename, context) {
    const script = new vm_1.Script(code, { filename });
    if (context === undefined || context === global) {
        return script.runInThisContext();
    }
    else {
        return script.runInContext(context);
    }
}
/**
 * Append to the eval instance and return an undo function.
 */
function appendToEvalState(state, input) {
    const undoInput = state.input;
    const undoVersion = state.version;
    const undoOutput = state.output;
    const undoLines = state.lines;
    state.input += input;
    state.lines += lineCount(input);
    state.version++;
    return function () {
        state.input = undoInput;
        state.output = undoOutput;
        state.version = undoVersion;
        state.lines = undoLines;
    };
}
/**
 * Count the number of lines.
 */
function lineCount(value) {
    let count = 0;
    for (const char of value) {
        if (char === '\n') {
            count++;
        }
    }
    return count;
}
/**
 * TS diagnostic codes which are recoverable, meaning that the user likely entered an incomplete line of code
 * and should be prompted for the next.  For example, starting a multi-line for() loop and not finishing it.
 * null value means code is always recoverable.  `Set` means code is only recoverable when occurring alongside at least one
 * of the other codes.
 */
const RECOVERY_CODES = new Map([
    [1003, null],
    [1005, null],
    [1109, null],
    [1126, null],
    [
        1136,
        new Set([1005]), // happens when typing out an object literal or block scope across multiple lines: '{ foo: 123,'
    ],
    [1160, null],
    [1161, null],
    [2355, null],
    [2391, null],
    [
        7010,
        new Set([1005]), // happens when fn signature spread across multiple lines: 'function a(\nb: any\n) {'
    ],
]);
/**
 * Diagnostic codes raised when using top-level await.
 * These are suppressed when top-level await is enabled.
 * When it is *not* enabled, these trigger a helpful hint about enabling top-level await.
 */
const topLevelAwaitDiagnosticCodes = [
    1375,
    1378,
    1431,
    1432, // Top-level 'for await' loops are only allowed when the 'module' option is set to 'esnext' or 'system', and the 'target' option is set to 'es2017' or higher.
];
/**
 * Check if a function can recover gracefully.
 */
function isRecoverable(error) {
    return error.diagnosticCodes.every((code) => {
        const deps = RECOVERY_CODES.get(code);
        return (deps === null ||
            (deps && error.diagnosticCodes.some((code) => deps.has(code))));
    });
}
/**
 * @internal
 * Set properties on `context` before eval-ing [stdin] or [eval] input.
 */
function setupContext(context, module, filenameAndDirname) {
    if (filenameAndDirname) {
        context.__dirname = '.';
        context.__filename = `[${filenameAndDirname}]`;
    }
    context.module = module;
    context.exports = module.exports;
    context.require = __nccwpck_require__(3833).bind(module);
}
exports.setupContext = setupContext;
//# sourceMappingURL=repl.js.map

/***/ }),

/***/ 9148:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createResolverFunctions = void 0;
const path_1 = __nccwpck_require__(1017);
/**
 * @internal
 * In a factory because these are shared across both CompilerHost and LanguageService codepaths
 */
function createResolverFunctions(kwargs) {
    const { host, ts, config, cwd, getCanonicalFileName, projectLocalResolveHelper, options, extensions, } = kwargs;
    const moduleResolutionCache = ts.createModuleResolutionCache(cwd, getCanonicalFileName, config.options);
    const knownInternalFilenames = new Set();
    /** "Buckets" (module directories) whose contents should be marked "internal" */
    const internalBuckets = new Set();
    // Get bucket for a source filename.  Bucket is the containing `./node_modules/*/` directory
    // For '/project/node_modules/foo/node_modules/bar/lib/index.js' bucket is '/project/node_modules/foo/node_modules/bar/'
    // For '/project/node_modules/foo/node_modules/@scope/bar/lib/index.js' bucket is '/project/node_modules/foo/node_modules/@scope/bar/'
    const moduleBucketRe = /.*\/node_modules\/(?:@[^\/]+\/)?[^\/]+\//;
    function getModuleBucket(filename) {
        const find = moduleBucketRe.exec(filename);
        if (find)
            return find[0];
        return '';
    }
    // Mark that this file and all siblings in its bucket should be "internal"
    function markBucketOfFilenameInternal(filename) {
        internalBuckets.add(getModuleBucket(filename));
    }
    function isFileInInternalBucket(filename) {
        return internalBuckets.has(getModuleBucket(filename));
    }
    function isFileKnownToBeInternal(filename) {
        return knownInternalFilenames.has(filename);
    }
    /**
     * If we need to emit JS for a file, force TS to consider it non-external
     */
    const fixupResolvedModule = (resolvedModule) => {
        const { resolvedFileName } = resolvedModule;
        if (resolvedFileName === undefined)
            return;
        // [MUST_UPDATE_FOR_NEW_FILE_EXTENSIONS]
        // .ts,.mts,.cts is always switched to internal
        // .js is switched on-demand
        if (resolvedModule.isExternalLibraryImport &&
            ((resolvedFileName.endsWith('.ts') &&
                !resolvedFileName.endsWith('.d.ts')) ||
                (resolvedFileName.endsWith('.cts') &&
                    !resolvedFileName.endsWith('.d.cts')) ||
                (resolvedFileName.endsWith('.mts') &&
                    !resolvedFileName.endsWith('.d.mts')) ||
                isFileKnownToBeInternal(resolvedFileName) ||
                isFileInInternalBucket(resolvedFileName))) {
            resolvedModule.isExternalLibraryImport = false;
        }
        if (!resolvedModule.isExternalLibraryImport) {
            knownInternalFilenames.add(resolvedFileName);
        }
    };
    /*
     * NOTE:
     * Older ts versions do not pass `redirectedReference` nor `options`.
     * We must pass `redirectedReference` to newer ts versions, but cannot rely on `options`, hence the weird argument name
     */
    const resolveModuleNames = (moduleNames, containingFile, reusedNames, redirectedReference, optionsOnlyWithNewerTsVersions, containingSourceFile) => {
        return moduleNames.map((moduleName, i) => {
            var _a, _b;
            const mode = containingSourceFile
                ? (_b = (_a = ts).getModeForResolutionAtIndex) === null || _b === void 0 ? void 0 : _b.call(_a, containingSourceFile, i)
                : undefined;
            let { resolvedModule } = ts.resolveModuleName(moduleName, containingFile, config.options, host, moduleResolutionCache, redirectedReference, mode);
            if (!resolvedModule && options.experimentalTsImportSpecifiers) {
                const lastDotIndex = moduleName.lastIndexOf('.');
                const ext = lastDotIndex >= 0 ? moduleName.slice(lastDotIndex) : '';
                if (ext) {
                    const replacements = extensions.tsResolverEquivalents.get(ext);
                    for (const replacementExt of replacements !== null && replacements !== void 0 ? replacements : []) {
                        ({ resolvedModule } = ts.resolveModuleName(moduleName.slice(0, -ext.length) + replacementExt, containingFile, config.options, host, moduleResolutionCache, redirectedReference, mode));
                        if (resolvedModule)
                            break;
                    }
                }
            }
            if (resolvedModule) {
                fixupResolvedModule(resolvedModule);
            }
            return resolvedModule;
        });
    };
    // language service never calls this, but TS docs recommend that we implement it
    const getResolvedModuleWithFailedLookupLocationsFromCache = (moduleName, containingFile, resolutionMode) => {
        const ret = ts.resolveModuleNameFromCache(moduleName, containingFile, moduleResolutionCache, resolutionMode);
        if (ret && ret.resolvedModule) {
            fixupResolvedModule(ret.resolvedModule);
        }
        return ret;
    };
    const resolveTypeReferenceDirectives = (typeDirectiveNames, containingFile, redirectedReference, options, containingFileMode // new impliedNodeFormat is accepted by compilerHost
    ) => {
        // Note: seems to be called with empty typeDirectiveNames array for all files.
        // TODO consider using `ts.loadWithTypeDirectiveCache`
        return typeDirectiveNames.map((typeDirectiveName) => {
            // Copy-pasted from TS source:
            const nameIsString = typeof typeDirectiveName === 'string';
            const mode = nameIsString
                ? undefined
                : ts.getModeForFileReference(typeDirectiveName, containingFileMode);
            const strName = nameIsString
                ? typeDirectiveName
                : typeDirectiveName.fileName.toLowerCase();
            let { resolvedTypeReferenceDirective } = ts.resolveTypeReferenceDirective(strName, containingFile, config.options, host, redirectedReference, undefined, mode);
            if (typeDirectiveName === 'node' && !resolvedTypeReferenceDirective) {
                // Resolve @types/node relative to project first, then __dirname (copy logic from elsewhere / refactor into reusable function)
                let typesNodePackageJsonPath;
                try {
                    typesNodePackageJsonPath = projectLocalResolveHelper('@types/node/package.json', true);
                }
                catch { } // gracefully do nothing when @types/node is not installed for any reason
                if (typesNodePackageJsonPath) {
                    const typeRoots = [(0, path_1.resolve)(typesNodePackageJsonPath, '../..')];
                    ({ resolvedTypeReferenceDirective } =
                        ts.resolveTypeReferenceDirective(typeDirectiveName, containingFile, {
                            ...config.options,
                            typeRoots,
                        }, host, redirectedReference));
                }
            }
            if (resolvedTypeReferenceDirective) {
                fixupResolvedModule(resolvedTypeReferenceDirective);
            }
            return resolvedTypeReferenceDirective;
        });
    };
    return {
        resolveModuleNames,
        getResolvedModuleWithFailedLookupLocationsFromCache,
        resolveTypeReferenceDirectives,
        isFileKnownToBeInternal,
        markBucketOfFilenameInternal,
    };
}
exports.createResolverFunctions = createResolverFunctions;
//# sourceMappingURL=resolver-functions.js.map

/***/ }),

/***/ 4851:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getPatternFromSpec = exports.createTsInternals = void 0;
const path_1 = __nccwpck_require__(1017);
const util_1 = __nccwpck_require__(4745);
/** @internal */
exports.createTsInternals = (0, util_1.cachedLookup)(createTsInternalsUncached);
/**
 * Given a reference to the TS compiler, return some TS internal functions that we
 * could not or did not want to grab off the `ts` object.
 * These have been copy-pasted from TS's source and tweaked as necessary.
 *
 * NOTE: This factory returns *only* functions which need a reference to the TS
 * compiler.  Other functions do not need a reference to the TS compiler so are
 * exported directly from this file.
 */
function createTsInternalsUncached(_ts) {
    const ts = _ts;
    /**
     * Copied from:
     * https://github.com/microsoft/TypeScript/blob/v4.3.2/src/compiler/commandLineParser.ts#L2821-L2846
     */
    function getExtendsConfigPath(extendedConfig, host, basePath, errors, createDiagnostic) {
        extendedConfig = (0, util_1.normalizeSlashes)(extendedConfig);
        if (isRootedDiskPath(extendedConfig) ||
            startsWith(extendedConfig, './') ||
            startsWith(extendedConfig, '../')) {
            let extendedConfigPath = getNormalizedAbsolutePath(extendedConfig, basePath);
            if (!host.fileExists(extendedConfigPath) &&
                !endsWith(extendedConfigPath, ts.Extension.Json)) {
                extendedConfigPath = `${extendedConfigPath}.json`;
                if (!host.fileExists(extendedConfigPath)) {
                    errors.push(createDiagnostic(ts.Diagnostics.File_0_not_found, extendedConfig));
                    return undefined;
                }
            }
            return extendedConfigPath;
        }
        // If the path isn't a rooted or relative path, resolve like a module
        const resolved = ts.nodeModuleNameResolver(extendedConfig, combinePaths(basePath, 'tsconfig.json'), { moduleResolution: ts.ModuleResolutionKind.NodeJs }, host, 
        /*cache*/ undefined, 
        /*projectRefs*/ undefined, 
        /*lookupConfig*/ true);
        if (resolved.resolvedModule) {
            return resolved.resolvedModule.resolvedFileName;
        }
        errors.push(createDiagnostic(ts.Diagnostics.File_0_not_found, extendedConfig));
        return undefined;
    }
    return { getExtendsConfigPath };
}
// These functions have alternative implementation to avoid copying too much from TS
function isRootedDiskPath(path) {
    return (0, path_1.isAbsolute)(path);
}
function combinePaths(path, ...paths) {
    return (0, util_1.normalizeSlashes)((0, path_1.resolve)(path, ...paths.filter((path) => path)));
}
function getNormalizedAbsolutePath(fileName, currentDirectory) {
    return (0, util_1.normalizeSlashes)(currentDirectory != null
        ? (0, path_1.resolve)(currentDirectory, fileName)
        : (0, path_1.resolve)(fileName));
}
function startsWith(str, prefix) {
    return str.lastIndexOf(prefix, 0) === 0;
}
function endsWith(str, suffix) {
    const expectedPos = str.length - suffix.length;
    return expectedPos >= 0 && str.indexOf(suffix, expectedPos) === expectedPos;
}
// Reserved characters, forces escaping of any non-word (or digit), non-whitespace character.
// It may be inefficient (we could just match (/[-[\]{}()*+?.,\\^$|#\s]/g), but this is future
// proof.
const reservedCharacterPattern = /[^\w\s\/]/g;
/**
 * @internal
 * See also: getRegularExpressionForWildcard, which seems to do almost the same thing
 */
function getPatternFromSpec(spec, basePath) {
    const pattern = spec && getSubPatternFromSpec(spec, basePath, excludeMatcher);
    return pattern && `^(${pattern})${'($|/)'}`;
}
exports.getPatternFromSpec = getPatternFromSpec;
function getSubPatternFromSpec(spec, basePath, { singleAsteriskRegexFragment, doubleAsteriskRegexFragment, replaceWildcardCharacter, }) {
    let subpattern = '';
    let hasWrittenComponent = false;
    const components = getNormalizedPathComponents(spec, basePath);
    const lastComponent = last(components);
    // getNormalizedPathComponents includes the separator for the root component.
    // We need to remove to create our regex correctly.
    components[0] = removeTrailingDirectorySeparator(components[0]);
    if (isImplicitGlob(lastComponent)) {
        components.push('**', '*');
    }
    let optionalCount = 0;
    for (let component of components) {
        if (component === '**') {
            subpattern += doubleAsteriskRegexFragment;
        }
        else {
            if (hasWrittenComponent) {
                subpattern += directorySeparator;
            }
            subpattern += component.replace(reservedCharacterPattern, replaceWildcardCharacter);
        }
        hasWrittenComponent = true;
    }
    while (optionalCount > 0) {
        subpattern += ')?';
        optionalCount--;
    }
    return subpattern;
}
const directoriesMatcher = {
    singleAsteriskRegexFragment: '[^/]*',
    /**
     * Regex for the ** wildcard. Matches any num of subdirectories. When used for including
     * files or directories, does not match subdirectories that start with a . character
     */
    doubleAsteriskRegexFragment: `(/[^/.][^/]*)*?`,
    replaceWildcardCharacter: (match) => replaceWildcardCharacter(match, directoriesMatcher.singleAsteriskRegexFragment),
};
const excludeMatcher = {
    singleAsteriskRegexFragment: '[^/]*',
    doubleAsteriskRegexFragment: '(/.+?)?',
    replaceWildcardCharacter: (match) => replaceWildcardCharacter(match, excludeMatcher.singleAsteriskRegexFragment),
};
function getNormalizedPathComponents(path, currentDirectory) {
    return reducePathComponents(getPathComponents(path, currentDirectory));
}
function getPathComponents(path, currentDirectory = '') {
    path = combinePaths(currentDirectory, path);
    return pathComponents(path, getRootLength(path));
}
function reducePathComponents(components) {
    if (!some(components))
        return [];
    const reduced = [components[0]];
    for (let i = 1; i < components.length; i++) {
        const component = components[i];
        if (!component)
            continue;
        if (component === '.')
            continue;
        if (component === '..') {
            if (reduced.length > 1) {
                if (reduced[reduced.length - 1] !== '..') {
                    reduced.pop();
                    continue;
                }
            }
            else if (reduced[0])
                continue;
        }
        reduced.push(component);
    }
    return reduced;
}
function getRootLength(path) {
    const rootLength = getEncodedRootLength(path);
    return rootLength < 0 ? ~rootLength : rootLength;
}
function getEncodedRootLength(path) {
    if (!path)
        return 0;
    const ch0 = path.charCodeAt(0);
    // POSIX or UNC
    if (ch0 === 47 /* CharacterCodes.slash */ || ch0 === 92 /* CharacterCodes.backslash */) {
        if (path.charCodeAt(1) !== ch0)
            return 1; // POSIX: "/" (or non-normalized "\")
        const p1 = path.indexOf(ch0 === 47 /* CharacterCodes.slash */ ? directorySeparator : altDirectorySeparator, 2);
        if (p1 < 0)
            return path.length; // UNC: "//server" or "\\server"
        return p1 + 1; // UNC: "//server/" or "\\server\"
    }
    // DOS
    if (isVolumeCharacter(ch0) && path.charCodeAt(1) === 58 /* CharacterCodes.colon */) {
        const ch2 = path.charCodeAt(2);
        if (ch2 === 47 /* CharacterCodes.slash */ || ch2 === 92 /* CharacterCodes.backslash */)
            return 3; // DOS: "c:/" or "c:\"
        if (path.length === 2)
            return 2; // DOS: "c:" (but not "c:d")
    }
    // URL
    const schemeEnd = path.indexOf(urlSchemeSeparator);
    if (schemeEnd !== -1) {
        const authorityStart = schemeEnd + urlSchemeSeparator.length;
        const authorityEnd = path.indexOf(directorySeparator, authorityStart);
        if (authorityEnd !== -1) {
            // URL: "file:///", "file://server/", "file://server/path"
            // For local "file" URLs, include the leading DOS volume (if present).
            // Per https://www.ietf.org/rfc/rfc1738.txt, a host of "" or "localhost" is a
            // special case interpreted as "the machine from which the URL is being interpreted".
            const scheme = path.slice(0, schemeEnd);
            const authority = path.slice(authorityStart, authorityEnd);
            if (scheme === 'file' &&
                (authority === '' || authority === 'localhost') &&
                isVolumeCharacter(path.charCodeAt(authorityEnd + 1))) {
                const volumeSeparatorEnd = getFileUrlVolumeSeparatorEnd(path, authorityEnd + 2);
                if (volumeSeparatorEnd !== -1) {
                    if (path.charCodeAt(volumeSeparatorEnd) === 47 /* CharacterCodes.slash */) {
                        // URL: "file:///c:/", "file://localhost/c:/", "file:///c%3a/", "file://localhost/c%3a/"
                        return ~(volumeSeparatorEnd + 1);
                    }
                    if (volumeSeparatorEnd === path.length) {
                        // URL: "file:///c:", "file://localhost/c:", "file:///c$3a", "file://localhost/c%3a"
                        // but not "file:///c:d" or "file:///c%3ad"
                        return ~volumeSeparatorEnd;
                    }
                }
            }
            return ~(authorityEnd + 1); // URL: "file://server/", "http://server/"
        }
        return ~path.length; // URL: "file://server", "http://server"
    }
    // relative
    return 0;
}
function ensureTrailingDirectorySeparator(path) {
    if (!hasTrailingDirectorySeparator(path)) {
        return path + directorySeparator;
    }
    return path;
}
function hasTrailingDirectorySeparator(path) {
    return (path.length > 0 && isAnyDirectorySeparator(path.charCodeAt(path.length - 1)));
}
function isAnyDirectorySeparator(charCode) {
    return (charCode === 47 /* CharacterCodes.slash */ || charCode === 92 /* CharacterCodes.backslash */);
}
function removeTrailingDirectorySeparator(path) {
    if (hasTrailingDirectorySeparator(path)) {
        return path.substr(0, path.length - 1);
    }
    return path;
}
const directorySeparator = '/';
const altDirectorySeparator = '\\';
const urlSchemeSeparator = '://';
function isVolumeCharacter(charCode) {
    return ((charCode >= 97 /* CharacterCodes.a */ && charCode <= 122 /* CharacterCodes.z */) ||
        (charCode >= 65 /* CharacterCodes.A */ && charCode <= 90 /* CharacterCodes.Z */));
}
function getFileUrlVolumeSeparatorEnd(url, start) {
    const ch0 = url.charCodeAt(start);
    if (ch0 === 58 /* CharacterCodes.colon */)
        return start + 1;
    if (ch0 === 37 /* CharacterCodes.percent */ &&
        url.charCodeAt(start + 1) === 51 /* CharacterCodes._3 */) {
        const ch2 = url.charCodeAt(start + 2);
        if (ch2 === 97 /* CharacterCodes.a */ || ch2 === 65 /* CharacterCodes.A */)
            return start + 3;
    }
    return -1;
}
function some(array, predicate) {
    if (array) {
        if (predicate) {
            for (const v of array) {
                if (predicate(v)) {
                    return true;
                }
            }
        }
        else {
            return array.length > 0;
        }
    }
    return false;
}
function pathComponents(path, rootLength) {
    const root = path.substring(0, rootLength);
    const rest = path.substring(rootLength).split(directorySeparator);
    if (rest.length && !lastOrUndefined(rest))
        rest.pop();
    return [root, ...rest];
}
function lastOrUndefined(array) {
    return array.length === 0 ? undefined : array[array.length - 1];
}
function last(array) {
    // Debug.assert(array.length !== 0);
    return array[array.length - 1];
}
function replaceWildcardCharacter(match, singleAsteriskRegexFragment) {
    return match === '*'
        ? singleAsteriskRegexFragment
        : match === '?'
            ? '[^/]'
            : '\\' + match;
}
/**
 * An "includes" path "foo" is implicitly a glob "foo/** /*" (without the space) if its last component has no extension,
 * and does not contain any glob characters itself.
 */
function isImplicitGlob(lastPathComponent) {
    return !/[.*?]/.test(lastPathComponent);
}
//# sourceMappingURL=ts-internals.js.map

/***/ }),

/***/ 4444:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createTsTranspileModule = void 0;
/** @internal */
function createTsTranspileModule(ts, transpileOptions) {
    const { createProgram, createSourceFile, getDefaultCompilerOptions, getImpliedNodeFormatForFile, fixupCompilerOptions, transpileOptionValueCompilerOptions, getNewLineCharacter, fileExtensionIs, normalizePath, Debug, toPath, getSetExternalModuleIndicator, getEntries, addRange, hasProperty, getEmitScriptTarget, getDirectoryPath, } = ts;
    const compilerOptionsDiagnostics = [];
    const options = transpileOptions.compilerOptions
        ? fixupCompilerOptions(transpileOptions.compilerOptions, compilerOptionsDiagnostics)
        : {};
    // mix in default options
    const defaultOptions = getDefaultCompilerOptions();
    for (const key in defaultOptions) {
        if (hasProperty(defaultOptions, key) && options[key] === undefined) {
            options[key] = defaultOptions[key];
        }
    }
    for (const option of transpileOptionValueCompilerOptions) {
        options[option.name] = option.transpileOptionValue;
    }
    // transpileModule does not write anything to disk so there is no need to verify that there are no conflicts between input and output paths.
    options.suppressOutputPathCheck = true;
    // Filename can be non-ts file.
    options.allowNonTsExtensions = true;
    const newLine = getNewLineCharacter(options);
    // Create a compilerHost object to allow the compiler to read and write files
    const compilerHost = {
        getSourceFile: (fileName) => fileName === normalizePath(inputFileName) ? sourceFile : undefined,
        writeFile: (name, text) => {
            if (fileExtensionIs(name, '.map')) {
                Debug.assertEqual(sourceMapText, undefined, 'Unexpected multiple source map outputs, file:', name);
                sourceMapText = text;
            }
            else {
                Debug.assertEqual(outputText, undefined, 'Unexpected multiple outputs, file:', name);
                outputText = text;
            }
        },
        getDefaultLibFileName: () => 'lib.d.ts',
        useCaseSensitiveFileNames: () => true,
        getCanonicalFileName: (fileName) => fileName,
        getCurrentDirectory: () => '',
        getNewLine: () => newLine,
        fileExists: (fileName) => fileName === inputFileName || fileName === packageJsonFileName,
        readFile: (fileName) => fileName === packageJsonFileName ? `{"type": "${_packageJsonType}"}` : '',
        directoryExists: () => true,
        getDirectories: () => [],
    };
    let inputFileName;
    let packageJsonFileName;
    let _packageJsonType;
    let sourceFile;
    let outputText;
    let sourceMapText;
    return transpileModule;
    function transpileModule(input, transpileOptions2, packageJsonType = 'commonjs') {
        // if jsx is specified then treat file as .tsx
        inputFileName =
            transpileOptions2.fileName ||
                (transpileOptions.compilerOptions && transpileOptions.compilerOptions.jsx
                    ? 'module.tsx'
                    : 'module.ts');
        packageJsonFileName = getDirectoryPath(inputFileName) + '/package.json';
        _packageJsonType = packageJsonType;
        sourceFile = createSourceFile(inputFileName, input, {
            languageVersion: getEmitScriptTarget(options),
            impliedNodeFormat: getImpliedNodeFormatForFile(toPath(inputFileName, '', compilerHost.getCanonicalFileName), 
            /*cache*/ undefined, compilerHost, options),
            setExternalModuleIndicator: getSetExternalModuleIndicator(options),
        });
        if (transpileOptions2.moduleName) {
            sourceFile.moduleName = transpileOptions2.moduleName;
        }
        if (transpileOptions2.renamedDependencies) {
            sourceFile.renamedDependencies = new Map(getEntries(transpileOptions2.renamedDependencies));
        }
        // Output
        outputText = undefined;
        sourceMapText = undefined;
        const program = createProgram([inputFileName], options, compilerHost);
        const diagnostics = compilerOptionsDiagnostics.slice();
        if (transpileOptions.reportDiagnostics) {
            addRange(
            /*to*/ diagnostics, 
            /*from*/ program.getSyntacticDiagnostics(sourceFile));
            addRange(/*to*/ diagnostics, /*from*/ program.getOptionsDiagnostics());
        }
        // Emit
        program.emit(
        /*targetSourceFile*/ undefined, 
        /*writeFile*/ undefined, 
        /*cancellationToken*/ undefined, 
        /*emitOnlyDtsFiles*/ undefined, transpileOptions.transformers);
        if (outputText === undefined)
            return Debug.fail('Output generation failed');
        return { outputText, diagnostics, sourceMapText };
    }
}
exports.createTsTranspileModule = createTsTranspileModule;
//# sourceMappingURL=ts-transpile-module.js.map

/***/ }),

/***/ 1533:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getDefaultTsconfigJsonForNodeVersion = void 0;
const nodeMajor = parseInt(process.versions.node.split('.')[0], 10);
/**
 * return parsed JSON of the bundled @tsconfig/bases config appropriate for the
 * running version of nodejs
 * @internal
 */
function getDefaultTsconfigJsonForNodeVersion(ts) {
    const tsInternal = ts;
    if (nodeMajor >= 16) {
        const config = __nccwpck_require__(9777);
        if (configCompatible(config))
            return config;
    }
    if (nodeMajor >= 14) {
        const config = __nccwpck_require__(3754);
        if (configCompatible(config))
            return config;
    }
    if (nodeMajor >= 12) {
        const config = __nccwpck_require__(6049);
        if (configCompatible(config))
            return config;
    }
    return __nccwpck_require__(8250);
    // Verify that tsconfig target and lib options are compatible with TypeScript compiler
    function configCompatible(config) {
        return (typeof ts.ScriptTarget[config.compilerOptions.target.toUpperCase()] === 'number' &&
            tsInternal.libs &&
            config.compilerOptions.lib.every((lib) => tsInternal.libs.includes(lib)));
    }
}
exports.getDefaultTsconfigJsonForNodeVersion = getDefaultTsconfigJsonForNodeVersion;
//# sourceMappingURL=tsconfigs.js.map

/***/ }),

/***/ 4745:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.versionGteLt = exports.once = exports.getBasePathForProjectLocalDependencyResolution = exports.createProjectLocalResolveHelper = exports.attemptRequireWithV8CompileCache = exports.cachedLookup = exports.hasOwnProperty = exports.normalizeSlashes = exports.parse = exports.split = exports.assign = exports.yn = exports.createRequire = void 0;
const module_1 = __nccwpck_require__(8188);
const ynModule = __nccwpck_require__(9647);
const path_1 = __nccwpck_require__(1017);
/** @internal */
exports.createRequire = (_a = module_1.createRequire !== null && module_1.createRequire !== void 0 ? module_1.createRequire : module_1.createRequireFromPath) !== null && _a !== void 0 ? _a : __nccwpck_require__(5830);
/**
 * Wrapper around yn module that returns `undefined` instead of `null`.
 * This is implemented by yn v4, but we're staying on v3 to avoid v4's node 10 requirement.
 * @internal
 */
function yn(value) {
    var _a;
    return (_a = ynModule(value)) !== null && _a !== void 0 ? _a : undefined;
}
exports.yn = yn;
/**
 * Like `Object.assign`, but ignores `undefined` properties.
 *
 * @internal
 */
function assign(initialValue, ...sources) {
    for (const source of sources) {
        for (const key of Object.keys(source)) {
            const value = source[key];
            if (value !== undefined)
                initialValue[key] = value;
        }
    }
    return initialValue;
}
exports.assign = assign;
/**
 * Split a string array of values
 * and remove empty strings from the resulting array.
 * @internal
 */
function split(value) {
    return typeof value === 'string'
        ? value.split(/ *, */g).filter((v) => v !== '')
        : undefined;
}
exports.split = split;
/**
 * Parse a string as JSON.
 * @internal
 */
function parse(value) {
    return typeof value === 'string' ? JSON.parse(value) : undefined;
}
exports.parse = parse;
const directorySeparator = '/';
const backslashRegExp = /\\/g;
/**
 * Replace backslashes with forward slashes.
 * @internal
 */
function normalizeSlashes(value) {
    return value.replace(backslashRegExp, directorySeparator);
}
exports.normalizeSlashes = normalizeSlashes;
/**
 * Safe `hasOwnProperty`
 * @internal
 */
function hasOwnProperty(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
}
exports.hasOwnProperty = hasOwnProperty;
/**
 * Cached fs operation wrapper.
 */
function cachedLookup(fn) {
    const cache = new Map();
    return (arg) => {
        if (!cache.has(arg)) {
            const v = fn(arg);
            cache.set(arg, v);
            return v;
        }
        return cache.get(arg);
    };
}
exports.cachedLookup = cachedLookup;
/**
 * @internal
 * Require something with v8-compile-cache, which should make subsequent requires faster.
 * Do lots of error-handling so that, worst case, we require without the cache, and users are not blocked.
 */
function attemptRequireWithV8CompileCache(requireFn, specifier) {
    try {
        const v8CC = (__nccwpck_require__(416).install)();
        try {
            return requireFn(specifier);
        }
        finally {
            v8CC === null || v8CC === void 0 ? void 0 : v8CC.uninstall();
        }
    }
    catch (e) {
        return requireFn(specifier);
    }
}
exports.attemptRequireWithV8CompileCache = attemptRequireWithV8CompileCache;
/**
 * Helper to discover dependencies relative to a user's project, optionally
 * falling back to relative to ts-node.  This supports global installations of
 * ts-node, for example where someone does `#!/usr/bin/env -S ts-node --swc` and
 * we need to fallback to a global install of @swc/core
 * @internal
 */
function createProjectLocalResolveHelper(localDirectory) {
    return function projectLocalResolveHelper(specifier, fallbackToTsNodeRelative) {
        return require.resolve(specifier, {
            paths: fallbackToTsNodeRelative
                ? [localDirectory, __dirname]
                : [localDirectory],
        });
    };
}
exports.createProjectLocalResolveHelper = createProjectLocalResolveHelper;
/**
 * Used as a reminder of all the factors we must consider when finding project-local dependencies and when a config file
 * on disk may or may not exist.
 * @internal
 */
function getBasePathForProjectLocalDependencyResolution(configFilePath, projectSearchDirOption, projectOption, cwdOption) {
    var _a;
    if (configFilePath != null)
        return (0, path_1.dirname)(configFilePath);
    return (_a = projectSearchDirOption !== null && projectSearchDirOption !== void 0 ? projectSearchDirOption : projectOption) !== null && _a !== void 0 ? _a : cwdOption;
    // TODO technically breaks if projectOption is path to a file, not a directory,
    // and we attempt to resolve relative specifiers.  By the time we resolve relative specifiers,
    // should have configFilePath, so not reach this codepath.
}
exports.getBasePathForProjectLocalDependencyResolution = getBasePathForProjectLocalDependencyResolution;
/** @internal */
function once(fn) {
    let value;
    let ran = false;
    function onceFn(...args) {
        if (ran)
            return value;
        value = fn(...args);
        ran = true;
        return value;
    }
    return onceFn;
}
exports.once = once;
/** @internal */
function versionGteLt(version, gteRequirement, ltRequirement) {
    const [major, minor, patch, extra] = parse(version);
    const [gteMajor, gteMinor, gtePatch] = parse(gteRequirement);
    const isGte = major > gteMajor ||
        (major === gteMajor &&
            (minor > gteMinor || (minor === gteMinor && patch >= gtePatch)));
    let isLt = true;
    if (ltRequirement) {
        const [ltMajor, ltMinor, ltPatch] = parse(ltRequirement);
        isLt =
            major < ltMajor ||
                (major === ltMajor &&
                    (minor < ltMinor || (minor === ltMinor && patch < ltPatch)));
    }
    return isGte && isLt;
    function parse(requirement) {
        return requirement.split(/[\.-]/).map((s) => parseInt(s, 10));
    }
}
exports.versionGteLt = versionGteLt;
//# sourceMappingURL=util.js.map

/***/ }),

/***/ 4294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(4219);


/***/ }),

/***/ 4219:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



var net = __nccwpck_require__(1808);
var tls = __nccwpck_require__(4404);
var http = __nccwpck_require__(3685);
var https = __nccwpck_require__(5687);
var events = __nccwpck_require__(2361);
var assert = __nccwpck_require__(9491);
var util = __nccwpck_require__(3837);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 5840:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "v1", ({
  enumerable: true,
  get: function () {
    return _v.default;
  }
}));
Object.defineProperty(exports, "v3", ({
  enumerable: true,
  get: function () {
    return _v2.default;
  }
}));
Object.defineProperty(exports, "v4", ({
  enumerable: true,
  get: function () {
    return _v3.default;
  }
}));
Object.defineProperty(exports, "v5", ({
  enumerable: true,
  get: function () {
    return _v4.default;
  }
}));
Object.defineProperty(exports, "NIL", ({
  enumerable: true,
  get: function () {
    return _nil.default;
  }
}));
Object.defineProperty(exports, "version", ({
  enumerable: true,
  get: function () {
    return _version.default;
  }
}));
Object.defineProperty(exports, "validate", ({
  enumerable: true,
  get: function () {
    return _validate.default;
  }
}));
Object.defineProperty(exports, "stringify", ({
  enumerable: true,
  get: function () {
    return _stringify.default;
  }
}));
Object.defineProperty(exports, "parse", ({
  enumerable: true,
  get: function () {
    return _parse.default;
  }
}));

var _v = _interopRequireDefault(__nccwpck_require__(8628));

var _v2 = _interopRequireDefault(__nccwpck_require__(6409));

var _v3 = _interopRequireDefault(__nccwpck_require__(5122));

var _v4 = _interopRequireDefault(__nccwpck_require__(9120));

var _nil = _interopRequireDefault(__nccwpck_require__(5332));

var _version = _interopRequireDefault(__nccwpck_require__(1595));

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),

/***/ 4569:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function md5(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('md5').update(bytes).digest();
}

var _default = md5;
exports["default"] = _default;

/***/ }),

/***/ 5332:
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = '00000000-0000-0000-0000-000000000000';
exports["default"] = _default;

/***/ }),

/***/ 2746:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

var _default = parse;
exports["default"] = _default;

/***/ }),

/***/ 814:
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
exports["default"] = _default;

/***/ }),

/***/ 807:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = rng;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;

function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    _crypto.default.randomFillSync(rnds8Pool);

    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/***/ }),

/***/ 5274:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('sha1').update(bytes).digest();
}

var _default = sha1;
exports["default"] = _default;

/***/ }),

/***/ 8950:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

var _default = stringify;
exports["default"] = _default;

/***/ }),

/***/ 8628:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0, _stringify.default)(b);
}

var _default = v1;
exports["default"] = _default;

/***/ }),

/***/ 6409:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _md = _interopRequireDefault(__nccwpck_require__(4569));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v3 = (0, _v.default)('v3', 0x30, _md.default);
var _default = v3;
exports["default"] = _default;

/***/ }),

/***/ 5998:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = _default;
exports.URL = exports.DNS = void 0;

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
exports.DNS = DNS;
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
exports.URL = URL;

function _default(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0, _parse.default)(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0, _stringify.default)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

/***/ }),

/***/ 5122:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  options = options || {};

  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0, _stringify.default)(rnds);
}

var _default = v4;
exports["default"] = _default;

/***/ }),

/***/ 9120:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _sha = _interopRequireDefault(__nccwpck_require__(5274));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default = v5;
exports["default"] = _default;

/***/ }),

/***/ 6900:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _regex = _interopRequireDefault(__nccwpck_require__(814));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}

var _default = validate;
exports["default"] = _default;

/***/ }),

/***/ 1595:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function version(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

var _default = version;
exports["default"] = _default;

/***/ }),

/***/ 416:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const Module = __nccwpck_require__(8188);
const crypto = __nccwpck_require__(6113);
const fs = __nccwpck_require__(7147);
const path = __nccwpck_require__(1017);
const vm = __nccwpck_require__(6144);
const os = __nccwpck_require__(2037);

const hasOwnProperty = Object.prototype.hasOwnProperty;

//------------------------------------------------------------------------------
// FileSystemBlobStore
//------------------------------------------------------------------------------

class FileSystemBlobStore {
  constructor(directory, prefix) {
    const name = prefix ? slashEscape(prefix + '.') : '';
    this._blobFilename = path.join(directory, name + 'BLOB');
    this._mapFilename = path.join(directory, name + 'MAP');
    this._lockFilename = path.join(directory, name + 'LOCK');
    this._directory = directory;
    this._load();
  }

  has(key, invalidationKey) {
    if (hasOwnProperty.call(this._memoryBlobs, key)) {
      return this._invalidationKeys[key] === invalidationKey;
    } else if (hasOwnProperty.call(this._storedMap, key)) {
      return this._storedMap[key][0] === invalidationKey;
    }
    return false;
  }

  get(key, invalidationKey) {
    if (hasOwnProperty.call(this._memoryBlobs, key)) {
      if (this._invalidationKeys[key] === invalidationKey) {
        return this._memoryBlobs[key];
      }
    } else if (hasOwnProperty.call(this._storedMap, key)) {
      const mapping = this._storedMap[key];
      if (mapping[0] === invalidationKey) {
        return this._storedBlob.slice(mapping[1], mapping[2]);
      }
    }
  }

  set(key, invalidationKey, buffer) {
    this._invalidationKeys[key] = invalidationKey;
    this._memoryBlobs[key] = buffer;
    this._dirty = true;
  }

  delete(key) {
    if (hasOwnProperty.call(this._memoryBlobs, key)) {
      this._dirty = true;
      delete this._memoryBlobs[key];
    }
    if (hasOwnProperty.call(this._invalidationKeys, key)) {
      this._dirty = true;
      delete this._invalidationKeys[key];
    }
    if (hasOwnProperty.call(this._storedMap, key)) {
      this._dirty = true;
      delete this._storedMap[key];
    }
  }

  isDirty() {
    return this._dirty;
  }

  save() {
    const dump = this._getDump();
    const blobToStore = Buffer.concat(dump[0]);
    const mapToStore = JSON.stringify(dump[1]);

    try {
      mkdirpSync(this._directory);
      fs.writeFileSync(this._lockFilename, 'LOCK', {flag: 'wx'});
    } catch (error) {
      // Swallow the exception if we fail to acquire the lock.
      return false;
    }

    try {
      fs.writeFileSync(this._blobFilename, blobToStore);
      fs.writeFileSync(this._mapFilename, mapToStore);
    } finally {
      fs.unlinkSync(this._lockFilename);
    }

    return true;
  }

  _load() {
    try {
      this._storedBlob = fs.readFileSync(this._blobFilename);
      this._storedMap = JSON.parse(fs.readFileSync(this._mapFilename));
    } catch (e) {
      this._storedBlob = Buffer.alloc(0);
      this._storedMap = {};
    }
    this._dirty = false;
    this._memoryBlobs = {};
    this._invalidationKeys = {};
  }

  _getDump() {
    const buffers = [];
    const newMap = {};
    let offset = 0;

    function push(key, invalidationKey, buffer) {
      buffers.push(buffer);
      newMap[key] = [invalidationKey, offset, offset + buffer.length];
      offset += buffer.length;
    }

    for (const key of Object.keys(this._memoryBlobs)) {
      const buffer = this._memoryBlobs[key];
      const invalidationKey = this._invalidationKeys[key];
      push(key, invalidationKey, buffer);
    }

    for (const key of Object.keys(this._storedMap)) {
      if (hasOwnProperty.call(newMap, key)) continue;
      const mapping = this._storedMap[key];
      const buffer = this._storedBlob.slice(mapping[1], mapping[2]);
      push(key, mapping[0], buffer);
    }

    return [buffers, newMap];
  }
}

//------------------------------------------------------------------------------
// NativeCompileCache
//------------------------------------------------------------------------------

class NativeCompileCache {
  constructor() {
    this._cacheStore = null;
    this._previousModuleCompile = null;
  }

  setCacheStore(cacheStore) {
    this._cacheStore = cacheStore;
  }

  install() {
    const self = this;
    const hasRequireResolvePaths = typeof require.resolve.paths === 'function';
    this._previousModuleCompile = Module.prototype._compile;
    Module.prototype._compile = this._ownModuleCompile = _ownModuleCompile;
    self.enabled = true;
    function _ownModuleCompile(content, filename) {
      if(!self.enabled) return this._previousModuleCompile.apply(this, arguments);
      const mod = this;

      function require(id) {
        return mod.require(id);
      }

      // https://github.com/nodejs/node/blob/v10.15.3/lib/internal/modules/cjs/helpers.js#L28
      function resolve(request, options) {
        return Module._resolveFilename(request, mod, false, options);
      }
      require.resolve = resolve;

      // https://github.com/nodejs/node/blob/v10.15.3/lib/internal/modules/cjs/helpers.js#L37
      // resolve.resolve.paths was added in v8.9.0
      if (hasRequireResolvePaths) {
        resolve.paths = function paths(request) {
          return Module._resolveLookupPaths(request, mod, true);
        };
      }

      require.main = process.mainModule;

      // Enable support to add extra extension types
      require.extensions = Module._extensions;
      require.cache = Module._cache;

      const dirname = path.dirname(filename);

      const compiledWrapper = self._moduleCompile(filename, content);

      // We skip the debugger setup because by the time we run, node has already
      // done that itself.

      // `Buffer` is included for Electron.
      // See https://github.com/zertosh/v8-compile-cache/pull/10#issuecomment-518042543
      const args = [mod.exports, require, mod, filename, dirname, process, global, Buffer];
      return compiledWrapper.apply(mod.exports, args);
    }
  }

  uninstall() {
    this.enabled = false;
    // If something else has since been installed on top of us, we cannot overwrite it.
    if(Module.prototype._compile === this._ownModuleCompile) {
      Module.prototype._compile = this._previousModuleCompile;
    }
  }

  _moduleCompile(filename, content) {
    // https://github.com/nodejs/node/blob/v7.5.0/lib/module.js#L511

    // Remove shebang
    var contLen = content.length;
    if (contLen >= 2) {
      if (content.charCodeAt(0) === 35/*#*/ &&
          content.charCodeAt(1) === 33/*!*/) {
        if (contLen === 2) {
          // Exact match
          content = '';
        } else {
          // Find end of shebang line and slice it off
          var i = 2;
          for (; i < contLen; ++i) {
            var code = content.charCodeAt(i);
            if (code === 10/*\n*/ || code === 13/*\r*/) break;
          }
          if (i === contLen) {
            content = '';
          } else {
            // Note that this actually includes the newline character(s) in the
            // new output. This duplicates the behavior of the regular
            // expression that was previously used to replace the shebang line
            content = content.slice(i);
          }
        }
      }
    }

    // create wrapper function
    var wrapper = Module.wrap(content);

    var invalidationKey = crypto
      .createHash('sha1')
      .update(content, 'utf8')
      .digest('hex');

    var buffer = this._cacheStore.get(filename, invalidationKey);

    var script = new vm.Script(wrapper, {
      filename: filename,
      lineOffset: 0,
      displayErrors: true,
      cachedData: buffer,
      produceCachedData: true,
    });

    if (script.cachedDataProduced) {
      this._cacheStore.set(filename, invalidationKey, script.cachedData);
    } else if (script.cachedDataRejected) {
      this._cacheStore.delete(filename);
    }

    var compiledWrapper = script.runInThisContext({
      filename: filename,
      lineOffset: 0,
      columnOffset: 0,
      displayErrors: true,
    });

    return compiledWrapper;
  }
}

//------------------------------------------------------------------------------
// utilities
//
// https://github.com/substack/node-mkdirp/blob/f2003bb/index.js#L55-L98
// https://github.com/zertosh/slash-escape/blob/e7ebb99/slash-escape.js
//------------------------------------------------------------------------------

function mkdirpSync(p_) {
  _mkdirpSync(path.resolve(p_), 0o777);
}

function _mkdirpSync(p, mode) {
  try {
    fs.mkdirSync(p, mode);
  } catch (err0) {
    if (err0.code === 'ENOENT') {
      _mkdirpSync(path.dirname(p));
      _mkdirpSync(p);
    } else {
      try {
        const stat = fs.statSync(p);
        if (!stat.isDirectory()) { throw err0; }
      } catch (err1) {
        throw err0;
      }
    }
  }
}

function slashEscape(str) {
  const ESCAPE_LOOKUP = {
    '\\': 'zB',
    ':': 'zC',
    '/': 'zS',
    '\x00': 'z0',
    'z': 'zZ',
  };
  const ESCAPE_REGEX = /[\\:/\x00z]/g; // eslint-disable-line no-control-regex
  return str.replace(ESCAPE_REGEX, match => ESCAPE_LOOKUP[match]);
}

function supportsCachedData() {
  const script = new vm.Script('""', {produceCachedData: true});
  // chakracore, as of v1.7.1.0, returns `false`.
  return script.cachedDataProduced === true;
}

function getCacheDir() {
  const v8_compile_cache_cache_dir = process.env.V8_COMPILE_CACHE_CACHE_DIR;
  if (v8_compile_cache_cache_dir) {
    return v8_compile_cache_cache_dir;
  }

  // Avoid cache ownership issues on POSIX systems.
  const dirname = typeof process.getuid === 'function'
    ? 'v8-compile-cache-' + process.getuid()
    : 'v8-compile-cache';
  const version = typeof process.versions.v8 === 'string'
    ? process.versions.v8
    : typeof process.versions.chakracore === 'string'
      ? 'chakracore-' + process.versions.chakracore
      : 'node-' + process.version;
  const cacheDir = path.join(os.tmpdir(), dirname, version);
  return cacheDir;
}

function getMainName() {
  // `require.main.filename` is undefined or null when:
  //    * node -e 'require("v8-compile-cache")'
  //    * node -r 'v8-compile-cache'
  //    * Or, requiring from the REPL.
  const mainName = require.main && typeof require.main.filename === 'string'
    ? require.main.filename
    : process.cwd();
  return mainName;
}

function install(opts) {
  if (!process.env.DISABLE_V8_COMPILE_CACHE && supportsCachedData()) {
    if(typeof opts === 'undefined') opts = {}
    let cacheDir = opts.cacheDir
    if(typeof cacheDir === 'undefined') cacheDir = getCacheDir();
    let prefix = opts.prefix
    if(typeof prefix === 'undefined') prefix = getMainName();
    const blobStore = new FileSystemBlobStore(cacheDir, prefix);

    const nativeCompileCache = new NativeCompileCache();
    nativeCompileCache.setCacheStore(blobStore);
    nativeCompileCache.install();

    let uninstalled = false;
    const uninstall = () => {
      if(uninstalled) return;
      uninstalled = true;
      process.removeListener('exit', uninstall);
      if (blobStore.isDirty()) {
        blobStore.save();
      }
      nativeCompileCache.uninstall();
    }
    process.once('exit', uninstall);
    return {uninstall};
  }
}

//------------------------------------------------------------------------------
// main
//------------------------------------------------------------------------------

module.exports.install = install;

module.exports.__TEST__ = {
  FileSystemBlobStore,
  NativeCompileCache,
  mkdirpSync,
  slashEscape,
  supportsCachedData,
  getCacheDir,
  getMainName,
};


/***/ }),

/***/ 9647:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


const lenient = __nccwpck_require__(266);

const yn = (input, options) => {
	input = String(input).trim();

	options = Object.assign({
		lenient: false,
		default: null
	}, options);

	if (options.default !== null && typeof options.default !== 'boolean') {
		throw new TypeError(`Expected the \`default\` option to be of type \`boolean\`, got \`${typeof options.default}\``);
	}

	if (/^(?:y|yes|true|1)$/i.test(input)) {
		return true;
	}

	if (/^(?:n|no|false|0)$/i.test(input)) {
		return false;
	}

	if (options.lenient === true) {
		return lenient(input, options);
	}

	return options.default;
};

module.exports = yn;
// TODO: Remove this for the next major release
module.exports["default"] = yn;


/***/ }),

/***/ 266:
/***/ ((module) => {



const YES_MATCH_SCORE_THRESHOLD = 2;
const NO_MATCH_SCORE_THRESHOLD = 1.25;

const yMatch = new Map([
	[5, 0.25],
	[6, 0.25],
	[7, 0.25],
	['t', 0.75],
	['y', 1],
	['u', 0.75],
	['g', 0.25],
	['h', 0.25],
	['j', 0.25]
]);

const eMatch = new Map([
	[2, 0.25],
	[3, 0.25],
	[4, 0.25],
	['w', 0.75],
	['e', 1],
	['r', 0.75],
	['s', 0.25],
	['d', 0.25],
	['f', 0.25]
]);

const sMatch = new Map([
	['q', 0.25],
	['w', 0.25],
	['e', 0.25],
	['a', 0.75],
	['s', 1],
	['d', 0.75],
	['z', 0.25],
	['x', 0.25],
	['c', 0.25]
]);

const nMatch = new Map([
	['h', 0.25],
	['j', 0.25],
	['k', 0.25],
	['b', 0.75],
	['n', 1],
	['m', 0.75]
]);

const oMatch = new Map([
	[9, 0.25],
	[0, 0.25],
	['i', 0.75],
	['o', 1],
	['p', 0.75],
	['k', 0.25],
	['l', 0.25]
]);

function getYesMatchScore(value) {
	const [y, e, s] = value;
	let score = 0;

	if (yMatch.has(y)) {
		score += yMatch.get(y);
	}

	if (eMatch.has(e)) {
		score += eMatch.get(e);
	}

	if (sMatch.has(s)) {
		score += sMatch.get(s);
	}

	return score;
}

function getNoMatchScore(value) {
	const [n, o] = value;
	let score = 0;

	if (nMatch.has(n)) {
		score += nMatch.get(n);
	}

	if (oMatch.has(o)) {
		score += oMatch.get(o);
	}

	return score;
}

module.exports = (input, options) => {
	if (getYesMatchScore(input) >= YES_MATCH_SCORE_THRESHOLD) {
		return true;
	}

	if (getNoMatchScore(input) >= NO_MATCH_SCORE_THRESHOLD) {
		return false;
	}

	return options.default;
};


/***/ }),

/***/ 3833:
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = 3833;
module.exports = webpackEmptyContext;

/***/ }),

/***/ 9491:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("assert");

/***/ }),

/***/ 6206:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("console");

/***/ }),

/***/ 6113:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("crypto");

/***/ }),

/***/ 2361:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("events");

/***/ }),

/***/ 7147:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("fs");

/***/ }),

/***/ 3685:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("http");

/***/ }),

/***/ 5687:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("https");

/***/ }),

/***/ 8188:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("module");

/***/ }),

/***/ 1808:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("net");

/***/ }),

/***/ 2037:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("os");

/***/ }),

/***/ 1017:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("path");

/***/ }),

/***/ 8102:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("repl");

/***/ }),

/***/ 4404:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("tls");

/***/ }),

/***/ 7310:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("url");

/***/ }),

/***/ 3837:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("util");

/***/ }),

/***/ 6144:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("vm");

/***/ }),

/***/ 8250:
/***/ ((module) => {

module.exports = JSON.parse('{"$schema":"https://json.schemastore.org/tsconfig","display":"Node 10","compilerOptions":{"lib":["es2018"],"module":"commonjs","target":"es2018","strict":true,"esModuleInterop":true,"skipLibCheck":true,"forceConsistentCasingInFileNames":true,"moduleResolution":"node"}}');

/***/ }),

/***/ 6049:
/***/ ((module) => {

module.exports = JSON.parse('{"$schema":"https://json.schemastore.org/tsconfig","display":"Node 12","compilerOptions":{"lib":["es2019","es2020.promise","es2020.bigint","es2020.string"],"module":"commonjs","target":"es2019","strict":true,"esModuleInterop":true,"skipLibCheck":true,"forceConsistentCasingInFileNames":true,"moduleResolution":"node"}}');

/***/ }),

/***/ 3754:
/***/ ((module) => {

module.exports = JSON.parse('{"$schema":"https://json.schemastore.org/tsconfig","display":"Node 14","compilerOptions":{"lib":["es2020"],"module":"commonjs","target":"es2020","strict":true,"esModuleInterop":true,"skipLibCheck":true,"forceConsistentCasingInFileNames":true,"moduleResolution":"node"}}');

/***/ }),

/***/ 9777:
/***/ ((module) => {

module.exports = JSON.parse('{"$schema":"https://json.schemastore.org/tsconfig","display":"Node 16","compilerOptions":{"lib":["es2021"],"module":"Node16","target":"es2021","strict":true,"esModuleInterop":true,"skipLibCheck":true,"forceConsistentCasingInFileNames":true,"moduleResolution":"node"}}');

/***/ }),

/***/ 6686:
/***/ ((module) => {

module.exports = {"version":"10.9.1"};

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __nccwpck_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		id: moduleId,
/******/ 		loaded: false,
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	var threw = true;
/******/ 	try {
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 		threw = false;
/******/ 	} finally {
/******/ 		if(threw) delete __webpack_module_cache__[moduleId];
/******/ 	}
/******/ 
/******/ 	// Flag the module as loaded
/******/ 	module.loaded = true;
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/compat get default export */
/******/ (() => {
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__nccwpck_require__.n = (module) => {
/******/ 		var getter = module && module.__esModule ?
/******/ 			() => (module['default']) :
/******/ 			() => (module);
/******/ 		__nccwpck_require__.d(getter, { a: getter });
/******/ 		return getter;
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__nccwpck_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__nccwpck_require__.o(definition, key) && !__nccwpck_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__nccwpck_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/node module decorator */
/******/ (() => {
/******/ 	__nccwpck_require__.nmd = (module) => {
/******/ 		module.paths = [];
/******/ 		if (!module.children) module.children = [];
/******/ 		return module;
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/compat */
/******/ 
/******/ if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = new URL('.', import.meta.url).pathname.slice(import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0, -1) + "/";
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

// EXTERNAL MODULE: ./node_modules/@actions/core/lib/core.js
var core = __nccwpck_require__(2186);
var core_default = /*#__PURE__*/__nccwpck_require__.n(core);
// EXTERNAL MODULE: ./node_modules/ts-node/dist/index.js
var dist = __nccwpck_require__(2719);
;// CONCATENATED MODULE: external "fs/promises"
const promises_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("fs/promises");
// EXTERNAL MODULE: external "path"
var external_path_ = __nccwpck_require__(1017);
var external_path_default = /*#__PURE__*/__nccwpck_require__.n(external_path_);
// EXTERNAL MODULE: external "fs"
var external_fs_ = __nccwpck_require__(7147);
// EXTERNAL MODULE: external "module"
var external_module_ = __nccwpck_require__(8188);
var external_module_default = /*#__PURE__*/__nccwpck_require__.n(external_module_);
;// CONCATENATED MODULE: ./src/main/code.ts
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};





const createCompiler = (_rootFile) => (0,dist.create)({
    project: "./tsconfig.runtime.json",
    esm: true,
    compilerOptions: {
        // The way we interact with the file requires that it is built as
        // a NodeNext module. This can be changed as long as we can load and run
        // the file.
        module: "NodeNext",
        // To allow loading files without an extension.
        moduleResolution: "Bundler",
    },
});
const compileCode = (code, file, service) => {
    const logRawCode = process.env["LOG_RAW_CODE"];
    if (Boolean(logRawCode)) {
        console.log(code);
    }
    const compiledCode = service.compile(code, file);
    const logCode = process.env["LOG_CODE"];
    if (Boolean(logCode)) {
        console.log(compiledCode);
    }
    return compiledCode;
};
const makeCreateRequire = (service, fromFile) => {
    const fromDir = external_path_default().dirname(fromFile);
    const ourRequire = (file) => importModuleSync(__nccwpck_require__.ab + "action-plan/" + fromDir + '/' + file + '.ts', service, {});
    const nodeRequire = external_module_default().createRequire(external_path_default().resolve(fromFile));
    return (file) => {
        return external_path_default().isAbsolute(file) || file.startsWith(".")
            ? ourRequire(file)
            : nodeRequire(file);
    };
};
const makeModuleWrapperArgs = (file, require, context) => {
    const exports = {};
    const module = { exports };
    const wrapperArgs = Object.assign({ exports,
        require,
        module, __filename: file, __dirname: external_path_default().dirname(file) }, context);
    return wrapperArgs;
};
const importModule = (file, service, context) => __awaiter(void 0, void 0, void 0, function* () {
    const rawCode = yield (0,promises_namespaceObject.readFile)(file, { encoding: "utf8" });
    const code = yield compileCode(rawCode, file, service);
    const require = makeCreateRequire(service, file);
    const wrapperArgs = makeModuleWrapperArgs(file, require, context);
    yield callAsyncFunction(code, wrapperArgs);
    return wrapperArgs.module;
});
const importModuleSync = (file, service, context) => {
    const rawCode = (0,external_fs_.readFileSync)(file, { encoding: "utf8" });
    const code = compileCode(rawCode, file, service);
    const require = makeCreateRequire(service, file);
    const wrapperArgs = makeModuleWrapperArgs(file, require, context);
    callFunction(code, wrapperArgs);
    return wrapperArgs.module;
};
const AsyncFunction = Object.getPrototypeOf(() => __awaiter(void 0, void 0, void 0, function* () { return null; })).constructor;
function callAsyncFunction(source, args) {
    const fn = new AsyncFunction(...Object.keys(args), source);
    return fn(...Object.values(args));
}
const Function = Object.getPrototypeOf(() => null).constructor;
function callFunction(source, args) {
    const fn = new Function(...Object.keys(args), source);
    return fn(...Object.values(args));
}

;// CONCATENATED MODULE: ./src/main/runtime.ts
var runtime_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

const evalPlan = (params) => runtime_awaiter(void 0, void 0, void 0, function* () {
    const { planFile, plan } = params;
    const service = createCompiler(planFile);
    const { exports: moduleExports } = yield importModule(planFile, service, {});
    if (typeof moduleExports !== "object" || moduleExports == null) {
        throw new Error("Invalid default export, must be a map of plans");
    }
    const planFn = moduleExports[plan];
    if (planFn === undefined) {
        throw new Error(`Unable to find plan "${plan}"`);
    }
    if (typeof planFn !== "function") {
        throw new Error(`Found plan ${plan} but it is not a function (was ${typeof planFn})`);
    }
    return yield planFn();
});

;// CONCATENATED MODULE: external "child_process"
const external_child_process_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("child_process");
;// CONCATENATED MODULE: ./src/main/yarn.ts
var yarn_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


const ensurePackagesInstalled = () => yarn_awaiter(void 0, void 0, void 0, function* () {
    const shouldSkipInstall = yield nodeModulesExists();
    if (!shouldSkipInstall) {
        yield installPackages();
    }
});
const nodeModulesExists = () => yarn_awaiter(void 0, void 0, void 0, function* () {
    const stats = yield (0,promises_namespaceObject.stat)("node_modules");
    return stats.isDirectory() || stats.isSymbolicLink();
});
const installPackages = () => yarn_awaiter(void 0, void 0, void 0, function* () {
    return spawnSimple("yarn", ["install", "--immutable", "--immutable-cache"], {
        stdio: "inherit",
        windowsHide: true,
    });
});
const spawnSimple = (command, args, options) => new Promise((resolve, reject) => {
    const child = (0,external_child_process_namespaceObject.spawn)(command, args, options);
    child.on("error", reject);
    child.on("close", resolve);
});

;// CONCATENATED MODULE: ./src/main/index.ts
var main_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



const main = () => main_awaiter(void 0, void 0, void 0, function* () {
    yield ensurePackagesInstalled();
    const planFile = core_default().getInput("plan_file", {}) ||
        core_default().getInput("plan-file", { required: true });
    console.log(`Loading plan file ${planFile}`);
    const plan = core_default().getInput("plan", { required: true });
    const computedMatrix = yield evalPlan({ planFile, plan });
    core_default().setOutput("matrix", computedMatrix);
});
const handleError = (error) => {
    var _a;
    const info = ((_a = error.stack) === null || _a === void 0 ? void 0 : _a.toString()) || error.toString();
    const logErrors = process.env["LOG_ERRORS"];
    if (Boolean(logErrors)) {
        console.error(info);
    }
    core_default().setFailed(info);
};
process.on("unhandledRejection", handleError);
main().catch(handleError);

})();

