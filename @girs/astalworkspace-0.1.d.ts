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

declare module 'gi://AstalWorkspace?version=0.1' {

// Module dependencies
import type AstalWl from 'gi://AstalWl?version=0.1';
import type Gio from 'gi://Gio?version=2.0';
import type GObject from 'gi://GObject?version=2.0';
import type GLib from 'gi://GLib?version=2.0';
import type GModule from 'gi://GModule?version=2.0';

export namespace AstalWorkspace {

    /**
     * AstalWorkspace-0.1
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

    /**
     * Check whether the ext-workspace-v1 protocol is supported.
     */
    function is_supported(): boolean;

    function get_default(): WorkspaceManager;

    /**
     * @gir-type Flags
     */
    export namespace GroupCapabilities {
        export const $gtype: GObject.GType<GroupCapabilities>;
    }

    /**
     * The set of actions that the compositor supports on a workspace group. Note that this is a bitfield enum, so "has CREATE_WORKSPACE" 
     * and "no CREATE_WORKSPACE" are the two valid states for this type. Note that this can change over the group's lifetime.
     * @gir-type Flags
     */
    enum GroupCapabilities {
        CREATE_WORKSPACE = 1,
    }


    /**
     * @gir-type Flags
     */
    export namespace WorkspaceState {
        export const $gtype: GObject.GType<WorkspaceState>;
    }

    /**
     * The set of possible states that a workspace can be in. Note that this is a bitfield enum, so any combination of these is allowed. Not every 
     * compositor will use all the states.
     * @gir-type Flags
     */
    enum WorkspaceState {
        ACTIVE = 1,
        URGENT = 2,
        HIDDEN = 4,
    }


    /**
     * @gir-type Flags
     */
    export namespace WorkspaceCapabilities {
        export const $gtype: GObject.GType<WorkspaceCapabilities>;
    }

    /**
     * The set of actions that the compositor supports on a workspace. Note that this is a bitfield enum, so any combination of these is allowed. Note 
     * that this can change over the workspace's lifetime (e.g. ACTIVATE is supported only when inactive, and vice versa)
     * @gir-type Flags
     */
    enum WorkspaceCapabilities {
        ACTIVATE = 1,
        DEACTIVATE = 2,
        REMOVE = 4,
        ASSIGN = 8,
    }


    namespace WorkspaceGroup {
        // Signal signatures
        interface SignalSignatures extends GObject.Object.SignalSignatures, Gio.ListModel.SignalSignatures {
            "notify::capabilities": (pspec: GObject.ParamSpec) => void;
            "notify::outputs": (pspec: GObject.ParamSpec) => void;
            "notify::workspaces": (pspec: GObject.ParamSpec) => void;
            "notify::item-type": (pspec: GObject.ParamSpec) => void;
            "notify::n-items": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps<A extends GObject.Object = GObject.Object> extends GObject.Object.ConstructorProps, Gio.ListModel.ConstructorProps {
            capabilities: GroupCapabilities;
            outputs: AstalWl.Output[];
            workspaces: Workspace[];
            item_type: GObject.GTypeInput;
            itemType: GObject.GTypeInput;
            n_items: number;
            nItems: number;
        }
    }

    /**
     * A group of workspaces, belonging to some set of outputs (monitors). A workspace can be in multiple groups, and a group can be on 
     * multiple outputs (monitors) at once. Most of the time you don't need to worry about groups directly; if you just want the workspaces 
     * on a specific monitor, use a MonitorView object.
     * As a ListModel, it exposes every workspace belonging to the group; lists of outputs and workspaces are also available through properties.
     * @gir-type Class
     */
    class WorkspaceGroup<A extends GObject.Object = GObject.Object> extends GObject.Object implements Gio.ListModel<A> {
        static $gtype: GObject.GType<WorkspaceGroup>;

        // Properties
        /**
         * The group's current capabilities (i.e. can you create workspaces in it). Note that a group's capabilities can change over 
         * its lifetime.
         */
        get capabilities(): GroupCapabilities;
        set capabilities(val: GroupCapabilities);

        /**
         * The set of Wayland outputs (monitors) the group belongs to.
         */
        get outputs(): AstalWl.Output[];
        set outputs(val: AstalWl.Output[]);

        /**
         * The workspaces belonging to this group.
         */
        get workspaces(): Workspace[];
        set workspaces(val: Workspace[]);

        /**
         * @read-only
         */
        get item_type(): GObject.GType;

        /**
         * @read-only
         */
        get itemType(): GObject.GType;

        /**
         * @read-only
         */
        get n_items(): number;

        /**
         * @read-only
         */
        get nItems(): number;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: WorkspaceGroup.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<WorkspaceGroup.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        // Signals
        /** @signal */
        connect<K extends keyof WorkspaceGroup.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, WorkspaceGroup.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof WorkspaceGroup.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, WorkspaceGroup.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof WorkspaceGroup.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<WorkspaceGroup.SignalSignatures[K]>): void;

        // Methods
        /**
         * Ask the compositor to create a workspace with the specified name in this group. This does nothing if the group doesn't have the 
         * CREATE_WORKSPACE capability.
         * @param name 
         */
        create_workspace(name: string): void;

        get_capabilities(): GroupCapabilities;

        get_outputs(): AstalWl.Output[];

        get_workspaces(): Workspace[];

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


    namespace WorkspaceManager {
        // Signal signatures
        interface SignalSignatures extends GObject.Object.SignalSignatures, Gio.ListModel.SignalSignatures {
            /**
             * Emitted when the compositor updates the workspace state.
             * @signal
             */
            updated: () => void;
            "notify::workspaces": (pspec: GObject.ParamSpec) => void;
            "notify::groups": (pspec: GObject.ParamSpec) => void;
            "notify::item-type": (pspec: GObject.ParamSpec) => void;
            "notify::n-items": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps<A extends GObject.Object = GObject.Object> extends GObject.Object.ConstructorProps, Gio.ListModel.ConstructorProps {
            workspaces: Workspace[];
            groups: WorkspaceGroup[];
            item_type: GObject.GTypeInput;
            itemType: GObject.GTypeInput;
            n_items: number;
            nItems: number;
        }
    }

    /**
     * The global workspace state. As a ListModel, it exposes every workspace available; lists of workspaces and groups are also available through 
     * properties, and helper objects can be created to access workspaces on a specific monitor through the for_monitor and for_output factory methods.
     * @gir-type Class
     */
    class WorkspaceManager<A extends GObject.Object = GObject.Object> extends GObject.Object implements Gio.ListModel<A> {
        static $gtype: GObject.GType<WorkspaceManager>;

        // Properties
        get workspaces(): Workspace[];
        set workspaces(val: Workspace[]);

        get groups(): WorkspaceGroup[];
        set groups(val: WorkspaceGroup[]);

        /**
         * @read-only
         */
        get item_type(): GObject.GType;

        /**
         * @read-only
         */
        get itemType(): GObject.GType;

        /**
         * @read-only
         */
        get n_items(): number;

        /**
         * @read-only
         */
        get nItems(): number;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: WorkspaceManager.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<WorkspaceManager.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        static ["new"](): WorkspaceManager;

        // Signals
        /** @signal */
        connect<K extends keyof WorkspaceManager.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, WorkspaceManager.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof WorkspaceManager.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, WorkspaceManager.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof WorkspaceManager.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<WorkspaceManager.SignalSignatures[K]>): void;

        // Static methods
        static get_default(): WorkspaceManager;

        // Methods
        /**
         * Get a proxy object which filters workspaces to those that belong to a group on the specified Wayland output. You can get an AstalWl.Output for 
         * use with this function by using the AstalWl4 helper library, if you're using GTK 4.
         * @param output 
         */
        for_output(output: AstalWl.Output): WorkspaceMonitorView;

        /**
         * Commit any pending workspace method calls. By default, this is done automatically; you can use `freeze_autocommit()` to delay 
         * committing any changes until `thaw_autocommit()` is called. You can also call this while autocommits are frozen to commit manually.
         */
        commit(): void;

        /**
         * Temporarily suspend the automatic `commit()` calls after doing workspace actions. In effect, calling methods like `activate()` 
         * on workspaces or `create_workspace()` on groups while autocommitting is frozen will make them take effect all at once upon calling 
         * `thaw_autocommit()`.
         */
        freeze_autocommit(): void;

        /**
         * Resume the automatic `commit()` calls after doing workspace actions. If any autocommitting actions were taken during the freeze, they 
         * will all be applied at once.
         */
        thaw_autocommit(): void;

        get_workspaces(): Workspace[];

        get_groups(): WorkspaceGroup[];

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


    namespace WorkspaceMonitorView {
        // Signal signatures
        interface SignalSignatures extends GObject.Object.SignalSignatures, Gio.ListModel.SignalSignatures {
            /**
             * Emitted when the Wayland output this object was created with gets destroyed.
             * @signal
             */
            invalidate: () => void;
            "notify::valid": (pspec: GObject.ParamSpec) => void;
            "notify::groups": (pspec: GObject.ParamSpec) => void;
            "notify::item-type": (pspec: GObject.ParamSpec) => void;
            "notify::n-items": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps<A extends GObject.Object = GObject.Object> extends GObject.Object.ConstructorProps, Gio.ListModel.ConstructorProps {
            valid: boolean;
            groups: WorkspaceGroup[];
            item_type: GObject.GTypeInput;
            itemType: GObject.GTypeInput;
            n_items: number;
            nItems: number;
        }
    }

    /**
     * A helper proxy object to list all of the workspaces on a specific monitor (Wayland output) The workspaces are only accessible via 
     * ListModel; the relevant groups can be accessed via property.
     * @gir-type Class
     */
    class WorkspaceMonitorView<A extends GObject.Object = GObject.Object> extends GObject.Object implements Gio.ListModel<A> {
        static $gtype: GObject.GType<WorkspaceMonitorView>;

        // Properties
        /**
         * Whether the Wayland output this object was created with still exists, and thus the object will still receive updates normally.
         */
        get valid(): boolean;
        set valid(val: boolean);

        /**
         * The groups that belong to the monitor view's monitor (Wayland output).
         */
        get groups(): WorkspaceGroup[];
        set groups(val: WorkspaceGroup[]);

        /**
         * @read-only
         */
        get item_type(): GObject.GType;

        /**
         * @read-only
         */
        get itemType(): GObject.GType;

        /**
         * @read-only
         */
        get n_items(): number;

        /**
         * @read-only
         */
        get nItems(): number;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: WorkspaceMonitorView.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<WorkspaceMonitorView.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        // Signals
        /** @signal */
        connect<K extends keyof WorkspaceMonitorView.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, WorkspaceMonitorView.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof WorkspaceMonitorView.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, WorkspaceMonitorView.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof WorkspaceMonitorView.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<WorkspaceMonitorView.SignalSignatures[K]>): void;

        // Methods
        get_valid(): boolean;

        get_groups(): WorkspaceGroup[];

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


    namespace Workspace {
        // Signal signatures
        interface SignalSignatures extends GObject.Object.SignalSignatures {
            "notify::id": (pspec: GObject.ParamSpec) => void;
            "notify::name": (pspec: GObject.ParamSpec) => void;
            "notify::coordinates": (pspec: GObject.ParamSpec) => void;
            "notify::state": (pspec: GObject.ParamSpec) => void;
            "notify::capabilities": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends GObject.Object.ConstructorProps {
            id: string | null;
            name: string;
            coordinates: number[] | null;
            state: WorkspaceState;
            capabilities: WorkspaceCapabilities;
        }
    }

    /**
     * @gir-type Class
     */
    class Workspace extends GObject.Object {
        static $gtype: GObject.GType<Workspace>;

        // Properties
        /**
         * The workspace's ID. This is not required to be set by the compositor, but if it is set, it will not change during the workspace's 
         * lifetime, and will be unique during its lifetime. IDs are not human-readable and shouldn't be displayed, they're for identifying workspaces 
         * across sessions.
         */
        get id(): string | null;
        set id(val: string | null);

        /**
         * The workspace's human-readable name. It is not guaranteed to be unique, and can change during the workspace's lifetime.
         */
        get name(): string;
        set name(val: string);

        /**
         * The workspace's coordinates. Compositors which arrange workspaces geometrically will use this property to describe where the workspace is 
         * in space; other compositors may use the workspace's number or leave it as null.
         */
        get coordinates(): number[] | null;
        set coordinates(val: number[] | null);

        /**
         * The workspace's current state.
         */
        get state(): WorkspaceState;
        set state(val: WorkspaceState);

        /**
         * The workspace's current capabilities. These directly correspond to methods on this object. Note that a workspace's capabilities can 
         * change during its lifetime.
         */
        get capabilities(): WorkspaceCapabilities;
        set capabilities(val: WorkspaceCapabilities);

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: Workspace.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<Workspace.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        // Signals
        /** @signal */
        connect<K extends keyof Workspace.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Workspace.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof Workspace.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Workspace.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof Workspace.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<Workspace.SignalSignatures[K]>): void;

        // Methods
        /**
         * Ask the compositor to activate the workspace. This does nothing if the workspace doesn't have the ACTIVATE capability.
         */
        activate(): void;

        /**
         * Ask the compositor to deactivate the workspace. This does nothing if the workspace doesn't have the DEACTIVATE capability.
         */
        deactivate(): void;

        /**
         * Ask the compositor to assign the workspace to a group. This does nothing if the workspace doesn't have the ASSIGN capability.
         * @param group 
         */
        assign_to_group(group: WorkspaceGroup): void;

        /**
         * Ask the compositor to remove the workspace. This does nothing if the workspace doesn't have the REMOVE capability.
         */
        remove(): void;

        get_id(): string | null;

        get_name(): string;

        get_coordinates(): number[] | null;

        get_state(): WorkspaceState;

        get_capabilities(): WorkspaceCapabilities;
    }


    /**
     * @gir-type Alias
     */
    type WorkspaceGroupClass = typeof WorkspaceGroup;

    /**
     * @gir-type Struct
     */
    abstract class WorkspaceGroupPrivate {
        static $gtype: GObject.GType<WorkspaceGroupPrivate>;
    }


    /**
     * @gir-type Alias
     */
    type WorkspaceManagerClass = typeof WorkspaceManager;

    /**
     * @gir-type Struct
     */
    abstract class WorkspaceManagerPrivate {
        static $gtype: GObject.GType<WorkspaceManagerPrivate>;
    }


    /**
     * @gir-type Alias
     */
    type WorkspaceMonitorViewClass = typeof WorkspaceMonitorView;

    /**
     * @gir-type Struct
     */
    abstract class WorkspaceMonitorViewPrivate {
        static $gtype: GObject.GType<WorkspaceMonitorViewPrivate>;
    }


    /**
     * @gir-type Alias
     */
    type WorkspaceClass = typeof Workspace;

    /**
     * @gir-type Struct
     */
    abstract class WorkspacePrivate {
        static $gtype: GObject.GType<WorkspacePrivate>;
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

export default AstalWorkspace;

}

declare module 'gi://AstalWorkspace' {
    import AstalWorkspace01 from 'gi://AstalWorkspace?version=0.1';
    export default AstalWorkspace01;
}
// END
