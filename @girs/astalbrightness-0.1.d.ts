/// <reference path="./glib-2.0.d.ts" />
/// <reference path="./gio-2.0.d.ts" />
/// <reference path="./gobject-2.0.d.ts" />
/// <reference path="./gmodule-2.0.d.ts" />

/**
 * Type Definitions for Gjs (https://gjs.guide/)
 *
 * These type definitions are automatically generated, do not edit them by hand.
 * If you found a bug fix it in `ts-for-gir` or create a bug report on https://github.com/gjsify/ts-for-gir
 *
 * The based EJS template file is used for the generated .d.ts file of each GIR module like Gtk-4.0, GObject-2.0, ...
 */

declare module 'gi://AstalBrightness?version=0.1' {

// Module dependencies
import type GLib from 'gi://GLib?version=2.0';
import type Gio from 'gi://Gio?version=2.0';
import type GObject from 'gi://GObject?version=2.0';
import type GModule from 'gi://GModule?version=2.0';

export namespace AstalBrightness {

    /**
     * AstalBrightness-0.1
     */


    /**
     * @gir-type Enum
     */
    export namespace Subsystem {
        export const $gtype: GObject.GType<Subsystem>;
    }

    /**
     * @gir-type Enum
     */
    enum Subsystem {
        LEDS = 0,
        BACKLIGHT = 1,
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
     * Get the singleton Brightness instance.
     */
    function get_default(): Brightness;

    namespace Brightness {
        // Signal signatures
        interface SignalSignatures extends GObject.Object.SignalSignatures {
            /**
             * Emitted when any device in {@link AstalBrightness.Brightness.backlights} or {@link AstalBrightness.Brightness.leds} changes.
             * @signal
             */
            "brightness-changed": (device: Device) => void;
            "notify::screen": (pspec: GObject.ParamSpec) => void;
            "notify::keyboard": (pspec: GObject.ParamSpec) => void;
            "notify::backlights": (pspec: GObject.ParamSpec) => void;
            "notify::leds": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends GObject.Object.ConstructorProps {
            screen: Device;
            keyboard: Device;
            backlights: DeviceList;
            leds: DeviceList;
        }
    }

    /**
     * Manager object that exposes collections of `LEDS` and `BACKLIGHT` devices. It also exposes proxy objects for the screen and keyboard devices 
     * guessed to be the main devices.
     * @gir-type Class
     */
    class Brightness extends GObject.Object {
        static $gtype: GObject.GType<Brightness>;

        // Properties
        /**
         * A proxy `BACKLIGHT` device object for the device that is guessed as the "main" screen.
         * @read-only
         */
        get screen(): Device;

        /**
         * A proxy `LEDS` device object for the device that is guessed as the "main" keyboard.
         * @read-only
         */
        get keyboard(): Device;

        /**
         * Collection of `BACKLIGHT` devices.
         * @read-only
         */
        get backlights(): DeviceList;

        /**
         * Collection of `LEDS` devices.
         * @read-only
         */
        get leds(): DeviceList;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: Brightness.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<Brightness.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        // Signals
        /** @signal */
        connect<K extends keyof Brightness.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Brightness.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof Brightness.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Brightness.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof Brightness.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<Brightness.SignalSignatures[K]>): void;

        // Static methods
        /**
         * Get the singleton Brightness instance.
         */
        static get_default(): Brightness;

        // Methods
        get_screen(): Device;

        get_keyboard(): Device;

        get_backlights(): DeviceList;

        get_leds(): DeviceList;
    }


    namespace DeviceList {
        // Signal signatures
        interface SignalSignatures extends GObject.Object.SignalSignatures, Gio.ListModel.SignalSignatures {
            /**
             * Emitted when a new sysfs device appears in the subsystem this collection is for.
             * @signal
             */
            "device-appeared": (device: Device) => void;
            /**
             * Emitted when a sysfs device disappears in the subsystem this collection is for.
             * @signal
             */
            "device-removed": (device: Device) => void;
            "notify::subsystem": (pspec: GObject.ParamSpec) => void;
            "notify::devices": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps<A extends GObject.Object = GObject.Object> extends GObject.Object.ConstructorProps, Gio.ListModel.ConstructorProps {
            subsystem: Subsystem;
            devices: Device[];
        }
    }

    /**
     * A collection of devices of the same {@link AstalBrightness.Subsystem}.
     * @gir-type Class
     */
    class DeviceList<A extends GObject.Object = GObject.Object> extends GObject.Object implements Gio.ListModel<A> {
        static $gtype: GObject.GType<DeviceList>;

        // Properties
        /**
         * @construct-only
         */
        get subsystem(): Subsystem;

        /**
         * Get the full list of devices.
         * @read-only
         */
        get devices(): Device[];

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: DeviceList.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<DeviceList.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        // Signals
        /** @signal */
        connect<K extends keyof DeviceList.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, DeviceList.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof DeviceList.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, DeviceList.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof DeviceList.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<DeviceList.SignalSignatures[K]>): void;

        // Methods
        /**
         * @param name 
         */
        get_device(name: string): Device | null;

        get_subsystem(): Subsystem;

        get_devices(): Device[];

        /**
         * Gets the type of the items in `list`.
         * 
         * All items returned from `g_list_model_get_item()` are of the type
         * returned by this function, or a subtype, or if the type is an
         * interface, they are an implementation of that interface.
         * 
         * The item type of a {@link Gio.ListModel} can not change during the life of the
         * model.
         * @returns the {@link GObject.GType} of the items contained in `list`.
         * @since 2.44
         */
        get_item_type(): GObject.GType;

        /**
         * Gets the number of items in `list`.
         * 
         * Depending on the model implementation, calling this function may be
         * less efficient than iterating the list with increasing values for
         * `position` until `g_list_model_get_item()` returns `null`.
         * @returns the number of items in `list`.
         * @since 2.44
         */
        get_n_items(): number;

        /**
         * Get the item at `position`.
         * 
         * If `position` is greater than the number of items in `list`, `null` is
         * returned.
         * 
         * `null` is never returned for an index that is smaller than the length
         * of the list.
         * 
         * This function is meant to be used by language bindings in place
         * of `g_list_model_get_item()`.
         * 
         * See also: `g_list_model_get_n_items()`
         * @param position the position of the item to fetch
         * @returns the object at `position`.
         * @since 2.44
         */
        get_item(position: number): A | null;

        /**
         * Emits the {@link Gio.ListModel.SignalSignatures.items_changed | Gio.ListModel::items-changed} signal on `list`.
         * 
         * This function should only be called by classes implementing
         * {@link Gio.ListModel}. It has to be called after the internal representation
         * of `list` has been updated, because handlers connected to this signal
         * might query the new state of the list.
         * 
         * Implementations must only make changes to the model (as visible to
         * its consumer) in places that will not cause problems for that
         * consumer.  For models that are driven directly by a write API (such
         * as {@link Gio.ListStore}), changes can be reported in response to uses of that
         * API.  For models that represent remote data, changes should only be
         * made from a fresh mainloop dispatch.  It is particularly not
         * permitted to make changes in response to a call to the {@link Gio.ListModel}
         * consumer API.
         * 
         * Stated another way: in general, it is assumed that code making a
         * series of accesses to the model via the API, without returning to the
         * mainloop, and without calling other code, will continue to view the
         * same contents of the model.
         * @param position the position at which `list` changed
         * @param removed the number of items removed
         * @param added the number of items added
         * @since 2.44
         */
        items_changed(position: number, removed: number, added: number): void;

        /**
         * Get the item at `position`. If `position` is greater than the number of
         * items in `list`, `null` is returned.
         * 
         * `null` is never returned for an index that is smaller than the length
         * of the list.  See `g_list_model_get_n_items()`.
         * 
         * The same {@link GObject.Object} instance may not appear more than once in a {@link Gio.ListModel}.
         * @param position the position of the item to fetch
         * @since 2.44
         * @virtual
         */
        vfunc_get_item(position: number): A | null;

        /**
         * Gets the type of the items in `list`.
         * 
         * All items returned from `g_list_model_get_item()` are of the type
         * returned by this function, or a subtype, or if the type is an
         * interface, they are an implementation of that interface.
         * 
         * The item type of a {@link Gio.ListModel} can not change during the life of the
         * model.
         * @since 2.44
         * @virtual
         */
        vfunc_get_item_type(): GObject.GType;

        /**
         * Gets the number of items in `list`.
         * 
         * Depending on the model implementation, calling this function may be
         * less efficient than iterating the list with increasing values for
         * `position` until `g_list_model_get_item()` returns `null`.
         * @since 2.44
         * @virtual
         */
        vfunc_get_n_items(): number;
    }


    /**
     * @gir-type Alias
     */
    type BrightnessClass = typeof Brightness;

    /**
     * @gir-type Struct
     */
    abstract class BrightnessPrivate {
        static $gtype: GObject.GType<BrightnessPrivate>;
    }


    /**
     * @gir-type Alias
     */
    type DeviceListClass = typeof DeviceList;

    /**
     * @gir-type Struct
     */
    abstract class DeviceListPrivate {
        static $gtype: GObject.GType<DeviceListPrivate>;
    }


    /**
     * @gir-type Alias
     */
    type DeviceIface = typeof Device;

    namespace Device {
        /**
         * Interface for implementing Device.
         * Contains only the virtual methods that need to be implemented.
         */
        interface Interface {

            // Virtual methods
            /**
             * @virtual
             */
            vfunc_get_subsystem(): Subsystem;

            /**
             * @virtual
             */
            vfunc_get_name(): string;

            /**
             * @virtual
             */
            vfunc_get_brightness(): number;

            /**
             * @param value 
             * @virtual
             */
            vfunc_set_brightness(value: number): void;

            /**
             * @virtual
             */
            vfunc_get_real_brightness(): number;

            /**
             * @param value 
             * @virtual
             */
            vfunc_set_real_brightness(value: number): void;

            /**
             * @virtual
             */
            vfunc_get_max_brightness(): number;
        }


        // Constructor properties interface
        interface ConstructorProps extends GObject.Object.ConstructorProps {
            subsystem: Subsystem;
            name: string;
            brightness: number;
            real_brightness: number;
            realBrightness: number;
            max_brightness: number;
            maxBrightness: number;
        }
    }

    export interface DeviceNamespace {
        $gtype: GObject.GType<Device>;
        prototype: Device;
    }
    /**
     * @gir-type Interface
     */
    interface Device extends GObject.Object, Device.Interface {

        // Properties
        /**
         * The device type.
         * @read-only
         */
        get subsystem(): Subsystem;

        /**
         * The name of the device.
         * @read-only
         */
        get name(): string;

        /**
         * Brightness percentage: `real_brightness / max_brightness`.
         */
        get brightness(): number;
        set brightness(val: number);

        /**
         * The brightness value as reported by sysfs.
         */
        get real_brightness(): number;
        set real_brightness(val: number);

        /**
         * The brightness value as reported by sysfs.
         */
        get realBrightness(): number;
        set realBrightness(val: number);

        /**
         * The maximum brightness value as reported by sysfs.
         * @read-only
         */
        get max_brightness(): number;

        /**
         * The maximum brightness value as reported by sysfs.
         * @read-only
         */
        get maxBrightness(): number;

        // Methods
        get_subsystem(): Subsystem;

        get_name(): string;

        get_brightness(): number;

        /**
         * @param value 
         */
        set_brightness(value: number): void;

        get_real_brightness(): number;

        /**
         * @param value 
         */
        set_real_brightness(value: number): void;

        get_max_brightness(): number;
    }


    export const Device: DeviceNamespace & {
        new (): Device; // This allows `obj instanceof Device`
    };

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

export default AstalBrightness;

}

declare module 'gi://AstalBrightness' {
    import AstalBrightness01 from 'gi://AstalBrightness?version=0.1';
    export default AstalBrightness01;
}
// END
