/// <reference path="./astalwl-0.1.d.ts" />
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

declare module 'gi://AstalIdleNotify?version=0.1' {

// Module dependencies
import type AstalWl from 'gi://AstalWl?version=0.1';
import type Gio from 'gi://Gio?version=2.0';
import type GObject from 'gi://GObject?version=2.0';
import type GLib from 'gi://GLib?version=2.0';
import type GModule from 'gi://GModule?version=2.0';

export namespace AstalIdleNotify {

    /**
     * AstalIdleNotify-0.1
     */


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

    function is_supported(): boolean;

    function get_default(): Notifier;

    namespace Notifier {
        // Signal signatures
        interface SignalSignatures extends GObject.Object.SignalSignatures {}

        // Constructor properties interface
        interface ConstructorProps extends GObject.Object.ConstructorProps {}
    }

    /**
     * Implements the ext-idle-notifier-v1 interface. Which allows creating getting notified about the idle state of the system.
     * @gir-type Class
     */
    class Notifier extends GObject.Object {
        static $gtype: GObject.GType<Notifier>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: Notifier.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<Notifier.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        static ["new"](): Notifier;

        // Signals
        /** @signal */
        connect<K extends keyof Notifier.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Notifier.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof Notifier.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Notifier.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof Notifier.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<Notifier.SignalSignatures[K]>): void;

        // Static methods
        /**
         * Gets the default singleton Notifier instance
         */
        static get_default(): Notifier;

        // Methods
        /**
         * Creates a notification object with the given timeout for a given seat. It will notify when the seat is inactive for at least the provided 
         * timeout.
         * @param timeout 
         * @param seat 
         */
        get_idle_notification_for_seat(timeout: number, seat: AstalWl.Seat): Notification;

        /**
         * Creates a notification object with the given timeout for the first available seat. It will notify when the seat is inactive for at least the 
         * provided timeout.
         * @param timeout 
         */
        get_idle_notification(timeout: number): Notification;

        /**
         * Creates a notification object with the given output for a given seat. It will notify when the input is inactive for at least the provided 
         * timeout. Because this track the user input, it will ignore registered idle inhibitors.
         * @param timeout 
         * @param seat 
         */
        get_input_idle_notification_for_seat(timeout: number, seat: AstalWl.Seat): Notification;

        /**
         * Creates a notification object with the given output for the first available seat. It will notify when the input is inactive for at least the 
         * provided timeout. Because this track the user input, it will ignore registered idle inhibitors.
         * @param timeout 
         */
        get_input_idle_notification(timeout: number): Notification;
    }


    namespace Notification {
        // Signal signatures
        interface SignalSignatures extends GObject.Object.SignalSignatures {
            /**
             * Emitted when the seat has been inactive for at least the duration of the timout of this Notification
             * @signal
             */
            idled: () => void;
            /**
             * Emitted when the seat stops being inactive
             * @signal
             */
            resumed: () => void;
            "notify::idle": (pspec: GObject.ParamSpec) => void;
            "notify::timeout": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends GObject.Object.ConstructorProps {
            idle: boolean;
            timeout: number;
        }
    }

    /**
     * @gir-type Class
     */
    class Notification extends GObject.Object {
        static $gtype: GObject.GType<Notification>;

        // Properties
        /**
         * Whether or not the system has been idle for at least the amount given by the timeout.
         */
        get idle(): boolean;
        set idle(val: boolean);

        /**
         * the timeout this notification has been constructed with.
         * @construct-only
         */
        get timeout(): number;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: Notification.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<Notification.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        // Signals
        /** @signal */
        connect<K extends keyof Notification.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Notification.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof Notification.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Notification.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof Notification.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<Notification.SignalSignatures[K]>): void;

        // Methods
        get_idle(): boolean;

        get_timeout(): number;
    }


    /**
     * @gir-type Alias
     */
    type NotifierClass = typeof Notifier;

    /**
     * @gir-type Struct
     */
    abstract class NotifierPrivate {
        static $gtype: GObject.GType<NotifierPrivate>;
    }


    /**
     * @gir-type Alias
     */
    type NotificationClass = typeof Notification;

    /**
     * @gir-type Struct
     */
    abstract class NotificationPrivate {
        static $gtype: GObject.GType<NotificationPrivate>;
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

export default AstalIdleNotify;

}

declare module 'gi://AstalIdleNotify' {
    import AstalIdleNotify01 from 'gi://AstalIdleNotify?version=0.1';
    export default AstalIdleNotify01;
}
// END
