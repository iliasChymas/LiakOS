/// <reference path="./gio-2.0.d.ts" />
/// <reference path="./gobject-2.0.d.ts" />
/// <reference path="./glib-2.0.d.ts" />
/// <reference path="./gmodule-2.0.d.ts" />
/// <reference path="./appstream-1.0.d.ts" />

/**
 * Type Definitions for Gjs (https://gjs.guide/)
 *
 * These type definitions are automatically generated, do not edit them by hand.
 * If you found a bug fix it in `ts-for-gir` or create a bug report on https://github.com/gjsify/ts-for-gir
 *
 * The based EJS template file is used for the generated .d.ts file of each GIR module like Gtk-4.0, GObject-2.0, ...
 */

declare module 'gi://AppStreamCompose?version=1.0' {

// Module dependencies
import type Gio from 'gi://Gio?version=2.0';
import type GObject from 'gi://GObject?version=2.0';
import type GLib from 'gi://GLib?version=2.0';
import type GModule from 'gi://GModule?version=2.0';
import type AppStream from 'gi://AppStream?version=1.0';

export namespace AppStreamCompose {

    /**
     * AppStreamCompose-1.0
     */


    /**
     * A metadata composition error.
     * @gir-type Struct
     */
    class ComposeError extends GLib.Error {
        static $gtype: GObject.GType<GLib.Error>;

        // Static fields
        /**
         * Generic failure.
         */
        static FAILED: number;

        // Constructors
        constructor(options: { message: string; code: number });

        // Static methods
        /**
         * @since 0.13.0
         */
        static quark(): GLib.Quark;
    }


    /**
     * @gir-type Enum
     */
    export namespace IconState {
        export const $gtype: GObject.GType<IconState>;
    }

    /**
     * Designated state for an icon of a given size.
     * @gir-type Enum
     * @since 0.15.2
     */
    enum IconState {
        /**
         * Ignore icons of this size.
         */
        IGNORED = 0,
        /**
         * Create cache for the icon, and provide remote link as well.
         */
        CACHED_REMOTE = 1,
        /**
         * Set if the icon should be stored in an icon tarball and be cached locally.
         */
        CACHED_ONLY = 2,
        /**
         * Set if this icon should be stored remotely and fetched on demand.
         */
        REMOTE_ONLY = 3,
    }


    /**
     * @gir-type Enum
     */
    export namespace ImageFormat {
        export const $gtype: GObject.GType<ImageFormat>;
    }

    /**
     * File format of an image.
     * 
     * All of these formats can be read, but renditions are only ever written as
     * {@link AppStreamCompose.ImageFormat.PNG} or {@link AppStreamCompose.ImageFormat.JXL} - the other values are for
     * classifying input data.
     * @gir-type Enum
     * @since 0.14.0
     */
    enum ImageFormat {
        /**
         * Unknown image format.
         */
        UNKNOWN = 0,
        /**
         * PNG format
         */
        PNG = 1,
        /**
         * JPEG-XL format
         */
        JXL = 2,
        /**
         * SVG format
         */
        SVG = 3,
        /**
         * Compressed SVG format
         */
        SVGZ = 4,
        /**
         * AVIF format
         */
        AVIF = 5,
        /**
         * WebP format
         */
        WEBP = 6,
        /**
         * JPEG format
         */
        JPEG = 7,
        /**
         * GIF format
         */
        GIF = 8,
    }


    /**
     * @gir-type Enum
     */
    export namespace ImageScaleMode {
        export const $gtype: GObject.GType<ImageScaleMode>;
    }

    /**
     * How an image rendition should be scaled. Every mode preserves the aspect ratio of
     * the source image - an image is never stretched or cropped to fill a target size.
     * @gir-type Enum
     * @since 1.2.0
     */
    enum ImageScaleMode {
        /**
         * Keep the original (loaded) image size.
         */
        NONE = 0,
        /**
         * Scale to fit the target dimensions and center the
         * 				result on a transparent canvas of exactly that size.
         */
        PAD = 1,
        /**
         * Scale proportionally to match the target width.
         */
        FIT_WIDTH = 2,
        /**
         * Scale proportionally to match the target height.
         */
        FIT_HEIGHT = 3,
    }


    /**
     * A media processing error.
     * @gir-type Struct
     */
    class MediaError extends GLib.Error {
        static $gtype: GObject.GType<GLib.Error>;

        // Static fields
        /**
         * Generic failure.
         */
        static FAILED: number;

        /**
         * The media worker process crashed or could not be spawned.
         */
        static DEAD_WORKER: number;

        /**
         * A media operation took too long and was aborted.
         */
        static TIMEOUT: number;

        /**
         * Communication with the media worker was corrupted.
         */
        static PROTOCOL: number;

        /**
         * The requested operation or image type was not supported.
         */
        static UNSUPPORTED: number;

        /**
         * An external module was missing to process the request.
         */
        static MISSING_MODULE: number;

        // Constructors
        constructor(options: { message: string; code: number });

        // Static methods
        /**
         * Check whether the given error indicates that the media worker itself
         * malfunctioned, as opposed to the processed media simply being broken.
         * Only the former should be reported to users as a worker problem.
         * @param error A {@link GLib.Error} returned by a media operation.
         * @since 1.2.0
         */
        static is_worker_failure(error: GLib.Error | null): boolean;

        /**
         * @since 1.2.0
         */
        static quark(): GLib.Quark;
    }


    /**
     * Builds a global component ID from a component-id
     * and a checksum (usually Blake3) generated from the component data.
     * 
     * The global-id is used as a global, unique identifier for a component.
     * (while the component-ID is local, e.g. for one source).
     * Its primary usecase is to identify a media directory on the filesystem which is
     * associated with this component.
     * 
     * Since the result is used to construct filesystem paths, this function will refuse
     * to build a global ID unless every segment it is made of - the pieces of the
     * component-ID as well as `checksum` - is safe to use as a directory name. The error
     * that is set in that case names the offending piece, and is meant to be shown to
     * whoever wrote the metadata.
     * @param component_id an AppStream component ID.
     * @param checksum a checksum as string generated from the component's combined metadata.
     * @returns The new global ID, or `null` on error.
     * @since 0.13.0
     * @throws GLib.Error
     */
    function build_component_global_id(component_id: string, checksum: string): string | null;

    /**
     * Find the unprocessed icon that a component was created with, that is the
     * icon reference that came straight from its metainfo or desktop-entry file.
     * A stock icon is preferred, but a local one is accepted as well to
     * accommodate for applications that used the "local" icon type wrong.
     * 
     * This is the icon that appstream-compose renders its icon set from. If
     * {@link AppStreamCompose.ComposeFlags.IGNORE_ICONS} is set, it is left on the component
     * untouched, so that the caller can run its own icon processing on it.
     * @param cpt an {@link AppStream.Component} instance.
     * @returns The source {@link AppStream.Icon}, or `null` if the    component has none.
     * @since 1.2.0
     */
    function component_get_source_icon(cpt: AppStream.Component): AppStream.Icon | null;

    /**
     * @returns An error quark.
     * @since 0.13.0
     */
    function compose_error_quark(): GLib.Quark;

    /**
     * Compute a checksum for the given content.
     * 
     * The output of this function is intended to be used with %asc_build_component_global_id
     * to form a unique global ID. The generated checksum is intended to be used as content-ID.
     * Do not assume it is cryptographically secure or has a certain length!
     * @param data The data to hash.
     * @param length Length of `data`.
     * @returns The hash as hexadecimal string. Free with %g_free
     * @since 1.1.3
     */
    function compute_content_checksum_for_data(data: string, length: bigint | number): string;

    /**
     * Register a new hint tag. If a previous tag with the given name
     * already existed, the existing tag will not be replaced unless
     * `override_existing` is set to `true`.
     * Please be careful when overriding tags! Tag severities can not
     * be lowered by overriding a tag.
     * @param tag the tag-ID to add
     * @param severity the tag severity as {@link AppStream.IssueSeverity}
     * @param explanation the tag explanatory message
     * @param override_existing whether an existing tag should be replaced
     * @returns `true` if the tag was registered and did not exist previously.
     * @since 0.14.0
     */
    function globals_add_hint_tag(tag: string, severity: AppStream.IssueSeverity, explanation: string, override_existing: boolean): boolean;

    /**
     * Retrieve all hint tags that we know.
     * @returns A list of valid hint tags. Free with %g_strfreev
     * @since 0.14.0
     */
    function globals_fetch_hint_tags(): string[];

    /**
     * Get path to the "ffprobe" binary we should use.
     * @returns The binary path, or `null` if ffprobe was    not found. The string is owned by the global state and is valid until the    setting is changed, which is prohibited once composing metadata has started.
     * @since 0.14.6
     */
    function globals_get_ffprobe_binary(): string | null;

    /**
     * Get path to the "optipng" binary we should use.
     * @returns The binary path, or `null` if optipng was    not found. The string is owned by the global state and is valid until the    setting is changed, which is prohibited once composing metadata has    started.
     * @since 0.13.0
     */
    function globals_get_optipng_binary(): string | null;

    /**
     * Get temporary directory used by appstream-compose.
     * @returns The temporary directory. The string is owned by the    global state and is valid until the setting is changed, which is prohibited    once composing metadata has started.
     * @since 0.13.0
     */
    function globals_get_tmp_dir(): string;

    /**
     * Get whether images should be optimized using optipng.
     * @returns `true` if optipng should be used.
     * @since 0.13.0
     */
    function globals_get_use_optipng(): boolean;

    /**
     * Check whether a hint tag with the given name is registered.
     * @param tag A hint tag name.
     * @returns `true` if the tag is known.
     * @since 1.2.0
     */
    function globals_hint_tag_exists(tag: string): boolean;

    /**
     * Retrieve the explanation template of the given hint tag.
     * @param tag 
     * @returns An explanation template, or `null` if the tag was not found.
     * @since 0.14.0
     */
    function globals_hint_tag_explanation(tag: string): string;

    /**
     * Retrieve the severity of the given hint tag.
     * @param tag 
     * @returns An {@link AppStream.IssueSeverity} or {@link AppStream.IssueSeverity.UNKNOWN} if the tag did not exist          or has an unknown severity.
     * @since 0.14.0
     */
    function globals_hint_tag_severity(tag: string): AppStream.IssueSeverity;

    /**
     * Set path to the "ffprobe" binary we should use.
     * 
     * This has to be done before composing metadata starts. Once work has
     * begun, changing any global setting is forbidden.
     * @param path the "ffprobe" binary path, or `null`.
     * @since 0.14.6
     */
    function globals_set_ffprobe_binary(path: string | null): void;

    /**
     * Set path to the "optipng" binary we should use.
     * 
     * This has to be done before composing metadata starts. Once work has
     * begun, changing any global setting is forbidden.
     * @param path the "optipng" binary path, or `null`.
     * @since 0.13.0
     */
    function globals_set_optipng_binary(path: string | null): void;

    /**
     * Set temporary directory used by appstream-compose.
     * 
     * This has to be done before composing metadata starts. Once work has
     * begun, changing any global setting is forbidden.
     * @param path the new temporary directory.
     * @since 0.13.0
     */
    function globals_set_tmp_dir(path: string): void;

    /**
     * Set whether images should be optimized using optipng.
     * 
     * This has to be done before composing metadata starts. Once work has
     * begun, changing any global setting is forbidden.
     * @param enabled `true` to optimize images with optipng.
     * @since 0.13.0
     */
    function globals_set_use_optipng(enabled: boolean): void;

    /**
     * Converts the text representation to an enumerated value.
     * @param state_str the string.
     * @returns a {@link AppStreamCompose.IconState}
     * @since 1.0.2
     */
    function icon_state_from_string(state_str: string): IconState;

    /**
     * Converts the enumerated value to an text representation.
     * @param istate the {@link AppStreamCompose.IconState}.
     * @returns string version of `istate`
     * @since 1.0.2
     */
    function icon_state_to_string(istate: IconState): string;

    /**
     * Returns the image format type based on the given file's filename.
     * @param fname the filename.
     * @returns a {@link AppStreamCompose.ImageFormat} or {@link AppStreamCompose.ImageFormat.UNKNOWN} for unknown
     * @since 0.13.0
     */
    function image_format_from_filename(fname: string): ImageFormat;

    /**
     * Converts the text representation to an enumerated value.
     * @param str the string.
     * @returns a {@link AppStreamCompose.ImageFormat} or {@link AppStreamCompose.ImageFormat.UNKNOWN} for unknown
     * @since 0.13.0
     */
    function image_format_from_string(str: string): ImageFormat;

    /**
     * Converts the enumerated value to an text representation.
     * @param format the %AscImageFormat.
     * @returns string version of `format`
     * @since 0.13.0
     */
    function image_format_to_string(format: ImageFormat): string;

    /**
     * Check whether the given error indicates that the media worker itself
     * malfunctioned, as opposed to the processed media simply being broken.
     * Only the former should be reported to users as a worker problem.
     * @param error A {@link GLib.Error} returned by a media operation.
     * @returns `true` if the worker misbehaved.
     * @since 1.2.0
     */
    function media_error_is_worker_failure(error: GLib.Error | null): boolean;

    /**
     * @returns An error quark.
     * @since 1.2.0
     */
    function media_error_quark(): GLib.Quark;

    /**
     * @gir-type Callback
     */
    interface CheckMetadataEarlyFn {
        (cres: Result, unit: Unit): void;
    }

    /**
     * @gir-type Callback
     */
    interface TranslateDesktopTextFn {
        (de: GLib.KeyFile, text: string): string[];
    }

    /**
     * @gir-type Flags
     */
    export namespace ComposeFlags {
        export const $gtype: GObject.GType<ComposeFlags>;
    }

    /**
     * Flags that affect the compose process.
     * @gir-type Flags
     * @since 0.14.5
     */
    enum ComposeFlags {
        /**
         * No flags.
         */
        NONE = 0,
        /**
         * Process units in parallel. Ignored if an {@link AppStreamCompose.Media} was set via `asc_compose_set_media()`.
         */
        USE_THREADS = 1,
        /**
         * Allow network access for downloading extra data.
         */
        ALLOW_NET = 2,
        /**
         * Validate metadata while processing.
         */
        VALIDATE = 4,
        /**
         * Whether screenshots should be cached in the media directory.
         */
        STORE_SCREENSHOTS = 8,
        /**
         * Handle & store video screenshots (they will be removed without this flag)
         */
        ALLOW_VIDEOS = 16,
        /**
         * Set if font components should be processed.
         */
        PROCESS_FONTS = 32,
        /**
         * Automatically extract component translation status.
         */
        PROCESS_TRANSLATIONS = 64,
        /**
         * Any icon information is completely ignored. Useful for later manual icon processing.
         */
        IGNORE_ICONS = 128,
        /**
         * Process desktop-entry files that do not have a corresponding metainfo file.
         */
        PROCESS_UNPAIRED_DESKTOP = 256,
        /**
         * Whether all custom entries should be passed on to the output, ignoring the allowlist.
         */
        PROPAGATE_CUSTOM = 512,
        /**
         * Whether artifact data should be passed through to the generated output.
         */
        PROPAGATE_ARTIFACTS = 1024,
        /**
         * Disable the automatic finalization check to perform it manually at a later time.
         */
        NO_FINAL_CHECK = 2048,
        /**
         * Do not use `media_baseurl` and always embed complete URLs in generated metadata.
         */
        NO_PARTIAL_URLS = 4096,
    }


    /**
     * @gir-type Flags
     */
    export namespace ImageSaveFlags {
        export const $gtype: GObject.GType<ImageSaveFlags>;
    }

    /**
     * The flags used for saving images.
     * @gir-type Flags
     * @since 0.14.0
     */
    enum ImageSaveFlags {
        /**
         * No special flags set
         */
        NONE = 0,
        /**
         * Encode the image losslessly
         */
        LOSSLESS = 1,
        /**
         * Optimize generated PNG for size
         */
        OPTIMIZE = 2,
        /**
         * Sharpen the image to clarify detail
         */
        SHARPEN = 4,
    }


    namespace Compose {
        // Signal signatures
        interface SignalSignatures extends GObject.Object.SignalSignatures {}

        // Constructor properties interface
        interface ConstructorProps extends GObject.Object.ConstructorProps {}
    }

    /**
     * @gir-type Class
     */
    class Compose extends GObject.Object {
        static $gtype: GObject.GType<Compose>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: Compose.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<Compose.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        static ["new"](): Compose;

        // Signals
        /** @signal */
        connect<K extends keyof Compose.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Compose.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof Compose.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Compose.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof Compose.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<Compose.SignalSignatures[K]>): void;

        // Methods
        /**
         * Adds a component ID to the allowlist. If the list is not empty, only
         * components in the list will be added to the metadata output.
         * @param component_id The component-id to whitelist
         * @since 0.14.5
         */
        add_allowed_cid(component_id: string): void;

        /**
         * Add a key to the allowlist that is used to filter custom tag values.
         * @param key_id the custom key to add to the allowed list.
         * @since 0.15.1
         */
        add_custom_allowed(key_id: string): void;

        /**
         * Add compose flags.
         * @param flags The compose flags to add.
         * @since 0.15.1
         */
        add_flags(flags: ComposeFlags): void;

        /**
         * Add an {@link AppStreamCompose.Unit} as data source for metadata processing.
         * @param unit The {@link AppStreamCompose.Unit} to add
         * @since 0.14.5
         */
        add_unit(unit: Unit): void;

        /**
         * Get the results components extracted in the last data processing run.
         * @returns The components
         * @since 0.14.5
         */
        fetch_components(): AppStream.Component[];

        /**
         * Perform final validation of generated data for the specified
         * result container.
         * @param result the {@link AppStreamCompose.Result} to finalize
         * @since 0.15.1
         */
        finalize_result(result: Result): void;

        /**
         * Perform final validation of generated data.
         * Calling this function is not necessary, unless the final check was explicitly
         * disabled using the {@link AppStreamCompose.ComposeFlags.NO_FINAL_CHECK} flag.
         * @since 0.15.1
         */
        finalize_results(): void;

        /**
         * Get the CA file used to verify peers with, or `null` for default.
         * @since 0.15.2
         */
        get_cainfo(): string;

        /**
         * Get the data result directory.
         * @since 0.14.5
         */
        get_data_result_dir(): string;

        /**
         * Get the flags controlling compose behavior.
         * @since 0.14.5
         */
        get_flags(): ComposeFlags;

        /**
         * get the format type we are generating.
         * @since 0.14.5
         */
        get_format(): AppStream.FormatKind;

        /**
         * Get hints report output directory.
         * @since 0.14.5
         */
        get_hints_result_dir(): string;

        /**
         * Get the policy for how icons should be distributed to
         * any AppStream clients.
         * @returns an {@link AppStreamCompose.IconPolicy}
         * @since 0.15.1
         */
        get_icon_policy(): IconPolicy;

        /**
         * Get the icon result directory.
         * @since 0.14.5
         */
        get_icons_result_dir(): string;

        /**
         * Get the file format that generated icons and screenshots are stored in.
         * This is unrelated to %asc_compose_get_format, which selects the format
         * of the generated catalog metadata.
         * @since 1.2.0
         */
        get_image_format(): ImageFormat;

        /**
         * Get the unit we use for locale processing
         * @returns The unit used for locale processing, or `null` for default.
         * @since 0.15.1
         */
        get_locale_unit(): Unit | null;

        /**
         * Get the maximum size a screenshot video or image can have.
         * A size < 0 may be returned for no limit, setting a limit of 0
         * will disable screenshots.
         * @since 0.15.1
         */
        get_max_screenshot_size(): number;

        /**
         * Get the media base URL to be used for the generated data,
         * or `null` if no media is cached.
         * @since 0.14.5
         */
        get_media_baseurl(): string;

        /**
         * Get the media result directory, that can be served on a webserver.
         * @since 0.14.5
         */
        get_media_result_dir(): string;

        /**
         * Get the metadata origin field.
         * @since 0.14.5
         */
        get_origin(): string;

        /**
         * Get the directory prefix used for processing.
         * @since 0.14.5
         */
        get_prefix(): string;

        /**
         * Get the results of the last processing run.
         * @returns The results
         * @since 0.14.5
         */
        get_results(): Result[];

        /**
         * Get the user agent used for network requests, or `null` for the default one.
         * @since 1.2.1
         */
        get_user_agent(): string;

        /**
         * Check if the last run generated any errors (which will cause metadata to be ignored).
         * @returns `true` if we had errors.
         * @since 0.14.5
         */
        has_errors(): boolean;

        /**
         * Remove a key from the allowlist used to filter the `<custom/>` tag entries.
         * @param key_id the custom key to drop from the allowed list.
         * @since 0.15.1
         */
        remove_custom_allowed(key_id: string): void;

        /**
         * Remove compose flags.
         * @param flags The compose flags to remove.
         * @since 0.15.1
         */
        remove_flags(flags: ComposeFlags): void;

        /**
         * Drop the results, the registered units and the allowed component-ID list of
         * the last run, so the instance can be reused for another metadata generation
         * run. Everything else - flags, result directories, icon policy, media
         * instance, locale unit, allowed custom keys and the callbacks - is retained.
         * @since 0.14.5
         */
        reset(): void;

        /**
         * Process the registered units and generate catalog metadata from
         * found components.
         * @param cancellable a {@link Gio.Cancellable}.
         * @returns The results, or `null` on error
         * @since 0.14.5
         * @throws GLib.Error
         */
        run(cancellable: Gio.Cancellable | null): Result[];

        /**
         * Set a CA file holding one or more certificates to verify peers with
         * for download operations performed by this {@link AppStreamCompose.Compose}.
         * @param cainfo a valid file path
         * @since 0.15.2
         */
        set_cainfo(cainfo: string): void;

        /**
         * Set an custom callback to be run when most of the metadata has been loaded,
         * but no expensive operations (like downloads or icon rendering) have been done yet.
         * This can be used to ignore unwanted components early on.
         * 
         * The callback function may be called from any thread, so it needs to ensure thread safety on its own.
         * 
         * Any previously set callback is replaced, and its user data released using the
         * destroy function it was registered with.
         * @param func the {@link AppStreamCompose.CheckMetadataEarlyFn} function to be called
         * @since 0.15.1
         */
        set_check_metadata_early_func(func: CheckMetadataEarlyFn | null): void;

        /**
         * Set an output location where generated metadata should be saved.
         * If this is set to `null`, no metadata will be saved.
         * @param dir the metadata save location.
         * @since 0.14.5
         */
        set_data_result_dir(dir: string): void;

        /**
         * Set a custom desktop-entry field localization functions to be run for specialized
         * desktop-entry localization schemes such as used in Ubuntu.
         * 
         * The callback function may be called from any thread, so it needs to ensure thread safety on its own.
         * 
         * Any previously set callback is replaced, and its user data released using the
         * destroy function it was registered with.
         * @param func the {@link AppStreamCompose.TranslateDesktopTextFn} function to be called
         * @since 0.15.1
         */
        set_desktop_entry_l10n_func(func: TranslateDesktopTextFn | null): void;

        /**
         * Set compose flags bitfield that controls the enabled features
         * for this {@link AppStreamCompose.Compose}.
         * @param flags The compose flags bitfield.
         * @since 0.14.5
         */
        set_flags(flags: ComposeFlags): void;

        /**
         * Set the format kind of the catalog metadata that we should generate.
         * @param kind The format, e.g. {@link AppStream.FormatKind.XML}
         * @since 0.14.5
         */
        set_format(kind: AppStream.FormatKind): void;

        /**
         * Set an output location for HTML reports of issues generated
         * during a compose run.
         * @param dir the hints data directory.
         * @since 0.14.5
         */
        set_hints_result_dir(dir: string): void;

        /**
         * Set an icon policy object, overriding the existing one.
         * @param policy an {@link AppStreamCompose.IconPolicy} instance
         * @since 0.15.1
         */
        set_icon_policy(policy: IconPolicy): void;

        /**
         * Set an output location where plain icons for the processed metadata
         * are stored.
         * @param dir the icon storage location.
         * @since 0.14.5
         */
        set_icons_result_dir(dir: string): void;

        /**
         * Set the file format that generated icons and screenshots should be stored in.
         * We only support {@link AppStreamCompose.ImageFormat.JXL} (the default) and {@link AppStreamCompose.ImageFormat.PNG}
         * here, any other format is rejected.
         * 
         * Please note that JPEG-XL images can not be read by older AppStream clients,
         * so PNG may be selected for backwards compatibility.
         * @param format The image format, e.g. {@link AppStreamCompose.ImageFormat.JXL}
         * @since 1.2.0
         */
        set_image_format(format: ImageFormat): void;

        /**
         * Set a specific unit that is used for fetching locale information.
         * This may be useful in case a special language pack layout is used,
         * but is generally not necessary to be set explicitly, as locale
         * will be found in the unit where the metadata is by default.
         * 
         * Do not forget to open the locale unit, before running compose
         * actions with it!
         * @param locale_unit the unit used for locale processing.
         * @since 0.15.1
         */
        set_locale_unit(locale_unit: Unit): void;

        /**
         * Set the maximum size a screenshot video or image can have.
         * A size < 0 may be set to allow unlimited sizes, setting a limit of 0
         * will disable screenshot caching entirely.
         * @param size_bytes maximum size of a screenshot image or video in bytes
         * @since 0.15.1
         */
        set_max_screenshot_size(size_bytes: bigint | number): void;

        /**
         * Set a media processing interface to use for every unit that this compose
         * object processes (otherwise it will create a fresh one per unit/thread that it uses).
         * This allows a caller that wants to use an {@link AppStreamCompose.Media} itself or that composes
         * many units in sequence to amortize the cost of starting a second media worker.
         * 
         * An {@link AppStreamCompose.Media} instance must never be used by more than one thread, so while
         * a media object is set, {@link AppStreamCompose.Compose} will always process its units
         * sequentially, ignoring {@link AppStreamCompose.ComposeFlags.USE_THREADS}. Pass `null` to restore
         * the default behavior of using one media instance per unit.
         * @param media an {@link AppStreamCompose.Media} instance, or `null`
         * @since 1.2.0
         */
        set_media(media: Media | null): void;

        /**
         * Set the media base URL for the generated metadata. Can be `null` if no media
         * should be cached and the original URLs should be kept.
         * @param url the media base URL.
         * @since 0.14.5
         */
        set_media_baseurl(url: string | null): void;

        /**
         * Set an output location to store media (screenshots, icons, ...) that
         * will be served on a webserver via the URL set as media baseurl.
         * @param dir the media storage location.
         * @since 0.14.5
         */
        set_media_result_dir(dir: string): void;

        /**
         * Set the metadata origin field (e.g. "debian" or "flathub")
         * @param origin the origin.
         * @since 0.14.5
         */
        set_origin(origin: string): void;

        /**
         * Set the directory prefix the to-be-processed units are using.
         * @param prefix a directory prefix, e.g. "/usr"
         * @since 0.14.5
         */
        set_prefix(prefix: string): void;

        /**
         * Set the user agent that download operations performed by this {@link AppStreamCompose.Compose}
         * identify themselves with.
         * @param user_agent the user agent to use, e.g. `mygenerator/1.0`
         * @since 1.2.1
         */
        set_user_agent(user_agent: string): void;
    }


    namespace DirectoryUnit {
        // Signal signatures
        interface SignalSignatures extends Unit.SignalSignatures {}

        // Constructor properties interface
        interface ConstructorProps extends Unit.ConstructorProps {}
    }

    /**
     * @gir-type Class
     */
    class DirectoryUnit extends Unit {
        static $gtype: GObject.GType<DirectoryUnit>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: DirectoryUnit.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<DirectoryUnit.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        static ["new"](root_dir: string): DirectoryUnit;

        // Signals
        /** @signal */
        connect<K extends keyof DirectoryUnit.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, DirectoryUnit.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof DirectoryUnit.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, DirectoryUnit.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof DirectoryUnit.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<DirectoryUnit.SignalSignatures[K]>): void;

        // Methods
        /**
         * Get the root directory path for this unit.
         * @since 0.14.5
         */
        get_root(): string;
    }


    namespace Hint {
        // Signal signatures
        interface SignalSignatures extends GObject.Object.SignalSignatures {}

        // Constructor properties interface
        interface ConstructorProps extends GObject.Object.ConstructorProps {}
    }

    /**
     * @gir-type Class
     */
    class Hint extends GObject.Object {
        static $gtype: GObject.GType<Hint>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: Hint.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<Hint.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        static new_for_tag(tag: string): Hint;

        // Signals
        /** @signal */
        connect<K extends keyof Hint.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Hint.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof Hint.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Hint.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof Hint.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<Hint.SignalSignatures[K]>): void;

        // Methods
        /**
         * Add a replacement variable for the explanation text.
         * @param var_name Name of the variable to be replaced.
         * @param text Replacement for the variable name.
         * @since 0.13.0
         */
        add_explanation_var(var_name: string, text: string): void;

        /**
         * Formats the explanation template to return a human-readable issue hint explanation,
         * with all placeholder variables replaced.
         * 
         * Explanation templates contain markup, so the result of this function is a snippet of
         * HTML, ready to be embedded into a generated report.
         * 
         * Use %asc_hint_format_explanation_plain if you need text to display without HTML
         * markup.
         * @returns Explanation text for this hint as HTML.
         * @since 0.13.0
         */
        format_explanation(): string;

        /**
         * Formats the explanation template like %asc_hint_format_explanation does, but resolves
         * all markup of the template into plain text: emphasis is dropped, code spans are marked
         * the way Markdown does, line breaks become actual line breaks, links are reduced to
         * their text followed by the URL they point to, and escaped characters are unescaped.
         * @returns Explanation text for this hint as plain text.
         * @since 1.2.0
         */
        format_explanation_plain(): string;

        /**
         * Gets the explanation template for this hint.
         * @since 0.13.0
         */
        get_explanation_template(): string;

        /**
         * Returns a list with the flattened key/value pairs for this hint.
         * Values are located in uneven list entries, following their keys in even list entries.
         * @returns A flattened {@link GLib.PtrArray} with the key/value pairs.
         * @since 0.14.0
         */
        get_explanation_vars_list(): string[];

        /**
         * Gets the issue severity of this hint.
         * @since 0.13.0
         */
        get_severity(): AppStream.IssueSeverity;

        /**
         * Gets the unique tag for the type of this hint.
         * @since 0.13.0
         */
        get_tag(): string;

        /**
         * @returns `true` if this hint describes an error.
         * @since 0.13.0
         */
        is_error(): boolean;

        /**
         * Check if this hint is valid (it requires at least a tag and a severity
         * in order to be considered valid).
         * @returns `true` if this hint is valid.
         * @since 0.13.0
         */
        is_valid(): boolean;
    }


    namespace IconPolicy {
        // Signal signatures
        interface SignalSignatures extends GObject.Object.SignalSignatures {}

        // Constructor properties interface
        interface ConstructorProps extends GObject.Object.ConstructorProps {}
    }

    /**
     * @gir-type Class
     */
    class IconPolicy extends GObject.Object {
        static $gtype: GObject.GType<IconPolicy>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: IconPolicy.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<IconPolicy.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        static ["new"](): IconPolicy;

        // Signals
        /** @signal */
        connect<K extends keyof IconPolicy.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, IconPolicy.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof IconPolicy.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, IconPolicy.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof IconPolicy.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<IconPolicy.SignalSignatures[K]>): void;

        // Methods
        /**
         * Loads the icon policy from a textual representation.
         * @param serialized_policy A policy string as returned by %asc_icon_policy_to_string
         * @since 1.0.2
         * @throws GLib.Error
         */
        from_string(serialized_policy: string): boolean;

        /**
         * Sets a designated state for an icon of the given size.
         * @param icon_size the size of the icon to set policy for (e.g. 64 for 64x64px icons)
         * @param icon_scale the icon scale factor, e.g. 1
         * @param state the designated {@link AppStreamCompose.IconState}
         * @since 0.15.2
         */
        set_policy(icon_size: number, icon_scale: number, state: IconState): void;

        /**
         * Converts the current icon policy into a textual representation.
         * @returns The icon policy serialized into a string. Free with `g_free()`
         * @since 1.0.2
         */
        to_string(): string;
    }


    namespace Media {
        // Signal signatures
        interface SignalSignatures extends GObject.Object.SignalSignatures {}

        // Constructor properties interface
        interface ConstructorProps extends GObject.Object.ConstructorProps {}
    }

    /**
     * @gir-type Class
     */
    class Media extends GObject.Object {
        static $gtype: GObject.GType<Media>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: Media.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<Media.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        static ["new"](): Media;

        // Signals
        /** @signal */
        connect<K extends keyof Media.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Media.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof Media.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Media.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof Media.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<Media.SignalSignatures[K]>): void;

        // Methods
        /**
         * Ensure a media worker process is running, spawning one if necessary.
         * This function is called implicitly by all media operations, calling
         * it explicitly is only useful to make worker startup problems surface
         * early.
         * @param cancellable a {@link Gio.Cancellable}, or `null`
         * @returns `true` if the worker is running.
         * @since 1.2.0
         * @throws GLib.Error
         */
        ensure_worker(cancellable: Gio.Cancellable | null): boolean;

        /**
         * Get the address space limit applied to the worker process in MiB,
         * or 0 if the worker may use as much memory as it wants.
         * @since 1.2.0
         */
        get_memory_limit(): number;

        /**
         * Get the request timeout in seconds.
         * @since 1.2.0
         */
        get_request_timeout(): number;

        /**
         * Load an image (in the media worker process) and store an arbitrary set of
         * scaled renditions of it in the given output directory. The directory is
         * created if it does not exist yet.
         * 
         * On success, the dimensions the source image was loaded at are recorded in
         * `source`, and the result fields of all `targets` are updated. Individual
         * renditions may still have failed - this is recorded in their error message
         * and does not affect the return value of this function.
         * 
         * Cancelling this operation terminates the media worker process, as its
         * pending reply would otherwise desynchronize the next request. A fresh
         * worker is spawned automatically for the next operation.
         * @param source The {@link AppStreamCompose.ImageSource} describing the image to process.
         * @param targets Renditions to generate, or `null` to just read image info.
         * @param out_dir Directory to store the renditions in, may be `null` if `targets` is empty.
         * @param cancellable a {@link Gio.Cancellable}, or `null`
         * @returns `true` if the image was processed.
         * @since 1.2.0
         * @throws GLib.Error
         */
        process_image(source: ImageSource, targets: ImageTarget[] | null, out_dir: string, cancellable: Gio.Cancellable | null): boolean;

        /**
         * Limit the amount of memory the worker process may use.
         * The limit is applied when the next worker process is spawned.
         * @param limit_mib Address space limit for the worker process in MiB, 0 for no limit.
         * @since 1.2.0
         */
        set_memory_limit(limit_mib: number): void;

        /**
         * Set the time a single media operation may take before the worker
         * is assumed to hang and gets killed.
         * @param seconds New timeout in seconds, 0 for no timeout.
         * @since 1.2.0
         */
        set_request_timeout(seconds: number): void;

        /**
         * Stop the worker process of this instance, if it is running.
         * A new worker will be spawned automatically if another media
         * operation is requested.
         * @since 1.2.0
         */
        stop(): void;
    }


    namespace Result {
        // Signal signatures
        interface SignalSignatures extends GObject.Object.SignalSignatures {}

        // Constructor properties interface
        interface ConstructorProps extends GObject.Object.ConstructorProps {}
    }

    /**
     * @gir-type Class
     */
    class Result extends GObject.Object {
        static $gtype: GObject.GType<Result>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: Result.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<Result.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        static ["new"](): Result;

        // Signals
        /** @signal */
        connect<K extends keyof Result.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Result.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof Result.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Result.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof Result.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<Result.SignalSignatures[K]>): void;

        // Methods
        /**
         * Add component to the results set.
         * @param cpt The {@link AppStream.Component} to add.
         * @param bytes Source data used to generate the GCID hash, or `null` if nonexistent.
         * @returns `true` on success.
         * @since 0.13.0
         * @throws GLib.Error
         */
        add_component(cpt: AppStream.Component, bytes: GLib.Bytes | Uint8Array): boolean;

        /**
         * Add component to the results set, using string data.
         * @param cpt The {@link AppStream.Component} to add.
         * @param data Source data used to generate the GCID hash, or `null` if nonexistent.
         * @returns `true` on success.
         * @since 0.14.0
         * @throws GLib.Error
         */
        add_component_with_string(cpt: AppStream.Component, data: string): boolean;

        /**
         * Add an issue hint for a component.
         * @param component_id The component-ID of the affected {@link AppStream.Component}
         * @param tag AppStream Compose Issue hint tag
         * @param kv List of key-value pairs for replacement variables.
         * @returns `true` if the added hint did not cause the component to be invalidated.
         * @since 0.13.0
         */
        add_hint_by_cid(component_id: string, tag: string, kv: string): boolean;

        /**
         * Add an issue hint which does not have any variables to replace in its
         * explanation text for a component.
         * @param cpt The affected {@link AppStream.Component}
         * @param tag AppStream Compose Issue hint tag
         * @returns `true` if the added hint did not cause the component to be invalidated.
         * @since 0.14.0
         */
        add_hint_simple(cpt: AppStream.Component, tag: string): boolean;

        /**
         * Add an issue hint for a component.
         * @param cpt The affected {@link AppStream.Component}
         * @param tag AppStream Compose Issue hint tag
         * @param kv List of key-value pairs for replacement variables.
         * @returns `true` if the added hint did not cause the component to be invalidated.
         * @since 0.13.0
         */
        add_hint(cpt: AppStream.Component, tag: string, kv: string): boolean;

        /**
         * @returns The amount of components found for this unit.
         * @since 0.13.0
         */
        components_count(): number;

        /**
         * Retrieve a list of all global component-IDs that this result knows of.
         * @returns An array of global component IDs. Free with %g_free
         * @since 0.14.0
         */
        fetch_component_gcids(): string[];

        /**
         * Gets list of component-IDs which do have issue hints associated with them.
         * @returns An array of component-IDs. Free container with %g_free
         * @since 0.14.0
         */
        fetch_component_ids_with_hints(): string[];

        /**
         * Gets all components this `AsResult` instance contains.
         * @returns An array of {@link AppStream.Component}
         * @since 0.13.0
         */
        fetch_components(): AppStream.Component[];

        /**
         * Get a list of all hints for all components that are registered with this result.
         * @returns An array of {@link AppStreamCompose.Hint}
         * @since 0.14.5
         */
        fetch_hints_all(): Hint[];

        /**
         * Retrieve the global component-ID string for the given component-ID,
         * as long as component with the given ID is registered with this {@link AppStreamCompose.Result}.
         * Otherwise, `null` is returned.
         * @param cid Component ID to look for.
         * @since 0.14.0
         */
        gcid_for_cid(cid: string): string;

        /**
         * Retrieve the global component-ID string for the given {@link AppStream.Component},
         * as long as component with the given ID is registered with this {@link AppStreamCompose.Result}.
         * @param cpt Component to look for.
         * @returns The global component ID, or `null` if    `cpt` is not registered with this result.
         * @since 0.14.0
         */
        gcid_for_component(cpt: AppStream.Component): string | null;

        /**
         * Gets the ID name of the bundle (a package / Flatpak / any entity containing metadata)
         * that these these results are generated for.
         * @since 0.13.0
         */
        get_bundle_id(): string;

        /**
         * Gets the bundle kind these results are for.
         * @since 0.13.0
         */
        get_bundle_kind(): AppStream.BundleKind;

        /**
         * Gets the component by its component-id-
         * @param cid Component ID to look for.
         * @returns An {@link AppStream.Component}
         * @since 0.13.0
         */
        get_component(cid: string): AppStream.Component;

        /**
         * Gets hints for a component with the given component-id.
         * @param cid Component ID to look for.
         * @returns An array of {@link AppStreamCompose.Hint} or `null`
         * @since 0.13.0
         */
        get_hints(cid: string): Hint[];

        /**
         * Test if a hint tag is associated with a given component in this result.
         * @param cpt the {@link AppStream.Component} to check
         * @param tag the hint tag to check for
         * @returns `true` if a hint with this tag exists for the selected component.
         * @since 0.15.1
         */
        has_hint(cpt: AppStream.Component, tag: string): boolean;

        /**
         * @returns The amount of hints emitted for this unit.
         * @since 0.13.0
         */
        hints_count(): number;

        /**
         * Check if an {@link AppStream.Component} was set to be ignored in this result
         * (usually due to errors).
         * @param cpt the component to check for.
         * @returns `true` if the component is ignored.
         * @since 0.13.0
         */
        is_ignored(cpt: AppStream.Component): boolean;

        /**
         * Remove a component from the results set.
         * @param cpt The {@link AppStream.Component} to remove.
         * @returns `true` if the component was found and removed.
         * @since 0.13.0
         */
        remove_component(cpt: AppStream.Component): boolean;

        /**
         * Remove a component from the results set.
         * @param cpt The {@link AppStream.Component} to remove.
         * @param remove_gcid `true` if global component ID should be unregistered as well.
         * @returns `true` if the component was found and removed.
         * @since 0.15.1
         */
        remove_component_full(cpt: AppStream.Component, remove_gcid: boolean): boolean;

        /**
         * Remove all hints that we have associated with the selected component-ID.
         * @param cid The component ID
         * @since 0.14.5
         */
        remove_hints_for_cid(cid: string): void;

        /**
         * Sets the name of the bundle these results are for.
         * @param id The new ID.
         * @since 0.13.0
         */
        set_bundle_id(id: string): void;

        /**
         * Sets the kind of the bundle these results are for.
         * @param kind 
         * @since 0.13.0
         */
        set_bundle_kind(kind: AppStream.BundleKind): void;

        /**
         * @returns `true` if this result means the analyzed unit was ignored entirely.
         * @since 0.13.0
         */
        unit_ignored(): boolean;
    }


    namespace Unit {
        // Signal signatures
        interface SignalSignatures extends GObject.Object.SignalSignatures {}

        // Constructor properties interface
        interface ConstructorProps extends GObject.Object.ConstructorProps {}
    }

    /**
     * @gir-type Class
     */
    abstract class Unit extends GObject.Object {
        static $gtype: GObject.GType<Unit>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: Unit.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<Unit.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        // Signals
        /** @signal */
        connect<K extends keyof Unit.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Unit.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof Unit.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Unit.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof Unit.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<Unit.SignalSignatures[K]>): void;

        // Virtual methods
        /**
         * Close this unit, possibly freeing its resources. Calls to `read_data()` or
         * `get_contents()` may not produce results until `open()` is called again.
         * @since 0.14.5
         * @virtual
         */
        vfunc_close(): void;

        /**
         * Returns `true` if the directory exists and files in it are readable.
         * @param dirname The directory name to check.
         * @since 0.14.5
         * @virtual
         */
        vfunc_dir_exists(dirname: string): boolean;

        /**
         * Returns `true` if the filename exists and is readable using %asc_unit_read_data.
         * @param filename The filename to check.
         * @since 0.14.5
         * @virtual
         */
        vfunc_file_exists(filename: string): boolean;

        /**
         * Open this unit, populating its content listing.
         * @since 0.14.5
         * @virtual
         */
        vfunc_open(): boolean;

        /**
         * Read the contents of the selected file into memory and return them.
         * @param filename The file to read data for.
         * @since 0.14.5
         * @virtual
         */
        vfunc_read_data(filename: string): GLib.Bytes | Uint8Array;

        // Methods
        /**
         * Add a path to the list of relevant directories.
         * A unit may only read data in paths that were previously
         * registered as relevant.
         * @param path path to be considered relevant
         * @since 0.14.5
         */
        add_relevant_path(path: string): void;

        /**
         * Close this unit, possibly freeing its resources. Calls to `read_data()` or
         * `get_contents()` may not produce results until `open()` is called again.
         * @since 0.14.5
         */
        close(): void;

        /**
         * Returns `true` if the directory exists and files in it are readable.
         * @param dirname The directory name to check.
         * @since 0.14.5
         */
        dir_exists(dirname: string): boolean;

        /**
         * Returns `true` if the filename exists and is readable using %asc_unit_read_data.
         * @param filename The filename to check.
         * @since 0.14.5
         */
        file_exists(filename: string): boolean;

        /**
         * Gets the ID name of the bundle (a package / Flatpak / any entity containing metadata)
         * that this unit represents.
         * @since 0.14.5
         */
        get_bundle_id(): string;

        /**
         * Gets the ID name of the bundle, normalized to be safe to use
         * in filenames. This may *not* be the same name as set via
         * `asc_unit_set_bundle_id()`.
         * @returns The sanitized bundle ID, or `null` if    no bundle ID was set.
         * @since 0.15.1
         */
        get_bundle_id_fs_safe(): string | null;

        /**
         * Gets the bundle kind of this unit.
         * @since 0.14.5
         */
        get_bundle_kind(): AppStream.BundleKind;

        /**
         * Get a list of all files contained by this unit.
         * @returns A file listing
         * @since 0.14.5
         */
        get_contents(): string[];

        /**
         * Get a list of paths that are relevant for data processing.
         * @returns A list of paths
         * @since 0.14.5
         */
        get_relevant_paths(): string[];

        /**
         * Open this unit, populating its content listing.
         * @since 0.14.5
         * @throws GLib.Error
         */
        open(): boolean;

        /**
         * Read the contents of the selected file into memory and return them.
         * @param filename The file to read data for.
         * @since 0.14.5
         * @throws GLib.Error
         */
        read_data(filename: string): GLib.Bytes;

        /**
         * Sets the ID of the bundle represented by this unit.
         * @param id The new ID.
         * @since 0.14.5
         */
        set_bundle_id(id: string): void;

        /**
         * Sets the kind of the bundle this unit represents.
         * @param kind 
         * @since 0.14.5
         */
        set_bundle_kind(kind: AppStream.BundleKind): void;

        /**
         * Set list of files this unit contains.
         * @param contents A list of files contained by this unit.
         * @since 0.14.5
         */
        set_contents(contents: string[]): void;
    }


    /**
     * @gir-type Alias
     */
    type ComposeClass = typeof Compose;

    /**
     * @gir-type Alias
     */
    type DirectoryUnitClass = typeof DirectoryUnit;

    /**
     * @gir-type Alias
     */
    type HintClass = typeof Hint;

    /**
     * @gir-type Alias
     */
    type IconPolicyClass = typeof IconPolicy;

    /**
     * A {@link AppStreamCompose.IconPolicyIter} structure represents an iterator that can be used
     * to iterate over the icon sizes / policy entries of an {@link AppStreamCompose.IconPolicy}.
     * {@link AppStreamCompose.IconPolicyIter} structures are typically allocated on the stack and
     * then initialized with `asc_icon_policy_iter_init()`.
     * @gir-type Struct
     * @since 0.15.2
     */
    class IconPolicyIter {
        static $gtype: GObject.GType<IconPolicyIter>;

        // Constructors
        constructor(properties?: Partial<{}>);

        // Methods
        /**
         * Initializes a policy iterator for the policy entry list and associates it
         * it with `ipolicy`.
         * The {@link AppStreamCompose.IconPolicyIter} structure is typically allocated on the stack
         * and does not need to be freed explicitly.
         * @param ipolicy an {@link AppStreamCompose.IconPolicy}
         * @since 0.15.2
         */
        init(ipolicy: IconPolicy): void;

        /**
         * Returns the current icon policy entry and advances the iterator.
         * Example:
         * 
         * ```c
         * AscIconPolicyIter iter;
         * guint icon_size;
         * guint icon_scale;
         * AscIconState istate;
         * 
         * asc_icon_policy_iter_init (&iter, ipolicy);
         * while (asc_icon_policy_iter_next (&iter, &icon_size, &icon_scale, &istate)) {
         *     // do something with the icon entry data
         * }
         * ```
         * 
         * @returns `false` if the last entry has been reached.
         * @since 0.15.2
         */
        next(): [boolean, number, number, IconState | null];
    }


    /**
     * Describes the image a media operation should read, and how it should be
     * loaded. After the operation has run, it also carries the dimensions the
     * source image was loaded at.
     * @gir-type Struct
     * @since 1.2.0
     */
    class ImageSource {
        static $gtype: GObject.GType<ImageSource>;

        // Constructors
        constructor(data: GLib.Bytes | Uint8Array);

        static ["new"](data: GLib.Bytes | Uint8Array): ImageSource;

        // Methods
        /**
         * Create a copy of an {@link AppStreamCompose.ImageSource}, including any result data
         * it may already carry.
         * @returns a new {@link AppStreamCompose.ImageSource}
         * @since 1.2.0
         */
        copy(): ImageSource;

        /**
         * Free an {@link AppStreamCompose.ImageSource}. Bindings must not call this: they own the boxed value and
         * release it themselves, so freeing it here would free it twice.
         * @since 1.2.0
         */
        free(): void;

        /**
         * Get the raw image data this source was created for.
         * @returns The image data.
         * @since 1.2.0
         */
        get_data(): GLib.Bytes;

        /**
         * Get the height the source image was loaded at. Only valid after the media
         * operation this source was passed to has completed successfully.
         * @returns The source height in pixels, or 0 if it is not known yet.
         * @since 1.2.0
         */
        get_height(): number;

        /**
         * Get the size vector graphics are rendered at.
         * @since 1.2.0
         */
        get_render_size(): [number, number];

        /**
         * Get the width the source image was loaded at. Only valid after the media
         * operation this source was passed to has completed successfully.
         * @returns The source width in pixels, or 0 if it is not known yet.
         * @since 1.2.0
         */
        get_width(): number;

        /**
         * Set the size vector graphics should be rendered at. This has no effect
         * on raster images, which are always loaded at their native size.
         * @param width Width to render at, or 0 for the native size.
         * @param height Height to render at, or 0 for the native size.
         * @since 1.2.0
         */
        set_render_size(width: number, height: number): void;
    }


    /**
     * Describes one requested output rendition of a media operation, and carries
     * its result data after the operation was run. Renditions that were skipped
     * due to one of their source-size conditions are not an error: the operation
     * still succeeds, and %asc_image_target_get_skipped will return `true`.
     * @gir-type Struct
     * @since 1.2.0
     */
    class ImageTarget {
        static $gtype: GObject.GType<ImageTarget>;

        // Constructors
        constructor(name: string, scale_mode: ImageScaleMode, width: number, height: number);

        static ["new"](name: string, scale_mode: ImageScaleMode, width: number, height: number): ImageTarget;

        // Methods
        /**
         * Create a deep copy of an {@link AppStreamCompose.ImageTarget}, including any result data
         * it may already carry.
         * @returns a new {@link AppStreamCompose.ImageTarget}
         * @since 1.2.0
         */
        copy(): ImageTarget;

        /**
         * Free an {@link AppStreamCompose.ImageTarget}. Bindings must not call this: they own the boxed value and
         * release it themselves, so freeing it here would free it twice.
         * @since 1.2.0
         */
        free(): void;

        /**
         * Get the error message in case creating this particular rendition failed.
         * A failed rendition does not fail the media operation as a whole.
         * @returns The error message, or `null` if this rendition was fine.
         * @since 1.2.0
         */
        get_error_message(): string | null;

        /**
         * Get the requested height of this rendition. Depending on the scale mode,
         * this may differ from the height the rendition is actually stored at.
         * @returns The requested height in pixels.
         * @since 1.2.0
         */
        get_height(): number;

        /**
         * Get the filename this rendition is stored as.
         * @returns The rendition filename.
         * @since 1.2.0
         */
        get_name(): string;

        /**
         * Get whether this rendition should be skipped rather than
         * considering to upscale it to the target size(s).
         * @returns `true` if the rendition is never upscaled.
         * @since 1.2.0
         */
        get_only_downscale(): boolean;

        /**
         * Get the actual height of the stored rendition.
         * @returns The rendition height in pixels, or 0 if it was not stored.
         * @since 1.2.0
         */
        get_result_height(): number;

        /**
         * Get the actual width of the stored rendition.
         * @returns The rendition width in pixels, or 0 if it was not stored.
         * @since 1.2.0
         */
        get_result_width(): number;

        /**
         * Get the flags used when storing this rendition.
         * @returns the {@link AppStreamCompose.ImageSaveFlags} in use.
         * @since 1.2.0
         */
        get_save_flags(): ImageSaveFlags;

        /**
         * Get the scaling mode this rendition is created with.
         * @returns an {@link AppStreamCompose.ImageScaleMode}
         * @since 1.2.0
         */
        get_scale_mode(): ImageScaleMode;

        /**
         * Check whether this rendition was skipped because the source image did not
         * satisfy its source-size conditions. Only valid after the media operation
         * this target was passed to has completed successfully.
         * @returns `true` if no file was written for this rendition.
         * @since 1.2.0
         */
        get_skipped(): boolean;

        /**
         * Get the source image dimensions this rendition is restricted to.
         * A value of 0 means that the respective dimension is not limited.
         * @since 1.2.0
         */
        get_source_size_range(): [number, number, number, number];

        /**
         * Get the requested width of this rendition. Depending on the scale mode,
         * this may differ from the width the rendition is actually stored at.
         * @returns The requested width in pixels.
         * @since 1.2.0
         */
        get_width(): number;

        /**
         * Set whether this rendition should be skipped in case creating it would
         * mean upscaling the source image.
         * @param only_downscale `true` to never upscale.
         * @since 1.2.0
         */
        set_only_downscale(only_downscale: boolean): void;

        /**
         * Set the flags used when storing this rendition.
         * @param flags the {@link AppStreamCompose.ImageSaveFlags} to use.
         * @since 1.2.0
         */
        set_save_flags(flags: ImageSaveFlags): void;

        /**
         * Restrict the source images this rendition is created for. If the source
         * image's dimensions fall outside of the given range, the rendition is
         * skipped and no file is written for it, while the media operation as a
         * whole still succeeds.
         * @param min_width Minimum source image width, or 0 for no limit.
         * @param min_height Minimum source image height, or 0 for no limit.
         * @param max_width Maximum source image width, or 0 for no limit.
         * @param max_height Maximum source image height, or 0 for no limit.
         * @since 1.2.0
         */
        set_source_size_range(min_width: number, min_height: number, max_width: number, max_height: number): void;
    }


    /**
     * @gir-type Alias
     */
    type MediaClass = typeof Media;

    /**
     * @gir-type Alias
     */
    type ResultClass = typeof Result;

    /**
     * @gir-type Alias
     */
    type UnitClass = typeof Unit;

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

export default AppStreamCompose;

}

declare module 'gi://AppStreamCompose' {
    import AppStreamCompose10 from 'gi://AppStreamCompose?version=1.0';
    export default AppStreamCompose10;
}
// END
