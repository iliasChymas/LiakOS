/// <reference path="./json-1.0.d.ts" />
/// <reference path="./gio-2.0.d.ts" />
/// <reference path="./gobject-2.0.d.ts" />
/// <reference path="./glib-2.0.d.ts" />
/// <reference path="./gmodule-2.0.d.ts" />

/**
 * Type Definitions for Gjs (https://gjs.guide/)
 *
 * These type definitions are automatically generated, do not edit them by hand.
 * If you found a bug fix it in `ts-for-gir` or create a bug report on https://github.com/gjsify/ts-for-gir
 *
 * The based EJS template file is used for the generated .d.ts file of each GIR module like Gtk-4.0, GObject-2.0, ...
 */

declare module 'gi://AstalGreet?version=0.1' {

// Module dependencies
import type Json from 'gi://Json?version=1.0';
import type Gio from 'gi://Gio?version=2.0';
import type GObject from 'gi://GObject?version=2.0';
import type GLib from 'gi://GLib?version=2.0';
import type GModule from 'gi://GModule?version=2.0';

export namespace AstalGreet {

    /**
     * AstalGreet-0.1
     */


    /**
     * An error that may occur during {@link AstalGreet.login}.
     * @gir-type Struct
     */
    class LoginError extends GLib.Error {
        static $gtype: GObject.GType<GLib.Error>;

        // Static fields
        /**
         * Authentication error. See {@link AstalGreet.ErrorType.AUTH_ERROR}.
         */
        static AUTH_ERROR: number;

        /**
         * General error. See {@link AstalGreet.ErrorType.ERROR}.
         */
        static ERROR: number;

        /**
         * Unexpected {@link AstalGreet.AuthMessage}.
         */
        static UNEXPECTED_AUTH: number;

        // Constructors
        constructor(options: { message: string; code: number });
    }


    /**
     * @gir-type Enum
     */
    export namespace ErrorType {
        export const $gtype: GObject.GType<ErrorType>;
    }

    /**
     * @gir-type Enum
     */
    enum ErrorType {
        /**
         * Indicates that authentication failed. This is not a fatal error, and is likely caused by incorrect credentials.
         */
        AUTH_ERROR = 0,
        /**
         * A general error. See the error description for more information.
         */
        ERROR = 1,
    }


    /**
     * @gir-type Enum
     */
    export namespace AuthMessageType {
        export const $gtype: GObject.GType<AuthMessageType>;
    }

    /**
     * @gir-type Enum
     */
    enum AuthMessageType {
        /**
         * Indicates that input from the user should be visible when they answer this question.
         */
        VISIBLE = 0,
        /**
         * Indicates that input from the user should be considered secret when they answer this question.
         */
        SECRET = 1,
        /**
         * Indicates that this message is informative, not a question.
         */
        INFO = 2,
        /**
         * Indicates that this message is an error, not a question.
         */
        ERROR = 3,
    }


    /**
     * @default 0
     */
    const MAJOR_VERSION: number;

    /**
     * @default 1
     */
    const MINOR_VERSION: number;

    /**
     * @default 0
     */
    const MICRO_VERSION: number;

    /**
     * @default 0.1.0
     */
    const VERSION: string;

    /**
     * Create a session, post the password, and start the session in one go.
     * @param username User to log in as
     * @param password Password of the user
     * @param cmd Command used to start the session
     */
    function login(username: string, password: string, cmd: string): globalThis.Promise<void>;
    /**
     * Create a session, post the password, and start the session in one go.
     * @param username User to log in as
     * @param password Password of the user
     * @param cmd Command used to start the session
     * @param _callback_ 
     */
    function login(username: string, password: string, cmd: string, _callback_: Gio.AsyncReadyCallback<string> | null): void;
    /**
     * Create a session, post the password, and start the session in one go.
     * @param username User to log in as
     * @param password Password of the user
     * @param cmd Command used to start the session
     * @param _callback_ 
     */
    function login(username: string, password: string, cmd: string, _callback_: Gio.AsyncReadyCallback<string> | null): globalThis.Promise<void> | void;

    /**
     * @param _res_ 
     * @throws GLib.Error
     */
    function login_finish(_res_: Gio.AsyncResult): void;

    /**
     * Same as {@link AstalGreet.login}, but allows setting additional environment variables in the form of `name=value` pairs.
     * @param username User to log in as
     * @param password Password of the user
     * @param cmd Command used to start the session
     * @param env Additional environment variables to set for the session
     */
    function login_with_env(username: string, password: string, cmd: string, env: string[]): globalThis.Promise<void>;
    /**
     * Same as {@link AstalGreet.login}, but allows setting additional environment variables in the form of `name=value` pairs.
     * @param username User to log in as
     * @param password Password of the user
     * @param cmd Command used to start the session
     * @param env Additional environment variables to set for the session
     * @param _callback_ 
     */
    function login_with_env(username: string, password: string, cmd: string, env: string[], _callback_: Gio.AsyncReadyCallback<string> | null): void;
    /**
     * Same as {@link AstalGreet.login}, but allows setting additional environment variables in the form of `name=value` pairs.
     * @param username User to log in as
     * @param password Password of the user
     * @param cmd Command used to start the session
     * @param env Additional environment variables to set for the session
     * @param _callback_ 
     */
    function login_with_env(username: string, password: string, cmd: string, env: string[], _callback_: Gio.AsyncReadyCallback<string> | null): globalThis.Promise<void> | void;

    /**
     * @param _res_ 
     * @throws GLib.Error
     */
    function login_with_env_finish(_res_: Gio.AsyncResult): void;

    namespace Greeter {
        // Signal signatures
        interface SignalSignatures extends GObject.Object.SignalSignatures {
            /**
             * Respond with {@link AstalGreet.Greeter.post_auth}. Emitted when input is required from the user. The response is not secret and can be 
             * visible.
             * @signal
             */
            "visible-request": (message: string) => void;
            /**
             * Respond with {@link AstalGreet.Greeter.post_auth}. Emitted when input is required from the user. The response is secret and should be 
             * invisible.
             * @signal
             */
            "secret-request": (message: string) => void;
            /**
             * Information that should be shown to the user.
             * @signal
             */
            "info-message": (message: string) => void;
            /**
             * Error message that should be shown to the user.
             * @signal
             */
            "error-message": (message: string) => void;
            /**
             * Emitted when the session is cancelled due to an error. The login can be restarted with {@link AstalGreet.Greeter.create_session}.
             * @signal
             */
            cancelled: (_error_: Error) => void;
            /**
             * Emitted on successful authentication to indicate that the session can be started using {@link AstalGreet.Greeter.start_session}.
             * @signal
             */
            authenticated: () => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends GObject.Object.ConstructorProps {}
    }

    /**
     * Object that allows login flows to be implemented using signals.
     * @gir-type Class
     */
    class Greeter extends GObject.Object {
        static $gtype: GObject.GType<Greeter>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: Greeter.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<Greeter.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        static ["new"](): Greeter;

        // Signals
        /** @signal */
        connect<K extends keyof Greeter.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Greeter.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof Greeter.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Greeter.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof Greeter.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<Greeter.SignalSignatures[K]>): void;

        // Methods
        /**
         * Create a session and start the authentication flow.
         * @param username 
         */
        create_session(username: string): void;

        /**
         * Respond to `AstalGreet.Greeter::visible_request` or `AstalGreet.Greeter::secret_request`.
         * @param response 
         */
        post_auth(response: string | null): void;

        /**
         * Start the session after `AstalGreet.Greeter::authenticated` is emitted. The greeter process must terminate after this method 
         * yields in order for the session to start.
         * @param cmd 
         * @param env 
         */
        start_session(cmd: string[], env: string[]): globalThis.Promise<void>;

        /**
         * Start the session after `AstalGreet.Greeter::authenticated` is emitted. The greeter process must terminate after this method 
         * yields in order for the session to start.
         * @param cmd 
         * @param env 
         * @param _callback_ 
         */
        start_session(cmd: string[], env: string[], _callback_: Gio.AsyncReadyCallback<this> | null): void;

        /**
         * Start the session after `AstalGreet.Greeter::authenticated` is emitted. The greeter process must terminate after this method 
         * yields in order for the session to start.
         * @param cmd 
         * @param env 
         * @param _callback_ 
         */
        start_session(cmd: string[], env: string[], _callback_?: Gio.AsyncReadyCallback<this> | null): globalThis.Promise<void> | void;

        /**
         * @param _res_ 
         */
        start_session_finish(_res_: Gio.AsyncResult): void;
    }


    namespace Request {
        // Signal signatures
        interface SignalSignatures extends GObject.Object.SignalSignatures {}

        // Constructor properties interface
        interface ConstructorProps extends GObject.Object.ConstructorProps {}
    }

    /**
     * Base Request type.
     * @gir-type Class
     */
    abstract class Request extends GObject.Object {
        static $gtype: GObject.GType<Request>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: Request.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<Request.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        // Signals
        /** @signal */
        connect<K extends keyof Request.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Request.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof Request.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Request.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof Request.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<Request.SignalSignatures[K]>): void;

        // Virtual methods
        /**
         * @virtual
         */
        vfunc_payload(): Json.Node;

        // Methods
        payload(): Json.Node;

        /**
         * Send this request to greetd.
         */
        send(): globalThis.Promise<Response>;

        /**
         * Send this request to greetd.
         * @param _callback_ 
         */
        send(_callback_: Gio.AsyncReadyCallback<this> | null): void;

        /**
         * Send this request to greetd.
         * @param _callback_ 
         */
        send(_callback_?: Gio.AsyncReadyCallback<this> | null): globalThis.Promise<Response> | void;

        /**
         * @param _res_ 
         * @throws GLib.Error
         */
        send_finish(_res_: Gio.AsyncResult): Response;
    }


    namespace CreateSession {
        // Signal signatures
        interface SignalSignatures extends Request.SignalSignatures {
            "notify::username": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends Request.ConstructorProps {
            username: string;
        }
    }

    /**
     * Creates a session and initiates a login attempt for the given user. The session is ready to be started if a success is returned.
     * @gir-type Class
     */
    class CreateSession extends Request {
        static $gtype: GObject.GType<CreateSession>;

        // Properties
        get username(): string;
        set username(val: string);

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: CreateSession.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<CreateSession.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        static ["new"](username: string): CreateSession;

        // Signals
        /** @signal */
        connect<K extends keyof CreateSession.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, CreateSession.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof CreateSession.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, CreateSession.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof CreateSession.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<CreateSession.SignalSignatures[K]>): void;

        // Methods
        get_username(): string;

        /**
         * @param value 
         */
        set_username(value: string): void;
    }


    namespace PostAuthMessage {
        // Signal signatures
        interface SignalSignatures extends Request.SignalSignatures {
            "notify::response": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends Request.ConstructorProps {
            response: string | null;
        }
    }

    /**
     * Responds to an authentication message. If the message is informational (info or error), then this message does not need a response. 
     * The session is ready to be started if a success is returned.
     * @gir-type Class
     */
    class PostAuthMessage extends Request {
        static $gtype: GObject.GType<PostAuthMessage>;

        // Properties
        get response(): string | null;
        set response(val: string | null);

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: PostAuthMessage.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<PostAuthMessage.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        static ["new"](response: string | null): PostAuthMessage;

        // Signals
        /** @signal */
        connect<K extends keyof PostAuthMessage.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, PostAuthMessage.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof PostAuthMessage.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, PostAuthMessage.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof PostAuthMessage.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<PostAuthMessage.SignalSignatures[K]>): void;

        // Methods
        get_response(): string | null;

        /**
         * @param value 
         */
        set_response(value: string | null): void;
    }


    namespace StartSession {
        // Signal signatures
        interface SignalSignatures extends Request.SignalSignatures {
            "notify::cmd": (pspec: GObject.ParamSpec) => void;
            "notify::env": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends Request.ConstructorProps {
            cmd: string[];
            env: string[];
        }
    }

    /**
     * Requests that the session be started using the provided command line, adding the supplied environment to the environment created by PAM. The 
     * session will start after the greeter process terminates.
     * @gir-type Class
     */
    class StartSession extends Request {
        static $gtype: GObject.GType<StartSession>;

        // Properties
        get cmd(): string[];
        set cmd(val: string[]);

        get env(): string[];
        set env(val: string[]);

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: StartSession.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<StartSession.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        static ["new"](cmd: string[], env: string[]): StartSession;

        // Signals
        /** @signal */
        connect<K extends keyof StartSession.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, StartSession.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof StartSession.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, StartSession.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof StartSession.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<StartSession.SignalSignatures[K]>): void;

        // Methods
        get_cmd(): string[];

        /**
         * @param value 
         */
        set_cmd(value: string[]): void;

        get_env(): string[];

        /**
         * @param value 
         */
        set_env(value: string[]): void;
    }


    namespace CancelSession {
        // Signal signatures
        interface SignalSignatures extends Request.SignalSignatures {}

        // Constructor properties interface
        interface ConstructorProps extends Request.ConstructorProps {}
    }

    /**
     * Cancels the session that is currently under configuration.
     * @gir-type Class
     */
    class CancelSession extends Request {
        static $gtype: GObject.GType<CancelSession>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: CancelSession.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<CancelSession.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        static ["new"](): CancelSession;

        // Signals
        /** @signal */
        connect<K extends keyof CancelSession.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, CancelSession.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof CancelSession.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, CancelSession.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof CancelSession.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<CancelSession.SignalSignatures[K]>): void;
    }


    namespace Response {
        // Signal signatures
        interface SignalSignatures extends GObject.Object.SignalSignatures {}

        // Constructor properties interface
        interface ConstructorProps extends GObject.Object.ConstructorProps {}
    }

    /**
     * Base Response type.
     * @gir-type Class
     */
    abstract class Response extends GObject.Object {
        static $gtype: GObject.GType<Response>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: Response.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<Response.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        // Signals
        /** @signal */
        connect<K extends keyof Response.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Response.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof Response.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Response.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof Response.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<Response.SignalSignatures[K]>): void;
    }


    namespace Success {
        // Signal signatures
        interface SignalSignatures extends Response.SignalSignatures {}

        // Constructor properties interface
        interface ConstructorProps extends Response.ConstructorProps {}
    }

    /**
     * Indicates that the request succeeded.
     * @gir-type Class
     */
    class Success extends Response {
        static $gtype: GObject.GType<Success>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: Success.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<Success.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        // Signals
        /** @signal */
        connect<K extends keyof Success.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Success.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof Success.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Success.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof Success.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<Success.SignalSignatures[K]>): void;
    }


    namespace Error {
        // Signal signatures
        interface SignalSignatures extends Response.SignalSignatures {
            "notify::error-type": (pspec: GObject.ParamSpec) => void;
            "notify::description": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends Response.ConstructorProps {
            error_type: ErrorType;
            errorType: ErrorType;
            description: string;
        }
    }

    /**
     * Indicates that the request failed.
     * @gir-type Class
     */
    class Error extends Response {
        static $gtype: GObject.GType<Error>;

        // Properties
        get error_type(): ErrorType;
        set error_type(val: ErrorType);

        get errorType(): ErrorType;
        set errorType(val: ErrorType);

        get description(): string;
        set description(val: string);

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: Error.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<Error.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        // Signals
        /** @signal */
        connect<K extends keyof Error.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Error.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof Error.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Error.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof Error.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<Error.SignalSignatures[K]>): void;

        // Methods
        get_error_type(): ErrorType;

        get_description(): string;
    }


    namespace AuthMessage {
        // Signal signatures
        interface SignalSignatures extends Response.SignalSignatures {
            "notify::message-type": (pspec: GObject.ParamSpec) => void;
            "notify::message": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends Response.ConstructorProps {
            message_type: AuthMessageType;
            messageType: AuthMessageType;
            message: string;
        }
    }

    /**
     * Indicates that the request returned an authentication message.
     * @gir-type Class
     */
    class AuthMessage extends Response {
        static $gtype: GObject.GType<AuthMessage>;

        // Properties
        get message_type(): AuthMessageType;
        set message_type(val: AuthMessageType);

        get messageType(): AuthMessageType;
        set messageType(val: AuthMessageType);

        get message(): string;
        set message(val: string);

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: AuthMessage.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<AuthMessage.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        // Signals
        /** @signal */
        connect<K extends keyof AuthMessage.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, AuthMessage.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof AuthMessage.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, AuthMessage.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof AuthMessage.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<AuthMessage.SignalSignatures[K]>): void;

        // Methods
        get_message_type(): AuthMessageType;

        get_message(): string;
    }


    /**
     * @gir-type Alias
     */
    type GreeterClass = typeof Greeter;

    /**
     * @gir-type Struct
     */
    abstract class GreeterPrivate {
        static $gtype: GObject.GType<GreeterPrivate>;
    }


    /**
     * @gir-type Alias
     */
    type RequestClass = typeof Request;

    /**
     * @gir-type Struct
     */
    abstract class RequestPrivate {
        static $gtype: GObject.GType<RequestPrivate>;
    }


    /**
     * @gir-type Alias
     */
    type CreateSessionClass = typeof CreateSession;

    /**
     * @gir-type Struct
     */
    abstract class CreateSessionPrivate {
        static $gtype: GObject.GType<CreateSessionPrivate>;
    }


    /**
     * @gir-type Alias
     */
    type PostAuthMessageClass = typeof PostAuthMessage;

    /**
     * @gir-type Struct
     */
    abstract class PostAuthMessagePrivate {
        static $gtype: GObject.GType<PostAuthMessagePrivate>;
    }


    /**
     * @gir-type Alias
     */
    type StartSessionClass = typeof StartSession;

    /**
     * @gir-type Struct
     */
    abstract class StartSessionPrivate {
        static $gtype: GObject.GType<StartSessionPrivate>;
    }


    /**
     * @gir-type Alias
     */
    type CancelSessionClass = typeof CancelSession;

    /**
     * @gir-type Struct
     */
    abstract class CancelSessionPrivate {
        static $gtype: GObject.GType<CancelSessionPrivate>;
    }


    /**
     * @gir-type Alias
     */
    type ResponseClass = typeof Response;

    /**
     * @gir-type Struct
     */
    abstract class ResponsePrivate {
        static $gtype: GObject.GType<ResponsePrivate>;
    }


    /**
     * @gir-type Alias
     */
    type SuccessClass = typeof Success;

    /**
     * @gir-type Struct
     */
    abstract class SuccessPrivate {
        static $gtype: GObject.GType<SuccessPrivate>;
    }


    /**
     * @gir-type Alias
     */
    type ErrorClass = typeof Error;

    /**
     * @gir-type Struct
     */
    abstract class ErrorPrivate {
        static $gtype: GObject.GType<ErrorPrivate>;
    }


    /**
     * @gir-type Alias
     */
    type AuthMessageClass = typeof AuthMessage;

    /**
     * @gir-type Struct
     */
    abstract class AuthMessagePrivate {
        static $gtype: GObject.GType<AuthMessagePrivate>;
    }


    /**
     * Name of the imported GIR library
     * `see` https://gitlab.gnome.org/GNOME/gjs/-/blob/master/gi/ns.cpp#L188
     */
    const __name__: string;

    /**
     * Version of the imported GIR library
     * `see` https://gitlab.gnome.org/GNOME/gjs/-/blob/master/gi/ns.cpp#L189
     */
    const __version__: string;
}

export default AstalGreet;

}

declare module 'gi://AstalGreet' {
    import AstalGreet01 from 'gi://AstalGreet?version=0.1';
    export default AstalGreet01;
}
// END
