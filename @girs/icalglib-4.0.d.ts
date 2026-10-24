/// <reference path="./gobject-2.0.d.ts" />
/// <reference path="./glib-2.0.d.ts" />

/**
 * Type Definitions for Gjs (https://gjs.guide/)
 *
 * These type definitions are automatically generated, do not edit them by hand.
 * If you found a bug fix it in `ts-for-gir` or create a bug report on https://github.com/gjsify/ts-for-gir
 *
 * The based EJS template file is used for the generated .d.ts file of each GIR module like Gtk-4.0, GObject-2.0, ...
 */

declare module 'gi://ICalGLib?version=4.0' {

// Module dependencies
import type GObject from 'gi://GObject?version=2.0';
import type GLib from 'gi://GLib?version=2.0';

export namespace ICalGLib {

    /**
     * ICalGLib-4.0
     */


    /**
     * @gir-type Enum
     */
    enum ComponentKind {
        NO_COMPONENT = 0,
        ANY_COMPONENT = 1,
        XROOT_COMPONENT = 2,
        XATTACH_COMPONENT = 3,
        VEVENT_COMPONENT = 4,
        VTODO_COMPONENT = 5,
        VJOURNAL_COMPONENT = 6,
        VCALENDAR_COMPONENT = 7,
        VAGENDA_COMPONENT = 8,
        VFREEBUSY_COMPONENT = 9,
        VALARM_COMPONENT = 10,
        XAUDIOALARM_COMPONENT = 11,
        XDISPLAYALARM_COMPONENT = 12,
        XEMAILALARM_COMPONENT = 13,
        XPROCEDUREALARM_COMPONENT = 14,
        VTIMEZONE_COMPONENT = 15,
        XSTANDARD_COMPONENT = 16,
        XDAYLIGHT_COMPONENT = 17,
        X_COMPONENT = 18,
        VSCHEDULE_COMPONENT = 19,
        VQUERY_COMPONENT = 20,
        VREPLY_COMPONENT = 21,
        VCAR_COMPONENT = 22,
        VCOMMAND_COMPONENT = 23,
        XLICINVALID_COMPONENT = 24,
        XLICMIMEPART_COMPONENT = 25,
        VAVAILABILITY_COMPONENT = 26,
        XAVAILABLE_COMPONENT = 27,
        VPOLL_COMPONENT = 28,
        VVOTER_COMPONENT = 29,
        XVOTE_COMPONENT = 30,
        VPATCH_COMPONENT = 31,
        XPATCH_COMPONENT = 32,
        PARTICIPANT_COMPONENT = 33,
        VLOCATION_COMPONENT = 34,
        VRESOURCE_COMPONENT = 35,
        IANA_COMPONENT = 36,
        NUM_COMPONENT_TYPES = 37,
    }


    /**
     * @gir-type Enum
     */
    enum ErrorEnum {
        NO_ERROR = 0,
        BADARG_ERROR = 1,
        NEWFAILED_ERROR = 2,
        ALLOCATION_ERROR = 3,
        THREADING_ERROR = 4,
        MALFORMEDDATA_ERROR = 5,
        PARSE_ERROR = 6,
        INTERNAL_ERROR = 7,
        FILE_ERROR = 8,
        USAGE_ERROR = 9,
        UNIMPLEMENTED_ERROR = 10,
        UNKNOWN_ERROR = 11,
    }


    /**
     * @gir-type Enum
     */
    enum ErrorState {
        FATAL = 0,
        NONFATAL = 1,
        DEFAULT = 2,
        UNKNOWN = 3,
    }


    /**
     * @gir-type Enum
     */
    enum InvalidRruleHandling {
        TREAT_AS_ERROR = 0,
        IGNORE_INVALID = 1,
    }


    /**
     * The types of limits
     * @gir-type Enum
     */
    enum LimitsKind {
        PARSE_FAILURES = 0,
        PARSE_SEARCH = 1,
        PARSE_FAILURE_ERROR_MESSAGES = 2,
        PROPERTIES = 3,
        PARAMETERS = 4,
        VALUE_CHARS = 5,
        PROPERTY_VALUES = 6,
        RECURRENCE_SEARCH = 7,
        RECURRENCE_TIME_STANDING_STILL = 8,
        RRULE_SEARCH = 9,
    }


    /**
     * @gir-type Enum
     */
    enum ParameterAction {
        X = 20000,
        ASK = 20001,
        ABORT = 20002,
        NONE = 20099,
    }


    /**
     * @gir-type Enum
     */
    enum ParameterCutype {
        X = 20100,
        INDIVIDUAL = 20101,
        GROUP = 20102,
        RESOURCE = 20103,
        ROOM = 20104,
        UNKNOWN = 20105,
        NONE = 20199,
    }


    /**
     * @gir-type Enum
     */
    enum ParameterDerived {
        X = 22300,
        TRUE = 22301,
        FALSE = 22302,
        NONE = 22399,
    }


    /**
     * @gir-type Enum
     */
    enum ParameterDisplay {
        X = 22000,
        BADGE = 22001,
        GRAPHIC = 22002,
        FULLSIZE = 22003,
        THUMBNAIL = 22004,
        NONE = 22099,
    }


    /**
     * @gir-type Enum
     */
    enum ParameterEnable {
        X = 20200,
        TRUE = 20201,
        FALSE = 20202,
        NONE = 20299,
    }


    /**
     * @gir-type Enum
     */
    enum ParameterEncoding {
        X = 20300,
        "8BIT" = 20301,
        BASE64 = 20302,
        NONE = 20399,
    }


    /**
     * @gir-type Enum
     */
    enum ParameterFbtype {
        X = 20400,
        FREE = 20401,
        BUSY = 20402,
        BUSYUNAVAILABLE = 20403,
        BUSYTENTATIVE = 20404,
        NONE = 20499,
    }


    /**
     * @gir-type Enum
     */
    enum ParameterFeature {
        X = 22100,
        AUDIO = 22101,
        CHAT = 22102,
        FEED = 22103,
        MODERATOR = 22104,
        PHONE = 22105,
        SCREEN = 22106,
        VIDEO = 22107,
        NONE = 22199,
    }


    /**
     * @gir-type Enum
     */
    enum ParameterKind {
        ANY_PARAMETER = 0,
        ACTIONPARAM_PARAMETER = 1,
        ALTREP_PARAMETER = 2,
        CHARSET_PARAMETER = 3,
        CN_PARAMETER = 4,
        CUTYPE_PARAMETER = 5,
        DELEGATEDFROM_PARAMETER = 6,
        DELEGATEDTO_PARAMETER = 7,
        DERIVED_PARAMETER = 54,
        DIR_PARAMETER = 8,
        DISPLAY_PARAMETER = 46,
        EMAIL_PARAMETER = 50,
        ENABLE_PARAMETER = 9,
        ENCODING_PARAMETER = 10,
        FBTYPE_PARAMETER = 11,
        FEATURE_PARAMETER = 48,
        FILENAME_PARAMETER = 42,
        FMTTYPE_PARAMETER = 12,
        GAP_PARAMETER = 55,
        IANA_PARAMETER = 33,
        ID_PARAMETER = 13,
        LABEL_PARAMETER = 49,
        LANGUAGE_PARAMETER = 14,
        LATENCY_PARAMETER = 15,
        LINKREL_PARAMETER = 56,
        LOCAL_PARAMETER = 16,
        LOCALIZE_PARAMETER = 17,
        MANAGEDID_PARAMETER = 40,
        MEMBER_PARAMETER = 18,
        MODIFIED_PARAMETER = 44,
        OPTIONS_PARAMETER = 19,
        ORDER_PARAMETER = 52,
        PARTSTAT_PARAMETER = 20,
        PATCHACTION_PARAMETER = 51,
        PUBLICCOMMENT_PARAMETER = 37,
        RANGE_PARAMETER = 21,
        REASON_PARAMETER = 47,
        RELATED_PARAMETER = 22,
        RELTYPE_PARAMETER = 23,
        REQUIRED_PARAMETER = 43,
        RESPONSE_PARAMETER = 38,
        ROLE_PARAMETER = 24,
        RSVP_PARAMETER = 25,
        SCHEDULEAGENT_PARAMETER = 34,
        SCHEDULEFORCESEND_PARAMETER = 35,
        SCHEDULESTATUS_PARAMETER = 36,
        SCHEMA_PARAMETER = 53,
        SENTBY_PARAMETER = 26,
        SIZE_PARAMETER = 41,
        STAYINFORMED_PARAMETER = 39,
        SUBSTATE_PARAMETER = 45,
        TZID_PARAMETER = 27,
        VALUE_PARAMETER = 28,
        X_PARAMETER = 29,
        XLICCOMPARETYPE_PARAMETER = 30,
        XLICERRORTYPE_PARAMETER = 31,
        NO_PARAMETER = 32,
    }


    /**
     * @gir-type Enum
     */
    enum ParameterLocal {
        X = 20500,
        TRUE = 20501,
        FALSE = 20502,
        NONE = 20599,
    }


    /**
     * @gir-type Enum
     */
    enum ParameterPartstat {
        X = 20600,
        NEEDSACTION = 20601,
        ACCEPTED = 20602,
        DECLINED = 20603,
        TENTATIVE = 20604,
        DELEGATED = 20605,
        COMPLETED = 20606,
        INPROCESS = 20607,
        FAILED = 20608,
        NONE = 20699,
    }


    /**
     * @gir-type Enum
     */
    enum ParameterPatchaction {
        X = 22200,
        CREATE = 22201,
        BYNAME = 22202,
        BYVALUE = 22203,
        BYPARAM = 22204,
        NONE = 22299,
    }


    /**
     * @gir-type Enum
     */
    enum ParameterRange {
        X = 20700,
        THISANDPRIOR = 20701,
        THISANDFUTURE = 20702,
        NONE = 20799,
    }


    /**
     * @gir-type Enum
     */
    enum ParameterRelated {
        X = 20800,
        START = 20801,
        END = 20802,
        NONE = 20899,
    }


    /**
     * @gir-type Enum
     */
    enum ParameterReltype {
        X = 20900,
        PARENT = 20901,
        CHILD = 20902,
        SIBLING = 20903,
        POLL = 20904,
        SNOOZE = 20905,
        CONCEPT = 20906,
        DEPENDSON = 20907,
        FINISHTOFINISH = 20908,
        FINISHTOSTART = 20909,
        FIRST = 20910,
        NEXT = 20911,
        REFID = 20912,
        STARTTOFINISH = 20913,
        STARTTOSTART = 20914,
        NONE = 20999,
    }


    /**
     * @gir-type Enum
     */
    enum ParameterRequired {
        X = 21000,
        TRUE = 21001,
        FALSE = 21002,
        NONE = 21099,
    }


    /**
     * @gir-type Enum
     */
    enum ParameterRole {
        X = 21100,
        CHAIR = 21101,
        REQPARTICIPANT = 21102,
        OPTPARTICIPANT = 21103,
        NONPARTICIPANT = 21104,
        NONE = 21199,
    }


    /**
     * @gir-type Enum
     */
    enum ParameterRsvp {
        X = 21200,
        TRUE = 21201,
        FALSE = 21202,
        NONE = 21299,
    }


    /**
     * @gir-type Enum
     */
    enum ParameterScheduleagent {
        X = 21300,
        SERVER = 21301,
        CLIENT = 21302,
        NONE = 21399,
    }


    /**
     * @gir-type Enum
     */
    enum ParameterScheduleforcesend {
        X = 21400,
        REQUEST = 21401,
        REPLY = 21402,
        NONE = 21499,
    }


    /**
     * @gir-type Enum
     */
    enum ParameterStayinformed {
        X = 21500,
        TRUE = 21501,
        FALSE = 21502,
        NONE = 21599,
    }


    /**
     * @gir-type Enum
     */
    enum ParameterSubstate {
        X = 21900,
        OK = 21901,
        ERROR = 21902,
        SUSPENDED = 21903,
        NONE = 21999,
    }


    /**
     * @gir-type Enum
     */
    enum ParameterValue {
        X = 21600,
        BINARY = 21601,
        BOOLEAN = 21602,
        DATE = 21603,
        DURATION = 21604,
        FLOAT = 21605,
        INTEGER = 21606,
        PERIOD = 21607,
        RECUR = 21608,
        TEXT = 21609,
        URI = 21610,
        ERROR = 21611,
        DATETIME = 21612,
        UTCOFFSET = 21613,
        CALADDRESS = 21614,
        UID = 21615,
        XMLREFERENCE = 21616,
        NONE = 21699,
    }


    /**
     * @gir-type Enum
     */
    enum ParameterXliccomparetype {
        X = 21700,
        EQUAL = 21701,
        NOTEQUAL = 21702,
        LESS = 21703,
        GREATER = 21704,
        LESSEQUAL = 21705,
        GREATEREQUAL = 21706,
        REGEX = 21707,
        ISNULL = 21708,
        ISNOTNULL = 21709,
        NONE = 21799,
    }


    /**
     * @gir-type Enum
     */
    enum ParameterXlicerrortype {
        X = 21800,
        COMPONENTPARSEERROR = 21801,
        PROPERTYPARSEERROR = 21802,
        PARAMETERNAMEPARSEERROR = 21803,
        PARAMETERVALUEPARSEERROR = 21804,
        VALUEPARSEERROR = 21805,
        INVALIDITIP = 21806,
        UNKNOWNVCALPROPERROR = 21807,
        MIMEPARSEERROR = 21808,
        VCALPROPPARSEERROR = 21809,
        NONE = 21899,
    }


    /**
     * @gir-type Enum
     */
    enum ParserCtrl {
        KEEP = 0,
        OMIT = 1,
        ERROR = 2,
    }


    /**
     * @gir-type Enum
     */
    enum ParserState {
        ERROR = 0,
        SUCCESS = 1,
        BEGIN_COMP = 2,
        END_COMP = 3,
        IN_PROGRESS = 4,
    }


    /**
     * @gir-type Enum
     */
    enum PropertyAction {
        X = 10000,
        AUDIO = 10001,
        DISPLAY = 10002,
        EMAIL = 10003,
        PROCEDURE = 10004,
        NONE = 10099,
    }


    /**
     * @gir-type Enum
     */
    enum PropertyBusytype {
        X = 10100,
        BUSY = 10101,
        BUSYUNAVAILABLE = 10102,
        BUSYTENTATIVE = 10103,
        NONE = 10199,
    }


    /**
     * @gir-type Enum
     */
    enum PropertyCarlevel {
        X = 10200,
        CARNONE = 10201,
        CARMIN = 10202,
        CARFULL1 = 10203,
        NONE = 10299,
    }


    /**
     * @gir-type Enum
     */
    enum PropertyClassenum {
        X = 10300,
        PUBLIC = 10301,
        PRIVATE = 10302,
        CONFIDENTIAL = 10303,
        NONE = 10399,
    }


    /**
     * @gir-type Enum
     */
    enum PropertyCmd {
        X = 10400,
        ABORT = 10401,
        CONTINUE = 10402,
        CREATE = 10403,
        DELETE = 10404,
        GENERATEUID = 10405,
        GETCAPABILITY = 10406,
        IDENTIFY = 10407,
        MODIFY = 10408,
        MOVE = 10409,
        REPLY = 10410,
        SEARCH = 10411,
        SETLOCALE = 10412,
        NONE = 10499,
    }


    /**
     * @gir-type Enum
     */
    enum PropertyKind {
        ANY_PROPERTY = 0,
        ACCEPTRESPONSE_PROPERTY = 102,
        ACKNOWLEDGED_PROPERTY = 1,
        ACTION_PROPERTY = 2,
        ALLOWCONFLICT_PROPERTY = 3,
        ATTACH_PROPERTY = 4,
        ATTENDEE_PROPERTY = 5,
        BUSYTYPE_PROPERTY = 101,
        CALENDARADDRESS_PROPERTY = 130,
        CALID_PROPERTY = 6,
        CALMASTER_PROPERTY = 7,
        CALSCALE_PROPERTY = 8,
        CAPVERSION_PROPERTY = 9,
        CARLEVEL_PROPERTY = 10,
        CARID_PROPERTY = 11,
        CATEGORIES_PROPERTY = 12,
        CLASS_PROPERTY = 13,
        CMD_PROPERTY = 14,
        COLOR_PROPERTY = 118,
        COMMENT_PROPERTY = 15,
        COMPLETED_PROPERTY = 16,
        COMPONENTS_PROPERTY = 17,
        CONFERENCE_PROPERTY = 120,
        CONCEPT_PROPERTY = 133,
        CONTACT_PROPERTY = 18,
        CREATED_PROPERTY = 19,
        CSID_PROPERTY = 20,
        DATEMAX_PROPERTY = 21,
        DATEMIN_PROPERTY = 22,
        DECREED_PROPERTY = 23,
        DEFAULTCHARSET_PROPERTY = 24,
        DEFAULTLOCALE_PROPERTY = 25,
        DEFAULTTZID_PROPERTY = 26,
        DEFAULTVCARS_PROPERTY = 27,
        DENY_PROPERTY = 28,
        DESCRIPTION_PROPERTY = 29,
        DTEND_PROPERTY = 30,
        DTSTAMP_PROPERTY = 31,
        DTSTART_PROPERTY = 32,
        DUE_PROPERTY = 33,
        DURATION_PROPERTY = 34,
        ESTIMATEDDURATION_PROPERTY = 113,
        EXDATE_PROPERTY = 35,
        EXPAND_PROPERTY = 36,
        EXRULE_PROPERTY = 37,
        FREEBUSY_PROPERTY = 38,
        GEO_PROPERTY = 39,
        GRANT_PROPERTY = 40,
        IMAGE_PROPERTY = 119,
        ITIPVERSION_PROPERTY = 41,
        LASTMODIFIED_PROPERTY = 42,
        LINK_PROPERTY = 134,
        LOCATION_PROPERTY = 43,
        LOCATIONTYPE_PROPERTY = 127,
        MAXCOMPONENTSIZE_PROPERTY = 44,
        MAXDATE_PROPERTY = 45,
        MAXRESULTS_PROPERTY = 46,
        MAXRESULTSSIZE_PROPERTY = 47,
        METHOD_PROPERTY = 48,
        MINDATE_PROPERTY = 49,
        MULTIPART_PROPERTY = 50,
        NAME_PROPERTY = 115,
        ORGANIZER_PROPERTY = 52,
        OWNER_PROPERTY = 53,
        PARTICIPANTTYPE_PROPERTY = 128,
        PATCHDELETE_PROPERTY = 124,
        PATCHORDER_PROPERTY = 122,
        PATCHPARAMETER_PROPERTY = 125,
        PATCHTARGET_PROPERTY = 123,
        PATCHVERSION_PROPERTY = 121,
        PERCENTCOMPLETE_PROPERTY = 54,
        PERMISSION_PROPERTY = 55,
        POLLCOMPLETION_PROPERTY = 110,
        POLLITEMID_PROPERTY = 103,
        POLLMODE_PROPERTY = 104,
        POLLPROPERTIES_PROPERTY = 105,
        POLLWINNER_PROPERTY = 106,
        PRIORITY_PROPERTY = 56,
        PRODID_PROPERTY = 57,
        PROXIMITY_PROPERTY = 126,
        QUERY_PROPERTY = 58,
        QUERYLEVEL_PROPERTY = 59,
        QUERYID_PROPERTY = 60,
        QUERYNAME_PROPERTY = 61,
        RDATE_PROPERTY = 62,
        RECURACCEPTED_PROPERTY = 63,
        RECUREXPAND_PROPERTY = 64,
        RECURLIMIT_PROPERTY = 65,
        RECURRENCEID_PROPERTY = 66,
        REFRESHINTERVAL_PROPERTY = 116,
        REFID_PROPERTY = 135,
        RELATEDTO_PROPERTY = 67,
        RELCALID_PROPERTY = 68,
        REPEAT_PROPERTY = 69,
        REPLYURL_PROPERTY = 111,
        REQUESTSTATUS_PROPERTY = 70,
        RESOURCES_PROPERTY = 71,
        RESOURCETYPE_PROPERTY = 129,
        RESPONSE_PROPERTY = 112,
        RESTRICTION_PROPERTY = 72,
        RRULE_PROPERTY = 73,
        SCOPE_PROPERTY = 74,
        SEQUENCE_PROPERTY = 75,
        SOURCE_PROPERTY = 117,
        STATUS_PROPERTY = 76,
        STORESEXPANDED_PROPERTY = 77,
        STRUCTUREDDATA_PROPERTY = 132,
        STYLEDDESCRIPTION_PROPERTY = 131,
        SUMMARY_PROPERTY = 78,
        TARGET_PROPERTY = 79,
        TASKMODE_PROPERTY = 114,
        TRANSP_PROPERTY = 80,
        TRIGGER_PROPERTY = 81,
        TZID_PROPERTY = 82,
        TZIDALIASOF_PROPERTY = 108,
        TZNAME_PROPERTY = 83,
        TZOFFSETFROM_PROPERTY = 84,
        TZOFFSETTO_PROPERTY = 85,
        TZUNTIL_PROPERTY = 109,
        TZURL_PROPERTY = 86,
        UID_PROPERTY = 87,
        URL_PROPERTY = 88,
        VERSION_PROPERTY = 89,
        VOTER_PROPERTY = 107,
        X_PROPERTY = 90,
        XLICCLASS_PROPERTY = 91,
        XLICCLUSTERCOUNT_PROPERTY = 92,
        XLICERROR_PROPERTY = 93,
        XLICMIMECHARSET_PROPERTY = 94,
        XLICMIMECID_PROPERTY = 95,
        XLICMIMECONTENTTYPE_PROPERTY = 96,
        XLICMIMEENCODING_PROPERTY = 97,
        XLICMIMEFILENAME_PROPERTY = 98,
        XLICMIMEOPTINFO_PROPERTY = 99,
        IANA_PROPERTY = 136,
        NO_PROPERTY = 100,
    }


    /**
     * @gir-type Enum
     */
    enum PropertyMethod {
        X = 10500,
        PUBLISH = 10501,
        REQUEST = 10502,
        REPLY = 10503,
        ADD = 10504,
        CANCEL = 10505,
        REFRESH = 10506,
        COUNTER = 10507,
        DECLINECOUNTER = 10508,
        CREATE = 10509,
        READ = 10510,
        RESPONSE = 10511,
        MOVE = 10512,
        MODIFY = 10513,
        GENERATEUID = 10514,
        DELETE = 10515,
        POLLSTATUS = 10516,
        NONE = 10599,
    }


    /**
     * @gir-type Enum
     */
    enum PropertyParticipanttype {
        X = 11400,
        ACTIVE = 11401,
        INACTIVE = 11402,
        SPONSOR = 11403,
        CONTACT = 11404,
        BOOKINGCONTACT = 11405,
        EMERGENCYCONTACT = 11406,
        PUBLICITYCONTACT = 11407,
        PLANNERCONTACT = 11408,
        PERFORMER = 11409,
        SPEAKER = 11410,
        VOTER = 11411,
        NONE = 11499,
    }


    /**
     * @gir-type Enum
     */
    enum PropertyPollcompletion {
        X = 10600,
        SERVER = 10601,
        SERVERSUBMIT = 10602,
        SERVERCHOICE = 10603,
        CLIENT = 10604,
        NONE = 10699,
    }


    /**
     * @gir-type Enum
     */
    enum PropertyPollmode {
        X = 10700,
        BASIC = 10701,
        NONE = 10799,
    }


    /**
     * @gir-type Enum
     */
    enum PropertyProximity {
        X = 11300,
        ARRIVE = 11301,
        DEPART = 11302,
        CONNECT = 11303,
        DISCONNECT = 11304,
        NONE = 11399,
    }


    /**
     * @gir-type Enum
     */
    enum PropertyQuerylevel {
        X = 10800,
        CALQL1 = 10801,
        CALQLNONE = 10802,
        NONE = 10899,
    }


    /**
     * @gir-type Enum
     */
    enum PropertyResourcetype {
        X = 11500,
        ROOM = 11501,
        PROJECTOR = 11502,
        REMOTECONFERENCEAUDIO = 11503,
        REMOTECONFERENCEVIDEO = 11504,
        NONE = 11599,
    }


    /**
     * @gir-type Enum
     */
    enum PropertyStatus {
        X = 10900,
        TENTATIVE = 10901,
        CONFIRMED = 10902,
        COMPLETED = 10903,
        NEEDSACTION = 10904,
        CANCELLED = 10905,
        INPROCESS = 10906,
        DRAFT = 10907,
        FINAL = 10908,
        SUBMITTED = 10909,
        PENDING = 10910,
        FAILED = 10911,
        DELETED = 10912,
        NONE = 10999,
    }


    /**
     * @gir-type Enum
     */
    enum PropertyTaskmode {
        X = 11200,
        AUTOMATICCOMPLETION = 11201,
        AUTOMATICFAILURE = 11202,
        AUTOMATICSTATUS = 11203,
        NONE = 11299,
    }


    /**
     * @gir-type Enum
     */
    enum PropertyTransp {
        X = 11000,
        OPAQUE = 11001,
        OPAQUENOCONFLICT = 11002,
        TRANSPARENT = 11003,
        TRANSPARENTNOCONFLICT = 11004,
        NONE = 11099,
    }


    /**
     * @gir-type Enum
     */
    enum PropertyXlicclass {
        X = 11100,
        PUBLISHNEW = 11101,
        PUBLISHUPDATE = 11102,
        PUBLISHFREEBUSY = 11103,
        REQUESTNEW = 11104,
        REQUESTUPDATE = 11105,
        REQUESTRESCHEDULE = 11106,
        REQUESTDELEGATE = 11107,
        REQUESTNEWORGANIZER = 11108,
        REQUESTFORWARD = 11109,
        REQUESTSTATUS = 11110,
        REQUESTFREEBUSY = 11111,
        REPLYACCEPT = 11112,
        REPLYDECLINE = 11113,
        REPLYDELEGATE = 11114,
        REPLYCRASHERACCEPT = 11115,
        REPLYCRASHERDECLINE = 11116,
        ADDINSTANCE = 11117,
        CANCELEVENT = 11118,
        CANCELINSTANCE = 11119,
        CANCELALL = 11120,
        REFRESH = 11121,
        COUNTER = 11122,
        DECLINECOUNTER = 11123,
        MALFORMED = 11124,
        OBSOLETE = 11125,
        MISSEQUENCED = 11126,
        UNKNOWN = 11127,
        NONE = 11199,
    }


    /**
     * @gir-type Enum
     */
    enum RecurrenceArraySizes {
        SECOND_SIZE = 62,
        MINUTE_SIZE = 61,
        HOUR_SIZE = 25,
        MONTH_SIZE = 14,
        MONTHDAY_SIZE = 32,
        WEEKNO_SIZE = 56,
        YEARDAY_SIZE = 386,
        SETPOS_SIZE = 386,
        DAY_SIZE = 386,
    }


    /**
     * @gir-type Enum
     */
    enum RecurrenceByRule {
        BYRULE_NO_CONTRACTION = -1,
        BY_MONTH = 0,
        BY_WEEK_NO = 1,
        BY_YEAR_DAY = 2,
        BY_MONTH_DAY = 3,
        BY_DAY = 4,
        BY_HOUR = 5,
        BY_MINUTE = 6,
        BY_SECOND = 7,
        BY_SET_POS = 8,
        BY_NUM_PARTS = 9,
    }


    /**
     * @gir-type Enum
     */
    enum RecurrenceFrequency {
        SECONDLY_RECURRENCE = 0,
        MINUTELY_RECURRENCE = 1,
        HOURLY_RECURRENCE = 2,
        DAILY_RECURRENCE = 3,
        WEEKLY_RECURRENCE = 4,
        MONTHLY_RECURRENCE = 5,
        YEARLY_RECURRENCE = 6,
        NO_RECURRENCE = 7,
    }


    /**
     * @gir-type Enum
     */
    enum RecurrenceSkip {
        BACKWARD = 0,
        FORWARD = 1,
        OMIT = 2,
        UNDEFINED = 3,
    }


    /**
     * @gir-type Enum
     */
    enum RecurrenceWeekday {
        NO_WEEKDAY = 0,
        SUNDAY_WEEKDAY = 1,
        MONDAY_WEEKDAY = 2,
        TUESDAY_WEEKDAY = 3,
        WEDNESDAY_WEEKDAY = 4,
        THURSDAY_WEEKDAY = 5,
        FRIDAY_WEEKDAY = 6,
        SATURDAY_WEEKDAY = 7,
    }


    /**
     * @gir-type Enum
     */
    enum RequestStatus {
        UNKNOWN_STATUS = 0,
        "2_0_SUCCESS_STATUS" = 1,
        "2_1_FALLBACK_STATUS" = 2,
        "2_2_IGPROP_STATUS" = 3,
        "2_3_IGPARAM_STATUS" = 4,
        "2_4_IGXPROP_STATUS" = 5,
        "2_5_IGXPARAM_STATUS" = 6,
        "2_6_IGCOMP_STATUS" = 7,
        "2_7_FORWARD_STATUS" = 8,
        "2_8_ONEEVENT_STATUS" = 9,
        "2_9_TRUNC_STATUS" = 10,
        "2_10_ONETODO_STATUS" = 11,
        "2_11_TRUNCRRULE_STATUS" = 12,
        "3_0_INVPROPNAME_STATUS" = 13,
        "3_1_INVPROPVAL_STATUS" = 14,
        "3_2_INVPARAM_STATUS" = 15,
        "3_3_INVPARAMVAL_STATUS" = 16,
        "3_4_INVCOMP_STATUS" = 17,
        "3_5_INVTIME_STATUS" = 18,
        "3_6_INVRULE_STATUS" = 19,
        "3_7_INVCU_STATUS" = 20,
        "3_8_NOAUTH_STATUS" = 21,
        "3_9_BADVERSION_STATUS" = 22,
        "3_10_TOOBIG_STATUS" = 23,
        "3_11_MISSREQCOMP_STATUS" = 24,
        "3_12_UNKCOMP_STATUS" = 25,
        "3_13_BADCOMP_STATUS" = 26,
        "3_14_NOCAP_STATUS" = 27,
        "3_15_INVCOMMAND" = 28,
        "4_0_BUSY_STATUS" = 29,
        "4_1_STORE_ACCESS_DENIED" = 30,
        "4_2_STORE_FAILED" = 31,
        "4_3_STORE_NOT_FOUND" = 32,
        "5_0_MAYBE_STATUS" = 33,
        "5_1_UNAVAIL_STATUS" = 34,
        "5_2_NOSERVICE_STATUS" = 35,
        "5_3_NOSCHED_STATUS" = 36,
        "6_1_CONTAINER_NOT_FOUND" = 37,
        "9_0_UNRECOGNIZED_COMMAND" = 38,
    }


    /**
     * @gir-type Enum
     */
    enum RestrictionKind {
        NONE = 0,
        ZERO = 1,
        ONE = 2,
        ZEROPLUS = 3,
        ONEPLUS = 4,
        ZEROORONE = 5,
        ONEEXCLUSIVE = 6,
        ONEMUTUAL = 7,
        UNKNOWN = 8,
    }


    /**
     * @gir-type Enum
     */
    enum Unknowntokenhandling {
        ASSUME_IANA_TOKEN = 1,
        DISCARD_TOKEN = 2,
        TREAT_AS_ERROR = 3,
    }


    /**
     * @gir-type Enum
     */
    enum ValueKind {
        ANY_VALUE = 5000,
        ACTION_VALUE = 5027,
        ATTACH_VALUE = 5003,
        BINARY_VALUE = 5011,
        BOOLEAN_VALUE = 5021,
        BUSYTYPE_VALUE = 5032,
        CALADDRESS_VALUE = 5023,
        CARLEVEL_VALUE = 5016,
        COLOR_VALUE = 5044,
        CLASS_VALUE = 5019,
        CMD_VALUE = 5010,
        DATE_VALUE = 5002,
        DATETIME_VALUE = 5028,
        DATETIMEDATE_VALUE = 5036,
        DATETIMEPERIOD_VALUE = 5015,
        DURATION_VALUE = 5020,
        FLOAT_VALUE = 5013,
        GEO_VALUE = 5004,
        INTEGER_VALUE = 5017,
        LINK_VALUE = 5042,
        METHOD_VALUE = 5030,
        PARTICIPANTTYPE_VALUE = 5037,
        PERIOD_VALUE = 5014,
        POLLCOMPLETION_VALUE = 5034,
        POLLMODE_VALUE = 5033,
        PROXIMITY_VALUE = 5039,
        RESOURCETYPE_VALUE = 5038,
        QUERY_VALUE = 5001,
        QUERYLEVEL_VALUE = 5012,
        RECUR_VALUE = 5026,
        RELATEDTO_VALUE = 5043,
        REQUESTSTATUS_VALUE = 5009,
        STATUS_VALUE = 5005,
        STRING_VALUE = 5007,
        TASKMODE_VALUE = 5035,
        TEXT_VALUE = 5008,
        TRANSP_VALUE = 5006,
        TRIGGER_VALUE = 5024,
        UID_VALUE = 5040,
        URI_VALUE = 5018,
        UTCOFFSET_VALUE = 5029,
        XMLREFERENCE_VALUE = 5041,
        X_VALUE = 5022,
        XLICCLASS_VALUE = 5025,
        NO_VALUE = 5031,
    }


    /**
     * @gir-type Enum
     */
    enum VcardAdrField {
        ADR_PO_BOX = 0,
        ADR_EXTENDED = 1,
        ADR_STREET = 2,
        ADR_LOCALITY = 3,
        ADR_REGION = 4,
        ADR_POSTAL_CODE = 5,
        ADR_COUNTRY = 6,
        ADR_ROOM = 7,
        ADR_APARTMENT = 8,
        ADR_FLOOR = 9,
        ADR_STREET_NUMBER = 10,
        ADR_STREET_NAME = 11,
        ADR_BUILDING = 12,
        ADR_BLOCK = 13,
        ADR_SUBDISTRICT = 14,
        ADR_DISTRICT = 15,
        ADR_LANDMARK = 16,
        ADR_DIRECTION = 17,
        NUM_ADR_FIELDS = 18,
    }


    /**
     * @gir-type Enum
     */
    enum VcardClientpidmapField {
        CLIENTPIDMAP_ID = 0,
        CLIENTPIDMAP_URI = 1,
        NUM_CLIENTPIDMAP_FIELDS = 2,
    }


    /**
     * @gir-type Enum
     */
    enum VcardComponentKind {
        NO_COMPONENT = 0,
        ANY_COMPONENT = 1,
        XROOT_COMPONENT = 2,
        VCARD_COMPONENT = 3,
        NUM_COMPONENT_TYPES = 4,
    }


    /**
     * @gir-type Enum
     */
    enum VcardGenderField {
        GENDER_SEX = 0,
        GENDER_TEXT = 1,
        NUM_GENDER_FIELDS = 2,
    }


    /**
     * @gir-type Enum
     */
    enum VcardNField {
        N_FAMILY = 0,
        N_GIVEN = 1,
        N_ADDITIONAL = 2,
        N_PREFIX = 3,
        N_SUFFIX = 4,
        N_SECONDARY = 5,
        N_GENERATION = 6,
        NUM_N_FIELDS = 7,
    }


    /**
     * @gir-type Enum
     */
    enum VcardParameterCalscale {
        X = 20200,
        GREGORIAN = 20201,
        NONE = 20299,
    }


    /**
     * @gir-type Enum
     */
    enum VcardParameterDerived {
        X = 20700,
        TRUE = 20701,
        FALSE = 20702,
        NONE = 20799,
    }


    /**
     * @gir-type Enum
     */
    enum VcardParameterEncoding {
        X = 20500,
        B = 20501,
        NONE = 20599,
    }


    /**
     * @gir-type Enum
     */
    enum VcardParameterKind {
        ANY_PARAMETER = 0,
        ALTID_PARAMETER = 4,
        AUTHOR_PARAMETER = 23,
        AUTHORNAME_PARAMETER = 24,
        CALSCALE_PARAMETER = 8,
        CC_PARAMETER = 20,
        CONTEXT_PARAMETER = 17,
        CREATED_PARAMETER = 25,
        DERIVED_PARAMETER = 26,
        ENCODING_PARAMETER = 16,
        GEO_PARAMETER = 10,
        IANA_PARAMETER = 13,
        INDEX_PARAMETER = 18,
        JSCOMPS_PARAMETER = 27,
        JSPTR_PARAMETER = 21,
        LABEL_PARAMETER = 22,
        LANGUAGE_PARAMETER = 1,
        LEVEL_PARAMETER = 19,
        MEDIATYPE_PARAMETER = 7,
        PHONETIC_PARAMETER = 31,
        PID_PARAMETER = 5,
        PREF_PARAMETER = 3,
        PROPID_PARAMETER = 28,
        SCRIPT_PARAMETER = 32,
        SERVICETYPE_PARAMETER = 29,
        SORTAS_PARAMETER = 9,
        TYPE_PARAMETER = 6,
        TZ_PARAMETER = 11,
        USERNAME_PARAMETER = 30,
        VALUE_PARAMETER = 2,
        X_PARAMETER = 12,
        XLICCOMPARETYPE_PARAMETER = 15,
        XLICERRORTYPE_PARAMETER = 14,
        NO_PARAMETER = 99,
    }


    /**
     * @gir-type Enum
     */
    enum VcardParameterLevel {
        X = 20600,
        BEGINNER = 20601,
        AVERAGE = 20602,
        EXPERT = 20603,
        HIGH = 20604,
        MEDIUM = 20605,
        LOW = 20606,
        NONE = 20699,
    }


    /**
     * @gir-type Enum
     */
    enum VcardParameterPhonetic {
        X = 20800,
        IPA = 20801,
        PINY = 20802,
        JYUT = 20803,
        SCRIPT = 20804,
        NONE = 20899,
    }


    /**
     * @gir-type Enum
     */
    enum VcardParameterType {
        X = 20100,
        WORK = 20101,
        HOME = 20102,
        TEXT = 20103,
        VOICE = 20104,
        FAX = 20105,
        CELL = 20106,
        VIDEO = 20107,
        PAGER = 20108,
        TEXTPHONE = 20109,
        CONTACT = 20110,
        ACQUAINTANCE = 20111,
        FRIEND = 20112,
        MET = 20113,
        COWORKER = 20114,
        COLLEAGUE = 20115,
        CORESIDENT = 20116,
        NEIGHBOR = 20117,
        CHILD = 20118,
        PARENT = 20119,
        SIBLING = 20120,
        SPOUSE = 20121,
        KIN = 20122,
        MUSE = 20123,
        CRUSH = 20124,
        DATE = 20125,
        SWEETHEART = 20126,
        ME = 20127,
        AGENT = 20128,
        EMERGENCY = 20129,
        PREF = 20130,
        MAINNUMBER = 20131,
        BILLING = 20132,
        DELIVERY = 20133,
        NONE = 20199,
    }


    /**
     * @gir-type Enum
     */
    enum VcardParameterValue {
        X = 20000,
        TEXT = 20001,
        URI = 20002,
        DATE = 20003,
        TIME = 20004,
        DATETIME = 20005,
        DATEANDORTIME = 20006,
        TIMESTAMP = 20007,
        BOOLEAN = 20008,
        INTEGER = 20009,
        FLOAT = 20010,
        UTCOFFSET = 20011,
        LANGUAGETAG = 20012,
        STRUCTURED = 20013,
        NONE = 20099,
    }


    /**
     * @gir-type Enum
     */
    enum VcardParameterXliccomparetype {
        X = 20400,
        EQUAL = 20401,
        NOTEQUAL = 20402,
        LESS = 20403,
        GREATER = 20404,
        LESSEQUAL = 20405,
        GREATEREQUAL = 20406,
        REGEX = 20407,
        ISNULL = 20408,
        ISNOTNULL = 20409,
        NONE = 20499,
    }


    /**
     * @gir-type Enum
     */
    enum VcardParameterXlicerrortype {
        X = 20300,
        COMPONENTPARSEERROR = 20301,
        PROPERTYPARSEERROR = 20302,
        PARAMETERNAMEPARSEERROR = 20303,
        PARAMETERVALUEPARSEERROR = 20304,
        VALUEPARSEERROR = 20305,
        RESTRICTIONCHECK = 20306,
        NONE = 20399,
    }


    /**
     * @gir-type Enum
     */
    enum VcardPropertyGramgender {
        X = 10200,
        ANIMATE = 10201,
        COMMON = 10202,
        FEMININE = 10203,
        INANIMATE = 10204,
        MASCULINE = 10205,
        NEUTER = 10206,
        NONE = 10299,
    }


    /**
     * @gir-type Enum
     */
    enum VcardPropertyKind {
        ANY_PROPERTY = 0,
        ADR_PROPERTY = 11,
        AGENT_PROPERTY = 41,
        ANNIVERSARY_PROPERTY = 9,
        BDAY_PROPERTY = 8,
        BEGIN_PROPERTY = 497,
        BIRTHPLACE_PROPERTY = 44,
        CALADRURI_PROPERTY = 35,
        CALURI_PROPERTY = 36,
        CATEGORIES_PROPERTY = 24,
        CLASS_PROPERTY = 43,
        CLIENTPIDMAP_PROPERTY = 30,
        CONTACTURI_PROPERTY = 52,
        CREATED_PROPERTY = 54,
        DEATHDATE_PROPERTY = 46,
        DEATHPLACE_PROPERTY = 45,
        EMAIL_PROPERTY = 13,
        END_PROPERTY = 498,
        EXPERTISE_PROPERTY = 48,
        FBURL_PROPERTY = 34,
        FN_PROPERTY = 4,
        GENDER_PROPERTY = 10,
        GEO_PROPERTY = 17,
        GRAMGENDER_PROPERTY = 56,
        HOBBY_PROPERTY = 49,
        IMPP_PROPERTY = 14,
        INTEREST_PROPERTY = 50,
        JSPROP_PROPERTY = 53,
        KEY_PROPERTY = 33,
        KIND_PROPERTY = 2,
        LABEL_PROPERTY = 39,
        LANG_PROPERTY = 15,
        LANGUAGE_PROPERTY = 55,
        LOGO_PROPERTY = 20,
        MAILER_PROPERTY = 40,
        MEMBER_PROPERTY = 22,
        N_PROPERTY = 5,
        NAME_PROPERTY = 38,
        NICKNAME_PROPERTY = 6,
        NOTE_PROPERTY = 25,
        ORG_PROPERTY = 21,
        ORGDIRECTORY_PROPERTY = 51,
        PHOTO_PROPERTY = 7,
        PRODID_PROPERTY = 26,
        PRONOUNS_PROPERTY = 57,
        RELATED_PROPERTY = 23,
        REV_PROPERTY = 27,
        ROLE_PROPERTY = 19,
        SOCIALPROFILE_PROPERTY = 58,
        SORTSTRING_PROPERTY = 42,
        SOUND_PROPERTY = 28,
        SOURCE_PROPERTY = 1,
        TEL_PROPERTY = 12,
        TITLE_PROPERTY = 18,
        TZ_PROPERTY = 16,
        UID_PROPERTY = 29,
        URL_PROPERTY = 31,
        VERSION_PROPERTY = 32,
        X_PROPERTY = 37,
        XLICERROR_PROPERTY = 496,
        XML_PROPERTY = 3,
        NO_PROPERTY = 499,
    }


    /**
     * @gir-type Enum
     */
    enum VcardPropertyKindenum {
        X = 10000,
        INDIVIDUAL = 10001,
        GROUP = 10002,
        ORG = 10003,
        LOCATION = 10004,
        APPLICATION = 10005,
        DEVICE = 10006,
        NONE = 10099,
    }


    /**
     * @gir-type Enum
     */
    enum VcardPropertyVersion {
        X = 10100,
        V21 = 10101,
        V30 = 10102,
        V40 = 10103,
        NONE = 10199,
    }


    /**
     * @gir-type Enum
     */
    enum VcardRestrictionKind {
        NONE = 0,
        ZERO = 1,
        ONE = 2,
        ZEROPLUS = 3,
        ONEPLUS = 4,
        ZEROORONE = 5,
        ONEEXCLUSIVE = 6,
        ONEMUTUAL = 7,
        UNKNOWN = 8,
    }


    /**
     * @gir-type Enum
     */
    enum VcardTimeConvertFlags {
        BARE_TIME = 1,
        AS_V4 = 2,
    }


    /**
     * @gir-type Enum
     */
    enum VcardValueKind {
        ANY_VALUE = 5000,
        BOOLEAN_VALUE = 5008,
        DATE_VALUE = 5003,
        DATEANDORTIME_VALUE = 5006,
        DATETIME_VALUE = 5005,
        FLOAT_VALUE = 5010,
        GEO_VALUE = 5021,
        GRAMGENDER_VALUE = 5018,
        INTEGER_VALUE = 5009,
        KIND_VALUE = 5014,
        LANGUAGETAG_VALUE = 5012,
        STRUCTURED_VALUE = 5017,
        TEXT_VALUE = 5001,
        TEXTLIST_VALUE = 5016,
        TIME_VALUE = 5004,
        TIMESTAMP_VALUE = 5007,
        TZ_VALUE = 5020,
        URI_VALUE = 5002,
        UTCOFFSET_VALUE = 5011,
        VERSION_VALUE = 5015,
        X_VALUE = 5013,
        NO_VALUE = 5099,
    }


    /**
     * Creates a deep copy of {@link ICalGLib.EnumArray} with the same properties as the `array`.
     * @param array The {@link ICalGLib.EnumArray} to be cloned
     * @returns The newly cloned {@link ICalGLib.EnumArray} with the same value as the `array`
     * @since 4.0
     */
    function enumarray_clone(array: EnumArray): EnumArray;

    /**
     * Removes the element at the `position` from the array.
     * @param array The {@link ICalGLib.EnumArray} to be modified
     * @param position The position in which the element will be removed from the array
     * @since 4.0
     */
    function enumarray_remove_element_at(array: EnumArray, position: number): void;

    /**
     * @since 1.0
     */
    function error_clear_errno(): void;

    /**
     * Reads an error from a string.
     * @param str The error name string
     * @returns An {@link ICalGLib.ErrorEnum} representation of the error `str`
     * @since 4.0
     */
    function error_error_from_string(str: string): ErrorEnum;

    /**
     * Gets the state of an error.
     * @param error The error to be checked
     * @returns The state of the `error`
     * @since 1.0
     */
    function error_get_error_state(error: ErrorEnum): ErrorState;

    /**
     * Determine whether errors are fatal.
     * @returns whether errors are fatal
     * @since 4.0
     */
    function error_get_errors_are_fatal(): boolean;

    /**
     * Returns the error stored in the library. If no error, return I_CAL_NO_ERROR.
     * @returns Return the error happened
     * @since 1.0
     */
    function error_icalerrno(): ErrorEnum;

    /**
     * Gets the {@link ICalGLib.ErrorEnum} in the string representation. This method called the icalerrorno_return to get
     * the current error.
     * @returns The string representation of the current error
     * @since 1.0
     */
    function error_perror(): string;

    /**
     * Restores the error to specified state.
     * @param error The error to be restored
     * @param es The error state to be restored
     * @since 1.0
     */
    function error_restore(error: string, es: ErrorState): void;

    /**
     * Sets the errno.
     * @param x The error to be set
     * @since 1.0
     */
    function error_set_errno(x: ErrorEnum): void;

    /**
     * Sets the state to the corresponding error in the library.
     * @param error The error enum
     * @param state The error state
     * @since 1.0
     */
    function error_set_error_state(error: ErrorEnum, state: ErrorState): void;

    /**
     * Sets whether errors are fatal, that is, whether libical aborts after any processing reports an error.
     * @param value value to set
     * @since 4.0
     */
    function error_set_errors_are_fatal(value: boolean): void;

    /**
     * Translates the {@link ICalGLib.ErrorEnum} to the string representation.
     * @param e The {@link ICalGLib.ErrorEnum} to be translated
     * @returns The string representation of `e`
     * @since 1.0
     */
    function error_strerror(e: ErrorEnum): string;

    /**
     * Suppresses the error.
     * @param error The error to be suppressed
     * @returns The error state suppressed
     * @since 1.0
     */
    function error_supress(error: string): ErrorState;

    /**
     * Gets the setting of {@link ICalGLib.Unknowntokenhandling}.
     * @returns The setting of {@link ICalGLib.Unknowntokenhandling}
     * @since 1.0
     */
    function get_unknown_token_handling_setting(): Unknowntokenhandling;

    /**
     * @since 1.0
     */
    function i_calerror_backtrace(): void;

    /**
     * Gets the value for the corresponding internal library limit.
     * @param kind The kind of limit to set
     * @returns The current value of the specified {@link ICalGLib.LimitsKind}
     * @since 4.0
     */
    function limit_get(kind: LimitsKind): number;

    /**
     * Sets the value for the corresponding internal library limit.
     * @param kind The kind of limit to set
     * @param limit The limit value. Use SIZE_MAX (i.e. maximum value of size_t) to set an unlimited value.
     * @since 4.0
     */
    function limit_set(kind: LimitsKind, limit: bigint | number): void;

    /**
     * Adds an existing buffer to the buffer ring.
     * @param buf The existing buffer to be added into the ical
     * @since 1.0
     */
    function memory_add_tmp_buffer(buf: null): void;

    /**
     * Append the character to the buffer. Only use them on normally allocated memory, or on buffers created
     * from icalmemory_new_buffer, never with buffers created by icalmemory_tmp_buffer. If icalmemory_append_string
     * has to resize a buffer on the ring, the ring will loose track of it and you will have memory problems.
     * @param buf The buffer to be appended. It should not be the memory in ical.
     * @param pos The position at which the new string to be appended
     * @param ch The character to be allocated
     * @since 1.0
     */
    function memory_append_char(buf: number[], pos: number[], ch: number): [number[], number[]];

    /**
     * Decodes the string as TEXT value and then appends it to the buffer. Only use them on normally allocated
     * memory, or on buffers created from icalmemory_new_buffer, never with buffers created by icalmemory_tmp_buffer.
     * If icalmemory_append_decoded_string has to resize a buffer on the ring, the ring will loose track of
     * it and you will have memory problems.
     * @param buf The buffer to be appended. It should not be the memory in ical.
     * @param pos The position at which the new string to be appended
     * @param str The string to be allocated
     * @since 4.0
     */
    function memory_append_decoded_string(buf: number[], pos: number[], str: string): [number[], number[]];

    /**
     * Encodes the string as TEXT value and then appends it to the buffer. Only use them on normally allocated
     * memory, or on buffers created from icalmemory_new_buffer, never with buffers created by icalmemory_tmp_buffer.
     * If icalmemory_append_encoded_string has to resize a buffer on the ring, the ring will loose track of
     * it and you will have memory problems.
     * @param buf The buffer to be appended. It should not be the memory in ical.
     * @param pos The position at which the new string to be appended
     * @param str The string to be allocated
     * @since 4.0
     */
    function memory_append_encoded_string(buf: number[], pos: number[], str: string): [number[], number[]];

    /**
     * Appends the string to the buffer. Only use them on normally allocated memory, or on buffers created from
     * icalmemory_new_buffer, never with buffers created by icalmemory_tmp_buffer. If icalmemory_append_string
     * has to resize a buffer on the ring, the ring will loose track of it and you will have memory problems.
     * @param buf The buffer to be appended. It should not be the memory in ical.
     * @param pos The position at which the new string to be appended
     * @param str The string to be allocated
     * @since 1.0
     */
    function memory_append_string(buf: number[], pos: number[], str: string): [number[], number[]];

    /**
     * Frees the buffer.
     * @param buf The buffer to be freed
     * @since 1.0
     */
    function memory_free_buffer(buf: null): void;

    /**
     * Creates a new buffer with target size. The caller should deallocate it when necessary.
     * @param size The size of the new buffer to be created
     * @returns The newly created buffer with the target size.
     * @since 1.0
     */
    function memory_new_buffer(size: bigint | number): null;

    /**
     * Resizes the buffer to the target size.
     * @param buf The buffer needs to be resized
     * @param size The target size the buffer to be resized to
     * @returns The buffer after being resized.
     * @since 1.0
     */
    function memory_resize_buffer(buf: null, size: bigint | number): null;

    /**
     * A wrapper around strdup. Partly to trap calls to strdup, partly because in -ansi, gcc on Red Hat claims
     * that strdup is undeclared.
     * @param s The string to be cloned
     * @returns The cloned string.
     * @since 1.0
     */
    function memory_strdup(s: string): string;

    /**
     * Creates a buffer with target size.
     * @param size The size of the buffer to be created
     * @returns The newly created buffer
     * @since 1.0
     */
    function memory_tmp_buffer(size: bigint | number): null;

    /**
     * Like strdup, but the buffer is on the ring.
     * @param str The string to be copied
     * @returns The new copy of the `str`.
     * @since 1.0
     */
    function memory_tmp_copy(str: string): string;

    /**
     * Fills an array with the 'count' number of occurrences generated by the rrule. Note that the times are
     * returned in UTC, but the times are calculated in local time. YOu will have to convert the results back
     * into local time before using them.
     * @param rule The rule of the recurrence
     * @param start The start seconds past the POSIX epoch
     * @param count The number of elements to be filled up in the `array`
     * @returns If successful, return the array. NULL if failed.
     * @since 1.0
     */
    function recur_expand_recurrence(rule: string, start: bigint | number, count: number): number[];

    /**
     * Returns the current behaviour what to do when an RRULE is invalid.
     * @returns The current setting
     * @since 4.0
     */
    function recur_get_invalid_rrule_handling_setting(): InvalidRruleHandling;

    /**
     * Sets what to do when an invalid RRULE is recognized.
     * @param value the setting
     * @since 4.0
     */
    function recur_set_invalid_rrule_handling_setting(value: InvalidRruleHandling): void;

    /**
     * Returns the code for a request status.
     * @param stat The {@link ICalGLib.RequestStatus} to be queried
     * @returns The code for a request status
     * @since 1.0
     */
    function request_status_code(stat: RequestStatus): string;

    /**
     * Returns the descriptive text for a request status.
     * @param stat The {@link ICalGLib.RequestStatus} to be translated
     * @returns The description of the `stat`
     * @since 1.0
     */
    function request_status_desc(stat: RequestStatus): string;

    /**
     * Returns a request status for major/minor status numbers.
     * @param major The major number
     * @param minor The minor number
     * @returns The corresponding {@link ICalGLib.RequestStatus}
     * @since 1.0
     */
    function request_status_from_num(major: number, minor: number): RequestStatus;

    /**
     * Returns the major number for a request status.
     * @param stat The {@link ICalGLib.RequestStatus} to be queried
     * @returns The major number for a request status
     * @since 1.0
     */
    function request_status_major(stat: RequestStatus): number;

    /**
     * Returns the minor number for a request status.
     * @param stat The {@link ICalGLib.RequestStatus} to be queried
     * @returns The minor number for a request status
     * @since 1.0
     */
    function request_status_minor(stat: RequestStatus): number;

    /**
     * Checks whether the {@link ICalGLib.Component} is valid.
     * @param comp The component to be checked
     * @returns Whether the `comp` is valid.
     * @since 1.0
     */
    function restriction_check(comp: Component): number;

    /**
     * Compares the kind of restriction and the count to determine whether it is valid.
     * @param restr The restriction kind
     * @param count The number of restrictions
     * @returns Whether it is valid or not. -1 indicates invalid or more analysis. 1 indicates pass and 0 or 2+ indicates fail.
     * @since 1.0
     */
    function restriction_compare(restr: RestrictionKind, count: number): number;

    /**
     * Sets {@link ICalGLib.Unknowntokenhandling}.
     * @param newSetting A {@link ICalGLib.Unknowntokenhandling}
     * @since 1.0
     */
    function set_unknown_token_handling_setting(newSetting: Unknowntokenhandling): void;

    /**
     * Converts an error code into its text representation.
     * @param err error code
     * @returns Text representation of the `err` code.
     * @since 4.0
     */
    function vcard_parser_errstr(err: number): string;

    /**
     * Parses the vCard string `str` and returns an {@link ICalGLib.VcardComponent}, or `null` when the parse failed.
     * @param str A vCard string to parse
     * @returns A newly created {@link ICalGLib.VcardComponent}, or `null` on error.
     * @since 4.0
     */
    function vcard_parser_parse_string(str: string): VcardComponent | null;

    /**
     * Checks whether the `comp` is valid.
     * @param comp The component to be checked
     * @returns Whether the `comp` is valid.
     * @since 1.0
     */
    function vcard_restriction_check(comp: VcardComponent): number;

    /**
     * Checks if the given `count` is in accordance with the given restriction, `restr`.
     * @param restr The restriction kind
     * @param count The number of restrictions
     * @returns 1 if the restriction is met, 0 if not.
     * @since 1.0
     */
    function vcard_restriction_compare(restr: VcardRestrictionKind, count: number): number;

    /**
     * @gir-type Callback
     */
    interface ComponentForeachRecurrenceFunc {
        (comp: Component, span: TimeSpan): void;
    }

    /**
     * @gir-type Callback
     */
    interface ComponentForeachTZIDFunc {
        (param: Parameter): void;
    }

    /**
     * @gir-type Callback
     */
    interface ParserLineGenFunc {
        (bytes: number[]): string;
    }

    namespace Array {
        // Signal signatures
        interface SignalSignatures extends Object.SignalSignatures {
            "notify::always-destroy": (pspec: GObject.ParamSpec) => void;
            "notify::is-global-memory": (pspec: GObject.ParamSpec) => void;
            "notify::native": (pspec: GObject.ParamSpec) => void;
            "notify::native-destroy-func": (pspec: GObject.ParamSpec) => void;
            "notify::owner": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends Object.ConstructorProps {}
    }

    /**
     * This is the ICalArray instance.
     * @gir-type Class
     */
    class Array extends Object {
        static $gtype: GObject.GType<Array>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: Array.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<Array.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        // Signals
        /** @signal */
        connect<K extends keyof Array.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Array.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof Array.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Array.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof Array.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<Array.SignalSignatures[K]>): void;

        // Methods
        /**
         * Creates a deep copy of {@link ICalGLib.Array} with the same properties as the `array`.
         * @returns The newly cloned {@link ICalGLib.Array} with the same value as the `array`
         * @since 1.0
         */
        copy(): Array;

        /**
         * Removes the element at the `position` from the array.
         * @param position The position in which the element will be removed from the array
         * @since 1.0
         */
        remove_element_at(position: number): void;

        /**
         * Gets the size of the array.
         * @returns The size of current array.
         * @since 1.0
         */
        size(): number;
    }


    namespace Attach {
        // Signal signatures
        interface SignalSignatures extends Object.SignalSignatures {
            "notify::always-destroy": (pspec: GObject.ParamSpec) => void;
            "notify::is-global-memory": (pspec: GObject.ParamSpec) => void;
            "notify::native": (pspec: GObject.ParamSpec) => void;
            "notify::native-destroy-func": (pspec: GObject.ParamSpec) => void;
            "notify::owner": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends Object.ConstructorProps {}
    }

    /**
     * This is the ICalAttach instance.
     * @gir-type Class
     */
    class Attach extends Object {
        static $gtype: GObject.GType<Attach>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: Attach.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<Attach.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        static new_from_bytes(bytes: GLib.Bytes | Uint8Array): Attach;

        static new_from_data(data: string, free_fn: GLib.Func | null): Attach;

        static new_from_url(url: string): Attach;

        // Signals
        /** @signal */
        connect<K extends keyof Attach.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Attach.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof Attach.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Attach.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof Attach.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<Attach.SignalSignatures[K]>): void;

        // Methods
        /**
         * Gets the data, if the {@link ICalGLib.Attach} is built from the data.
         * @returns The data component of the `attach`. `null` if it is built from url or there is an error.
         * @since 1.0
         */
        get_data(): string | null;

        /**
         * @param args 
         */
    // Conflicted with GObject.Object.get_data
        get_data(...args: never[]): any;

        /**
         * Checks whether the {@link ICalGLib.Attach} is built from url.
         * @returns true if the attachment is a url; false otherwise
         * @since 1.0
         */
        get_is_url(): boolean;

        /**
         * Gets the url, if the {@link ICalGLib.Attach} is built from the url.
         * @returns The url component of the `attach`. `null` if it is built from data or there is an error.
         * @since 1.0
         */
        get_url(): string | null;
    }


    namespace CompIter {
        // Signal signatures
        interface SignalSignatures extends Object.SignalSignatures {
            "notify::always-destroy": (pspec: GObject.ParamSpec) => void;
            "notify::is-global-memory": (pspec: GObject.ParamSpec) => void;
            "notify::native": (pspec: GObject.ParamSpec) => void;
            "notify::native-destroy-func": (pspec: GObject.ParamSpec) => void;
            "notify::owner": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends Object.ConstructorProps {}
    }

    /**
     * This is the ICalCompIter instance.
     * @gir-type Class
     */
    class CompIter extends Object {
        static $gtype: GObject.GType<CompIter>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: CompIter.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<CompIter.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        // Signals
        /** @signal */
        connect<K extends keyof CompIter.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, CompIter.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof CompIter.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, CompIter.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof CompIter.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<CompIter.SignalSignatures[K]>): void;

        // Methods
        /**
         * Gets the current {@link ICalGLib.Component} pointed by {@link ICalGLib.CompIter}.
         * @returns A {@link ICalGLib.Component}
         * @since 1.0
         */
        deref(): Component;

        /**
         * @returns true if a valid iterator; false otherwise.
         * @since 4.0
         */
        is_valid(): boolean;

        /**
         * Gets the next {@link ICalGLib.Component} pointed by {@link ICalGLib.CompIter}.
         * @returns A {@link ICalGLib.Component}
         * @since 1.0
         */
        next(): Component;

        /**
         * Gets the prior {@link ICalGLib.Component} pointed by {@link ICalGLib.CompIter}.
         * @returns A {@link ICalGLib.Component}
         * @since 1.0
         */
        prior(): Component;
    }


    namespace Component {
        // Signal signatures
        interface SignalSignatures extends Object.SignalSignatures {
            "notify::always-destroy": (pspec: GObject.ParamSpec) => void;
            "notify::is-global-memory": (pspec: GObject.ParamSpec) => void;
            "notify::native": (pspec: GObject.ParamSpec) => void;
            "notify::native-destroy-func": (pspec: GObject.ParamSpec) => void;
            "notify::owner": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends Object.ConstructorProps {}
    }

    /**
     * This is the ICalComponent instance.
     * @gir-type Class
     */
    class Component extends Object {
        static $gtype: GObject.GType<Component>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: Component.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<Component.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        static ["new"](kind: ComponentKind): Component;

        static new_from_string(str: string): Component;

        static new_iana(iana_name: string): Component;

        static new_participant(): Component;

        static new_vagenda(): Component;

        static new_valarm(): Component;

        static new_vavailability(): Component;

        static new_vcalendar(): Component;

        static new_vevent(): Component;

        static new_vfreebusy(): Component;

        static new_vjournal(): Component;

        static new_vlocation(): Component;

        static new_vpatch(): Component;

        static new_vpoll(): Component;

        static new_vquery(): Component;

        static new_vreply(): Component;

        static new_vresource(): Component;

        static new_vtimezone(): Component;

        static new_vtodo(): Component;

        static new_vvoter(): Component;

        static new_x(x_name: string): Component;

        static new_xavailable(): Component;

        static new_xdaylight(): Component;

        static new_xpatch(): Component;

        static new_xstandard(): Component;

        static new_xvote(): Component;

        // Signals
        /** @signal */
        connect<K extends keyof Component.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Component.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof Component.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Component.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof Component.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<Component.SignalSignatures[K]>): void;

        // Static methods
        /**
         * Converts a string to a {@link ICalGLib.ComponentKind}.
         * @param string A string
         * @since 1.0
         */
        static kind_from_string(string: string): ComponentKind;

        /**
         * Checks if a {@link ICalGLib.ComponentKind} is valid.
         * @param kind A {@link ICalGLib.ComponentKind}
         * @since 1.0
         */
        static kind_is_valid(kind: ComponentKind): boolean;

        /**
         * Converts a {@link ICalGLib.ComponentKind} to a string.
         * @param kind A {@link ICalGLib.ComponentKind}
         * @since 1.0
         */
        static kind_to_string(kind: ComponentKind): string;

        // Methods
        /**
         * Adds a {@link ICalGLib.Component} into another {@link ICalGLib.Component} as a child component.
         * @param child A child {@link ICalGLib.Component}
         * @since 1.0
         */
        add_component(child: Component): void;

        /**
         * Adds an {@link ICalGLib.Property} into {@link ICalGLib.Component}.
         * @param property An {@link ICalGLib.Property}
         * @since 1.0
         */
        add_property(property: Property): void;

        /**
         * Converts a {@link ICalGLib.Component} to a string.
         * @returns The string representation of {@link ICalGLib.Component}.
         * @since 1.0
         */
        as_ical_string(): string;

        /**
         * Gets the {@link ICalGLib.CompIter} pointing to the first child {@link ICalGLib.Component}.
         * @param kind A {@link ICalGLib.ComponentKind}
         * @returns A {@link ICalGLib.CompIter}
         * @since 1.0
         */
        begin_component(kind: ComponentKind): CompIter;

        /**
         * Gets the {@link ICalGLib.PropIter} pointing to the first property of type `kind` in {@link ICalGLib.Component}.
         * @param kind A {@link ICalGLib.PropertyKind}
         * @returns A {@link ICalGLib.PropIter}
         * @since 4.0
         */
        begin_property(kind: PropertyKind): PropIter;

        /**
         * Checks if the {@link ICalGLib.Component} has restrictions.
         * @returns If `comp` has restrictions
         * @since 1.0
         */
        check_restrictions(): boolean;

        /**
         * Deeply clone a {@link ICalGLib.Component}.
         * @returns The newly deeply cloned {@link ICalGLib.Component}.
         * @since 4.0
         */
        clone(): Component;

        /**
         * Converts some X-LIC-ERROR properties into RETURN-STATUS properties.
         * @since 1.0
         */
        convert_errors(): void;

        /**
         * Counts the child {@link ICalGLib.Component} with the target kind in the parent one.
         * @param kind The target {@link ICalGLib.ComponentKind}
         * @returns The count of child {@link ICalGLib.Component} in the parent one.
         * @since 1.0
         */
        count_components(kind: ComponentKind): number;

        /**
         * Counts the number of errors in {@link ICalGLib.Component}.
         * @returns The count of errors.
         * @since 1.0
         */
        count_errors(): number;

        /**
         * Counts the number of {@link ICalGLib.Property} in {@link ICalGLib.Component}.
         * @param kind A {@link ICalGLib.PropertyKind}
         * @returns The number of {@link ICalGLib.Property}.
         * @since 1.0
         */
        count_properties(kind: PropertyKind): number;

        /**
         * Gets the {@link ICalGLib.CompIter} pointing to the end child {@link ICalGLib.Component}.
         * @param kind A {@link ICalGLib.ComponentKind}
         * @returns A {@link ICalGLib.CompIter}
         * @since 1.0
         */
        end_component(kind: ComponentKind): CompIter;

        /**
         * Cycles through all recurrences of an event. This function will call the specified callback function for
         * once for the base value of DTSTART, and foreach recurring date/time value. It will filter out events
         * that are specified as an EXDATE or an EXRULE.
         * @param start Ignore timespans before this
         * @param end Ignore timespans after this
         * @param callback Function called for each timespan within the range
         * @since 3.0.5
         */
        foreach_recurrence(start: Time, end: Time, callback: ComponentForeachRecurrenceFunc): void;

        /**
         * Applies the same manipulation on every tzid in {@link ICalGLib.Component}.
         * @param callback The callback function
         * @since 3.0.5
         */
        foreach_tzid(callback: ComponentForeachTZIDFunc): void;

        /**
         * Gets the comment of the {@link ICalGLib.Component}.
         * @returns The comment of `comp`.
         * @since 1.0
         */
        get_comment(): string;

        /**
         * Returns the name of the `component` as string.
         * @returns name of the `component`
         * @since 4.0
         */
        get_component_name(): string;

        /**
         * Gets the current {@link ICalGLib.Component} in {@link ICalGLib.Component}.
         * @returns The current {@link ICalGLib.Component}.
         * @since 1.0
         */
        get_current_component(): Component;

        /**
         * Gets the current {@link ICalGLib.Property} in {@link ICalGLib.Component}.
         * @returns The current {@link ICalGLib.Property}.
         * @since 1.0
         */
        get_current_property(): Property;

        /**
         * Gets the description of the {@link ICalGLib.Component}.
         * @returns The description of `comp`.
         * @since 1.0
         */
        get_description(): string;

        /**
         * Gets the dtend of the {@link ICalGLib.Component}.
         * @returns A {@link ICalGLib.Time}.
         * @since 1.0
         */
        get_dtend(): Time;

        /**
         * Gets the dtstamp of the {@link ICalGLib.Component}.
         * @returns A {@link ICalGLib.Time}.
         * @since 1.0
         */
        get_dtstamp(): Time;

        /**
         * Gets the dtstart of the {@link ICalGLib.Component}.
         * @returns A {@link ICalGLib.Time}.
         * @since 1.0
         */
        get_dtstart(): Time;

        /**
         * Gets the due of the {@link ICalGLib.Component}.
         * @returns A {@link ICalGLib.Time}.
         * @since 1.0
         */
        get_due(): Time;

        /**
         * Gets the duration of the {@link ICalGLib.Component}.
         * @returns An {@link ICalGLib.Duration}.
         * @since 1.0
         */
        get_duration(): Duration;

        /**
         * Gets the first {@link ICalGLib.Component} with specific kind in {@link ICalGLib.Component}.
         * @param kind A {@link ICalGLib.ComponentKind}
         * @returns The first {@link ICalGLib.Component}.
         * @since 1.0
         */
        get_first_component(kind: ComponentKind): Component | null;

        /**
         * Gets the first {@link ICalGLib.Property} with specific kind in {@link ICalGLib.Component}.
         * @param kind A {@link ICalGLib.PropertyKind}
         * @returns The first {@link ICalGLib.Property}.
         * @since 1.0
         */
        get_first_property(kind: PropertyKind): Property | null;

        /**
         * For VCOMPONENT: Returns a reference to the first VEVENT, VTODO or VJOURNAL.
         * @returns A reference to the first VEVENT, VTODO or VJOURNAL
         * @since 1.0
         */
        get_first_real_component(): Component;

        /**
         * Returns the IANA name of the `component` as string, or `null`.
         * @returns IANA name of the `component`, or `null`, when it's not an IANA component
         * @since 4.0
         */
        get_iana_name(): string | null;

        /**
         * Returns the first VEVENT, VTODO or VJOURNAL sub-component of cop, or comp if it is one of those types.
         * @returns The first VEVENT, VTODO or VJOURNAL sub-component.
         * @since 1.0
         */
        get_inner(): Component | null;

        /**
         * Gets the location of the {@link ICalGLib.Component}.
         * @returns The location of `comp`.
         * @since 1.0
         */
        get_location(): string;

        /**
         * Gets the method of the {@link ICalGLib.Component}.
         * @returns A {@link ICalGLib.PropertyMethod}.
         * @since 1.0
         */
        get_method(): PropertyMethod;

        /**
         * Gets the next {@link ICalGLib.Component} with specific kind in {@link ICalGLib.Component}.
         * @param kind A {@link ICalGLib.ComponentKind}
         * @returns The next {@link ICalGLib.Component}.
         * @since 1.0
         */
        get_next_component(kind: ComponentKind): Component | null;

        /**
         * Gets the next {@link ICalGLib.Property} with specific kind in {@link ICalGLib.Component}.
         * @param kind A {@link ICalGLib.PropertyKind}
         * @returns The next {@link ICalGLib.Property}.
         * @since 1.0
         */
        get_next_property(kind: PropertyKind): Property | null;

        /**
         * Gets the parent component of the `component`.
         * @returns The parent {@link ICalGLib.Component} of the `component`.
         * @since 3.0
         */
        get_parent(): Component | null;

        /**
         * Gets the recurrenceid of the {@link ICalGLib.Component}.
         * @returns A {@link ICalGLib.Time}.
         * @since 1.0
         */
        get_recurrenceid(): Time;

        /**
         * Gets the relcalid of the {@link ICalGLib.Component}.
         * @returns The relcalid of `comp`.
         * @since 1.0
         */
        get_relcalid(): string;

        /**
         * Gets the sequence of the {@link ICalGLib.Component}.
         * @returns The sequence of `comp`.
         * @since 1.0
         */
        get_sequence(): number;

        /**
         * For VEVENT, VTODO, VJOURNAL and VTIMEZONE: reports the start and end times of an event in UTC.
         * @returns A {@link ICalGLib.TimeSpan}.
         * @since 1.0
         */
        get_span(): TimeSpan;

        /**
         * Returns the property status of the {@link ICalGLib.Component}. ICAL_STATUS_NONE is returned if a problem parsing
         * the component was detected.
         * @returns A {@link ICalGLib.PropertyStatus}.
         * @since 1.0
         */
        get_status(): PropertyStatus;

        /**
         * Gets the summary of the {@link ICalGLib.Component}.
         * @returns The summary of `comp`.
         * @since 1.0
         */
        get_summary(): string;

        /**
         * Returns the icaltimezone in the component corresponding to the TZID, or NULL if it can't be found.
         * @param tzid A string representing timezone
         * @returns A {@link ICalGLib.Timezone}.
         * @since 1.0
         */
        get_timezone(tzid: string): Timezone | null;

        /**
         * Gets the uid of the {@link ICalGLib.Component}.
         * @returns The uid of `comp`.
         * @since 1.0
         */
        get_uid(): string;

        /**
         * Returns the X (custom) name of the `component` as string, or `null`.
         * @returns X (custom) name of the `component`, or `null`, when it's not a X component
         * @since 4.0
         */
        get_x_name(): string | null;

        /**
         * Checks whether {@link ICalGLib.Component} is valid.
         * @returns true if yes, false if not.
         * @since 1.0
         */
        is_valid(): boolean;

        /**
         * Gets the type of {@link ICalGLib.Component}.
         * @returns A {@link ICalGLib.ComponentKind}.
         * @since 1.0
         */
        isa(): ComponentKind;

        /**
         * Checks whether the native part of {@link ICalGLib.Component} is icalcomponent.
         * @returns true if yes, false if not.
         * @since 1.0
         */
        isa_component(): boolean;

        /**
         * Takes 2 VCALENDAR components and merges the second one into the first, resolving any problems with conflicting
         * TZIDs. comp_to_merge will no longer exist after calling this function.
         * @param comp_to_merge A {@link ICalGLib.Component}. After merged it will not exist any more.
         * @since 1.0
         */
        merge_component(comp_to_merge: Component): void;

        /**
         * Normalizes (reorders and sorts the properties) the `component`.
         * @since 4.0
         */
        normalize(): void;

        /**
         * Removes a child {@link ICalGLib.Component} from another {@link ICalGLib.Component}.
         * @param child A child {@link ICalGLib.Component}
         * @since 1.0
         */
        remove_component(child: Component): void;

        /**
         * Removes {@link ICalGLib.Property} from {@link ICalGLib.Component}. Caution: The compare is based on address. So you must use
         * the original {@link ICalGLib.Property} as the target.
         * @param property A {@link ICalGLib.Property}
         * @since 1.0
         */
        remove_property(property: Property): void;

        /**
         * Removes all properties of that kind in the {@link ICalGLib.Component}.
         * @param kind The {@link ICalGLib.PropertyKind} to be removed
         * @since 4.0
         */
        remove_property_by_kind(kind: PropertyKind): void;

        /**
         * Sets the comment of the {@link ICalGLib.Component}.
         * @param v A string representing comment
         * @since 1.0
         */
        set_comment(v: string): void;

        /**
         * Sets the description of the {@link ICalGLib.Component}.
         * @param v A string representing description
         * @since 1.0
         */
        set_description(v: string): void;

        /**
         * Sets the dtend of the {@link ICalGLib.Component}.
         * @param v A {@link ICalGLib.Time}
         * @since 1.0
         */
        set_dtend(v: Time): void;

        /**
         * Sets the dtstamp of the {@link ICalGLib.Component}.
         * @param v A {@link ICalGLib.Time}
         * @since 1.0
         */
        set_dtstamp(v: Time): void;

        /**
         * Sets the dtstart of the {@link ICalGLib.Component}.
         * @param v A {@link ICalGLib.Time}
         * @since 1.0
         */
        set_dtstart(v: Time): void;

        /**
         * Sets the due of the {@link ICalGLib.Component}.
         * @param v A {@link ICalGLib.Time}
         * @since 1.0
         */
        set_due(v: Time): void;

        /**
         * Sets the duration of the {@link ICalGLib.Component}.
         * @param v A {@link ICalGLib.Duration}
         * @since 1.0
         */
        set_duration(v: Duration): void;

        /**
         * Sets the IANA name of the `component`.
         * @param iana_name an IANA name for the `component`
         * @since 4.0
         */
        set_iana_name(iana_name: string): void;

        /**
         * Sets the location of the {@link ICalGLib.Component}.
         * @param v A string representing location
         * @since 1.0
         */
        set_location(v: string): void;

        /**
         * Sets the method of the {@link ICalGLib.Component}.
         * @param method A {@link ICalGLib.PropertyMethod}
         * @since 1.0
         */
        set_method(method: PropertyMethod): void;

        /**
         * Sets the `parent` {@link ICalGLib.Component} of the specified `component`.
         * @param parent An {@link ICalGLib.Component}, a new parent
         * @since 3.0
         */
        set_parent(parent: Component | null): void;

        /**
         * Sets the recurrenceid of the {@link ICalGLib.Component}.
         * @param v A {@link ICalGLib.Time}
         * @since 1.0
         */
        set_recurrenceid(v: Time): void;

        /**
         * Sets the relcalid of the {@link ICalGLib.Component}.
         * @param v A string representing relcalid
         * @since 1.0
         */
        set_relcalid(v: string): void;

        /**
         * Sets the sequence of the {@link ICalGLib.Component}.
         * @param v The sequence number
         * @since 1.0
         */
        set_sequence(v: number): void;

        /**
         * Sets the status of the {@link ICalGLib.Component}.
         * @param status A {@link ICalGLib.PropertyStatus}
         * @since 1.0
         */
        set_status(status: PropertyStatus): void;

        /**
         * Sets the summary of the {@link ICalGLib.Component}.
         * @param v A string representing summary
         * @since 1.0
         */
        set_summary(v: string): void;

        /**
         * Sets the uid of the {@link ICalGLib.Component}.
         * @param v A string representing uid
         * @since 1.0
         */
        set_uid(v: string): void;

        /**
         * Sets an X (custom) name of the `component`.
         * @param xname an X (custom) name for the `component`
         * @since 4.0
         */
        set_x_name(xname: string): void;

        /**
         * Removes all X-LIC-ERROR properties.
         * @since 1.0
         */
        strip_errors(): void;
    }


    namespace Datetimeperiod {
        // Signal signatures
        interface SignalSignatures extends Object.SignalSignatures {
            "notify::always-destroy": (pspec: GObject.ParamSpec) => void;
            "notify::is-global-memory": (pspec: GObject.ParamSpec) => void;
            "notify::native": (pspec: GObject.ParamSpec) => void;
            "notify::native-destroy-func": (pspec: GObject.ParamSpec) => void;
            "notify::owner": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends Object.ConstructorProps {}
    }

    /**
     * This is the ICalDatetimeperiod instance.
     * @gir-type Class
     */
    class Datetimeperiod extends Object {
        static $gtype: GObject.GType<Datetimeperiod>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: Datetimeperiod.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<Datetimeperiod.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        static ["new"](): Datetimeperiod;

        // Signals
        /** @signal */
        connect<K extends keyof Datetimeperiod.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Datetimeperiod.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof Datetimeperiod.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Datetimeperiod.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof Datetimeperiod.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<Datetimeperiod.SignalSignatures[K]>): void;

        // Methods
        /**
         * Gets the period attribute of {@link ICalGLib.Datetimeperiod}.
         * @returns The period attribute of `dtp`.
         * @since 1.0
         */
        get_period(): Period;

        /**
         * Gets the time attribute of {@link ICalGLib.Datetimeperiod}.
         * @returns The time attribute of `dtp`.
         * @since 1.0
         */
        get_time(): Time;

        /**
         * Sets the period attribute of {@link ICalGLib.Datetimeperiod}.
         * @param period The period attribute of `dtp`
         * @since 1.0
         */
        set_period(period: Period): void;

        /**
         * Sets the time attribute of {@link ICalGLib.Datetimeperiod}.
         * @param time The time attribute of `dtp`
         * @since 1.0
         */
        set_time(time: Time): void;
    }


    namespace Duration {
        // Signal signatures
        interface SignalSignatures extends Object.SignalSignatures {
            "notify::always-destroy": (pspec: GObject.ParamSpec) => void;
            "notify::is-global-memory": (pspec: GObject.ParamSpec) => void;
            "notify::native": (pspec: GObject.ParamSpec) => void;
            "notify::native-destroy-func": (pspec: GObject.ParamSpec) => void;
            "notify::owner": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends Object.ConstructorProps {}
    }

    /**
     * This is the ICalDuration instance.
     * @gir-type Class
     */
    class Duration extends Object {
        static $gtype: GObject.GType<Duration>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: Duration.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<Duration.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        static new_bad_duration(): Duration;

        static new_from_seconds(t: number): Duration;

        static new_from_string(str: string): Duration;

        static new_null_duration(): Duration;

        // Signals
        /** @signal */
        connect<K extends keyof Duration.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Duration.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof Duration.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Duration.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof Duration.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<Duration.SignalSignatures[K]>): void;

        // Static methods
        /**
         * Extends a time duration.
         * @param t A {@link ICalGLib.Time} to be operated on
         * @param d A {@link ICalGLib.Duration} as the difference
         * @since 4.0
         */
        static extend(t: Time, d: Duration): Time;

        /**
         * Creates a duration between two time endpoints.
         * @param t1 The subtracted {@link ICalGLib.Time}
         * @param t2 The subtracting {@link ICalGLib.Time}
         * @since 4.0
         */
        static from_times(t1: Time, t2: Time): Duration;

        // Methods
        /**
         * Converts the {@link ICalGLib.Duration} to the representation in string
         * @returns The duration in string
         * @since 1.0
         */
        as_ical_string(): string;

        /**
         * Extracts the duration in seconds from an {@link ICalGLib.Duration}. Does not consider negative durations. Does not
         * support days and weeks.
         * @returns The duration in second
         * @since 4.0
         */
        as_seconds(): number;

        /**
         * Extracts the duration in seconds from an {@link ICalGLib.Duration} on a continuous timeline with 24-hour days. Supports
         * days, weeks, and negative durations.
         * @returns The duration in seconds
         * @since 4.0
         */
        as_utc_seconds(): number;

        /**
         * Gets the days of {@link ICalGLib.Duration}.
         * @returns The days.
         * @since 1.0
         */
        get_days(): number;

        /**
         * Gets the hours of {@link ICalGLib.Duration}.
         * @returns The hours.
         * @since 1.0
         */
        get_hours(): number;

        /**
         * Gets the minutes of {@link ICalGLib.Duration}.
         * @returns The minutes.
         * @since 1.0
         */
        get_minutes(): number;

        /**
         * Gets the seconds of {@link ICalGLib.Duration}.
         * @returns The seconds.
         * @since 1.0
         */
        get_seconds(): number;

        /**
         * Gets the weeks of {@link ICalGLib.Duration}.
         * @returns The weeks.
         * @since 1.0
         */
        get_weeks(): number;

        /**
         * Checks whether the {@link ICalGLib.Duration} is the bad_duration.
         * @returns true if `duration` is the bad_duration, false if not.
         * @since 1.0
         */
        is_bad_duration(): boolean;

        /**
         * Gets the is_neg of {@link ICalGLib.Duration}.
         * @returns The is_neg.
         * @since 1.0
         */
        is_neg(): boolean;

        /**
         * Checks whether the {@link ICalGLib.Duration} is the null_duration.
         * @returns true if `duration` is the null_duration, false if not.
         * @since 1.0
         */
        is_null_duration(): boolean;

        /**
         * Create a normalized duration from another duration.
         * @returns A normalized {@link ICalGLib.Duration}.
         * @since 4.0
         */
        normalize(): Duration;

        /**
         * Sets the days of {@link ICalGLib.Duration}.
         * @param days The days
         * @since 1.0
         */
        set_days(days: number): void;

        /**
         * Sets the hours of {@link ICalGLib.Duration}.
         * @param hours The hours
         * @since 1.0
         */
        set_hours(hours: number): void;

        /**
         * Sets the is_neg of {@link ICalGLib.Duration}.
         * @param is_neg The is_neg
         * @since 1.0
         */
        set_is_neg(is_neg: boolean): void;

        /**
         * Sets the minutes of {@link ICalGLib.Duration}.
         * @param minutes The minutes
         * @since 1.0
         */
        set_minutes(minutes: number): void;

        /**
         * Sets the seconds of {@link ICalGLib.Duration}.
         * @param seconds The seconds
         * @since 1.0
         */
        set_seconds(seconds: number): void;

        /**
         * Sets the weeks of {@link ICalGLib.Duration}.
         * @param weeks The weeks
         * @since 1.0
         */
        set_weeks(weeks: number): void;
    }


    namespace EnumArray {
        // Signal signatures
        interface SignalSignatures extends Object.SignalSignatures {
            "notify::always-destroy": (pspec: GObject.ParamSpec) => void;
            "notify::is-global-memory": (pspec: GObject.ParamSpec) => void;
            "notify::native": (pspec: GObject.ParamSpec) => void;
            "notify::native-destroy-func": (pspec: GObject.ParamSpec) => void;
            "notify::owner": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends Object.ConstructorProps {}
    }

    /**
     * This is the ICalEnumArray instance.
     * @gir-type Class
     */
    class EnumArray extends Object {
        static $gtype: GObject.GType<EnumArray>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: EnumArray.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<EnumArray.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        static ["new"](increment_size: number): EnumArray;

        // Signals
        /** @signal */
        connect<K extends keyof EnumArray.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, EnumArray.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof EnumArray.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, EnumArray.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof EnumArray.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<EnumArray.SignalSignatures[K]>): void;

        // Methods
        /**
         * Creates a deep copy of {@link ICalGLib.EnumArray} with the same properties as the `array`.
         * @returns The newly cloned {@link ICalGLib.EnumArray} with the same value as the `array`
         * @since 4.0
         */
        clone(): EnumArray;

        /**
         * Removes the element at the `position` from the array.
         * @param position The position in which the element will be removed from the array
         * @since 4.0
         */
        remove_element_at(position: bigint | number): void;

        /**
         * Gets the size of the array.
         * @returns The size of current array.
         * @since 4.0
         */
        size(): number;
    }


    namespace Geo {
        // Signal signatures
        interface SignalSignatures extends Object.SignalSignatures {
            "notify::always-destroy": (pspec: GObject.ParamSpec) => void;
            "notify::is-global-memory": (pspec: GObject.ParamSpec) => void;
            "notify::native": (pspec: GObject.ParamSpec) => void;
            "notify::native-destroy-func": (pspec: GObject.ParamSpec) => void;
            "notify::owner": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends Object.ConstructorProps {}
    }

    /**
     * This is the ICalGeo instance.
     * @gir-type Class
     */
    class Geo extends Object {
        static $gtype: GObject.GType<Geo>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: Geo.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<Geo.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        static ["new"](lat: number, lon: number): Geo;

        // Signals
        /** @signal */
        connect<K extends keyof Geo.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Geo.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof Geo.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Geo.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof Geo.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<Geo.SignalSignatures[K]>): void;

        // Methods
        /**
         * Creates a new {@link ICalGLib.Geo}, copy of `geo`.
         * @returns The newly created {@link ICalGLib.Geo}, copy of `geo`.
         * @since 1.0
         */
        clone(): Geo;

        /**
         * Gets the latitude of {@link ICalGLib.Geo}.
         * @returns The latitude.
         * @since 1.0
         */
        get_lat(): number;

        /**
         * Gets the longitude of {@link ICalGLib.Geo}.
         * @returns The longitude.
         * @since 1.0
         */
        get_lon(): number;

        /**
         * Sets the latitude of {@link ICalGLib.Geo}.
         * @param lat The latitude
         * @since 1.0
         */
        set_lat(lat: number): void;

        /**
         * Sets the longitude of {@link ICalGLib.Geo}.
         * @param lon The longitude
         * @since 1.0
         */
        set_lon(lon: number): void;
    }


    namespace Object {
        // Signal signatures
        interface SignalSignatures extends GObject.Object.SignalSignatures {
            "notify::always-destroy": (pspec: GObject.ParamSpec) => void;
            "notify::is-global-memory": (pspec: GObject.ParamSpec) => void;
            "notify::native": (pspec: GObject.ParamSpec) => void;
            "notify::native-destroy-func": (pspec: GObject.ParamSpec) => void;
            "notify::owner": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends GObject.Object.ConstructorProps {
            always_destroy: boolean;
            alwaysDestroy: boolean;
            is_global_memory: boolean;
            isGlobalMemory: boolean;
            "native": never;
            native_destroy_func: never;
            nativeDestroyFunc: never;
            owner: GObject.Object;
        }
    }

    /**
     * This is an ICalObject instance struct.
     * @gir-type Class
     */
    abstract class Object extends GObject.Object {
        static $gtype: GObject.GType<Object>;

        // Properties
        /**
         * Whether free the native libical structure on {@link ICalGLib.Object}'s finalize even
         * if the object has set an owner.
         * @since 3.0.11
         * @default false
         */
        get always_destroy(): boolean;
        set always_destroy(val: boolean);

        /**
         * Whether free the native libical structure on {@link ICalGLib.Object}'s finalize even
         * if the object has set an owner.
         * @since 3.0.11
         * @default false
         */
        get alwaysDestroy(): boolean;
        set alwaysDestroy(val: boolean);

        /**
         * Whether the native libical structure is from a global shared memory.
         * If TRUE, then it is not freed on {@link ICalGLib.Object}'s finalize.
         * @construct-only
         * @default false
         */
        get is_global_memory(): boolean;

        /**
         * Whether the native libical structure is from a global shared memory.
         * If TRUE, then it is not freed on {@link ICalGLib.Object}'s finalize.
         * @construct-only
         * @default false
         */
        get isGlobalMemory(): boolean;

        /**
         * The native libical structure for this ICalObject.
         * @construct-only
         */
        get "native"(): null;

        /**
         * GDestroyNotify function to use to destroy the native libical pointer.
         */
        get native_destroy_func(): null;
        set native_destroy_func(val: never);

        /**
         * GDestroyNotify function to use to destroy the native libical pointer.
         */
        get nativeDestroyFunc(): null;
        set nativeDestroyFunc(val: never);

        /**
         * Owner of the native libical structure. If set, then it is
         * responsible for a free of the native libical structure.
         */
        get owner(): GObject.Object;
        set owner(val: GObject.Object);

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: Object.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<Object.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        // Signals
        /** @signal */
        connect<K extends keyof Object.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Object.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof Object.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Object.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof Object.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<Object.SignalSignatures[K]>): void;

        // Static methods
        /**
         * Frees all global objects. Any references to them are invalidated
         * by this call, unless they had been `g_object_ref()`-ed manually.
         * @since 3.0.5
         */
        static free_global_objects(): void;

        // Methods
        /**
         * Adds a `depender` into the list of objects which should not be destroyed before
         * this `iobject`. It's usually used for cases where the `iobject` uses native libical
         * structure from the `depender`. The `depender` is referenced. It's illegal to try
         * to add one `depender` multiple times.
         * @param depender a {@link GObject.Object} depender
         * @since 1.0
         */
        add_depender(depender: GObject.Object): void;

        /**
         * Obtain the `ICalObject`::always-destroy property value.
         * @returns Whether the native libical structure is freed even when an owner is set.
         * @since 3.0.11
         */
        get_always_destroy(): boolean;

        /**
         * Obtains whether the native libical structure is a global shared memory,
         * thus should not be destroyed. This can be set only during construction time.
         * @returns Whether the native libical structure is a global shared memory.
         * @since 1.0
         */
        get_is_global_memory(): boolean;

        /**
         * Obtain current owner of the native libical structure. The returned pointer,
         * if not NULL, is referenced for thread safety. Unref it with g_object_unref
         * when done with it.
         * @returns Current owner of the libical    native structure. Returns `null` when there is no owner.
         * @since 1.0
         */
        ref_owner<T = GObject.Object>(): T;

        /**
         * Removes a `depender` from the list of objects which should not be destroyed before
         * this `iobject`, previously added with `i_cal_object_add_depender()`. It's illegal to try
         * to remove the `depender` which is not in the internal list.
         * @param depender a {@link GObject.Object} depender
         * @since 1.0
         */
        remove_depender(depender: GObject.Object): void;

        /**
         * Unref and remove the owner.
         * @since 1.0
         */
        remove_owner(): void;

        /**
         * Sets the `ICalObject`::always-destroy property value. When `true`, the native
         * libical structure is always freed, even when an owner of the `iobject` is set.
         * @param value value to set
         * @since 3.0.11
         */
        set_always_destroy(value: boolean): void;

        /**
         * Sets a function to be used to destroy the native libical structure.
         * @since 1.0
         */
        set_native_destroy_func(): void;

        /**
         * Sets an owner of the native libical structure, that is an object responsible
         * for a destroy of the native libical structure.
         * @param owner Owner of the native libical structure
         * @since 1.0
         */
        set_owner(owner: GObject.Object): void;

        /**
         * Obtain native libical structure pointer associated with this `iobject` and sets the one
         * at `iobject` to NULL, thus it's invalid since now on.
         * @returns Native libical structure pointer associated with this `iobject`.
         * @since 1.0
         */
        steal_native(): null;
    }


    namespace ParamIter {
        // Signal signatures
        interface SignalSignatures extends Object.SignalSignatures {
            "notify::always-destroy": (pspec: GObject.ParamSpec) => void;
            "notify::is-global-memory": (pspec: GObject.ParamSpec) => void;
            "notify::native": (pspec: GObject.ParamSpec) => void;
            "notify::native-destroy-func": (pspec: GObject.ParamSpec) => void;
            "notify::owner": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends Object.ConstructorProps {}
    }

    /**
     * This is the ICalParamIter instance.
     * @gir-type Class
     */
    class ParamIter extends Object {
        static $gtype: GObject.GType<ParamIter>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: ParamIter.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<ParamIter.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        // Signals
        /** @signal */
        connect<K extends keyof ParamIter.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, ParamIter.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof ParamIter.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, ParamIter.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof ParamIter.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<ParamIter.SignalSignatures[K]>): void;

        // Methods
        /**
         * Gets the current {@link ICalGLib.Parameter} pointed by {@link ICalGLib.ParamIter}.
         * @returns A {@link ICalGLib.Parameter}
         * @since 4.0
         */
        deref(): Parameter;

        /**
         * Gets the next {@link ICalGLib.Parameter} pointed by {@link ICalGLib.ParamIter}.
         * @returns A {@link ICalGLib.Parameter}
         * @since 4.0
         */
        next(): Parameter;
    }


    namespace Parameter {
        // Signal signatures
        interface SignalSignatures extends Object.SignalSignatures {
            "notify::always-destroy": (pspec: GObject.ParamSpec) => void;
            "notify::is-global-memory": (pspec: GObject.ParamSpec) => void;
            "notify::native": (pspec: GObject.ParamSpec) => void;
            "notify::native-destroy-func": (pspec: GObject.ParamSpec) => void;
            "notify::owner": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends Object.ConstructorProps {}
    }

    /**
     * This is the ICalParameter instance.
     * @gir-type Class
     */
    class Parameter extends Object {
        static $gtype: GObject.GType<Parameter>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: Parameter.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<Parameter.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        static ["new"](v: ParameterKind): Parameter;

        static new_actionparam(value: ParameterAction): Parameter;

        static new_altrep(value: string): Parameter;

        static new_charset(value: string): Parameter;

        static new_cn(value: string): Parameter;

        static new_cutype(value: ParameterCutype): Parameter;

        static new_delegatedfrom(value: string): Parameter;

        static new_delegatedfrom_list(value: StrArray): Parameter;

        static new_delegatedto(value: string): Parameter;

        static new_delegatedto_list(value: StrArray): Parameter;

        static new_derived(value: ParameterDerived): Parameter;

        static new_dir(value: string): Parameter;

        static new_display(value: ParameterDisplay): Parameter;

        static new_display_list(value: EnumArray): Parameter;

        static new_email(value: string): Parameter;

        static new_enable(value: ParameterEnable): Parameter;

        static new_encoding(value: ParameterEncoding): Parameter;

        static new_fbtype(value: ParameterFbtype): Parameter;

        static new_feature(value: ParameterFeature): Parameter;

        static new_feature_list(value: EnumArray): Parameter;

        static new_filename(value: string): Parameter;

        static new_fmttype(value: string): Parameter;

        static new_from_string(value: string): Parameter;

        static new_from_value_string(kind: ParameterKind, value: string): Parameter;

        static new_gap(value: Duration): Parameter;

        static new_iana(value: string): Parameter;

        static new_id(value: string): Parameter;

        static new_label(value: string): Parameter;

        static new_language(value: string): Parameter;

        static new_latency(value: string): Parameter;

        static new_linkrel(value: string): Parameter;

        static new_local(value: ParameterLocal): Parameter;

        static new_localize(value: string): Parameter;

        static new_managedid(value: string): Parameter;

        static new_member(value: string): Parameter;

        static new_member_list(value: StrArray): Parameter;

        static new_modified(value: string): Parameter;

        static new_options(value: string): Parameter;

        static new_order(value: number): Parameter;

        static new_partstat(value: ParameterPartstat): Parameter;

        static new_patchaction(value: ParameterPatchaction): Parameter;

        static new_publiccomment(value: string): Parameter;

        static new_range(value: ParameterRange): Parameter;

        static new_reason(value: string): Parameter;

        static new_related(value: ParameterRelated): Parameter;

        static new_reltype(value: ParameterReltype): Parameter;

        static new_required(value: ParameterRequired): Parameter;

        static new_response(value: number): Parameter;

        static new_role(value: ParameterRole): Parameter;

        static new_rsvp(value: ParameterRsvp): Parameter;

        static new_scheduleagent(value: ParameterScheduleagent): Parameter;

        static new_scheduleforcesend(value: ParameterScheduleforcesend): Parameter;

        static new_schedulestatus(value: string): Parameter;

        static new_schema(value: string): Parameter;

        static new_sentby(value: string): Parameter;

        static new_size(value: string): Parameter;

        static new_stayinformed(value: ParameterStayinformed): Parameter;

        static new_substate(value: ParameterSubstate): Parameter;

        static new_tzid(value: string): Parameter;

        static new_value(value: ParameterValue): Parameter;

        static new_x(value: string): Parameter;

        static new_xliccomparetype(value: ParameterXliccomparetype): Parameter;

        static new_xlicerrortype(value: ParameterXlicerrortype): Parameter;

        // Signals
        /** @signal */
        connect<K extends keyof Parameter.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Parameter.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof Parameter.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Parameter.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof Parameter.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<Parameter.SignalSignatures[K]>): void;

        // Static methods
        /**
         * Converts the `value` according to RFC 6868, changing the `value` itself.
         * @param value an {@link ICalGLib.Parameter}
         * @since 4.0
         */
        static decode_value(value: string): string;

        /**
         * Converts a string representation of a parameter enum to a its numeric value.
         * @param str a string enum value
         * @since 4.0
         */
        static enum_from_string(str: string): number;

        /**
         * Converts an integer representation of a parameter enum to a string.
         * @param e an enum numeric value
         * @since 4.0
         */
        static enum_to_string(e: number): string;

        /**
         * Converts a string to the {@link ICalGLib.ParameterKind}.
         * @param string The string representation of the {@link ICalGLib.Parameter}
         * @since 1.0
         */
        static kind_from_string(string: string): ParameterKind;

        /**
         * Checks whether {@link ICalGLib.ParameterKind} is valid.
         * @param kind The {@link ICalGLib.ParameterKind}
         * @since 3.0.5
         */
        static kind_is_valid(kind: ParameterKind): boolean;

        /**
         * Converts the {@link ICalGLib.Parameter} to the string representation.
         * @param kind The {@link ICalGLib.ParameterKind} to be converted
         * @since 1.0
         */
        static kind_to_string(kind: ParameterKind): string;

        /**
         * Converts the `kind` into an {@link ICalGLib.ValueKind} and optionally returns whether the `kind` is a multivalued parameter.
         * @param kind The {@link ICalGLib.ParameterKind}
         * @since 4.0
         */
        static kind_value_kind(kind: ParameterKind): [ValueKind, boolean];

        /**
         * Converts the {@link ICalGLib.ParameterValue} to {@link ICalGLib.ValueKind}.
         * @param value A {@link ICalGLib.ParameterValue}
         * @since 1.0
         */
        static value_to_value_kind(value: ParameterValue): ValueKind;

        // Methods
        /**
         * Adds a string into the `self` of DELEGATEDFROM.
         * @param value the string to add into the `self`
         * @since 4.0
         */
        add_delegatedfrom(value: string): void;

        /**
         * Adds a string into the `self` of DELEGATEDTO.
         * @param value the string to add into the `self`
         * @since 4.0
         */
        add_delegatedto(value: string): void;

        /**
         * Adds an element.
         * @param value the {@link ICalGLib.ParameterDisplay}
         * @param x_value an X name, or `null`; when set, the `value` should a corresponding X value
         * @since 4.0
         */
        add_display(value: ParameterDisplay, x_value: string | null): void;

        /**
         * Adds an element.
         * @param value the {@link ICalGLib.ParameterFeature}
         * @param x_value an X name, or `null`; when set, the `value` should a corresponding X value
         * @since 4.0
         */
        add_feature(value: ParameterFeature, x_value: string | null): void;

        /**
         * Adds a string into the `self` of MEMBER.
         * @param value the string to add into the `self`
         * @since 4.0
         */
        add_member(value: string): void;

        /**
         * Converts an {@link ICalGLib.Parameter} to the string representation.
         * @returns The string representation of the `parameter`.
         * @since 1.0
         */
        as_ical_string(): string;

        /**
         * Deep clone a {@link ICalGLib.Parameter}.
         * @returns The newly created {@link ICalGLib.Parameter} with the same properties as the `p`.
         * @since 4.0
         */
        clone(): Parameter;

        /**
         * Returns value of the ACTIONPARAM `self`
         * @returns the ACTIONPARAM value
         * @since 1.0
         */
        get_actionparam(): ParameterAction;

        /**
         * Returns value of the ALTREP `self`
         * @returns the ALTREP value
         * @since 1.0
         */
        get_altrep(): string;

        /**
         * Returns value of the CHARSET `self`
         * @returns the CHARSET value
         * @since 1.0
         */
        get_charset(): string;

        /**
         * Returns value of the CN `self`
         * @returns the CN value
         * @since 1.0
         */
        get_cn(): string;

        /**
         * Returns value of the CUTYPE `self`
         * @returns the CUTYPE value
         * @since 1.0
         */
        get_cutype(): ParameterCutype;

        /**
         * Gets the value of the `self` of DELEGATEDFROM.
         * 
         * Note: this returns copy of the string array, not
         * the one stored in the `self`
         * @returns the {@link ICalGLib.StrArray} value of the `self`
         * @since 4.0
         */
        get_delegatedfrom(): StrArray;

        /**
         * Returns the n-th element of the `self` of DELEGATEDFROM
         * @param position Position of the DELEGATEDFROM item to get
         * @returns n-th element of the DELEGATEDFROM `self`
         * @since 4.0
         */
        get_delegatedfrom_nth(position: bigint | number): string | null;

        /**
         * Returns number of elements in the `self` of DELEGATEDFROM
         * @returns number of elements
         * @since 4.0
         */
        get_delegatedfrom_size(): number;

        /**
         * Gets the value of the `self` of DELEGATEDTO.
         * 
         * Note: this returns copy of the string array, not the
         * one stored in the `self`
         * @returns the {@link ICalGLib.StrArray} value of the `self`
         * @since 4.0
         */
        get_delegatedto(): StrArray;

        /**
         * Returns the n-th element of the `self` of DELEGATEDTO
         * @param position Position of the DELEGATEDTO item to get
         * @returns n-th element of the DELEGATEDTO `self`
         * @since 4.0
         */
        get_delegatedto_nth(position: bigint | number): string | null;

        /**
         * Returns number of elements in the `self` of DELEGATEDTO
         * @returns number of elements
         * @since 4.0
         */
        get_delegatedto_size(): number;

        /**
         * Returns value of the DERIVED `self`
         * @returns the DERIVED value
         * @since 4.0
         */
        get_derived(): ParameterDerived;

        /**
         * Returns value of the DIR `self`
         * @returns the DIR value
         * @since 1.0
         */
        get_dir(): string;

        /**
         * Gets the value of the `self` of DISPLAY.
         * 
         * Note: this returns copy of the array, not the one stored
         * in the `self`
         * @returns the {@link ICalGLib.EnumArray} value of the `self`
         * @since 4.0
         */
        get_display(): EnumArray;

        /**
         * Returns the n-th element of the `self` of DISPLAY
         * @param position the position of the element
         * @returns the n-th element
         * @since 4.0
         */
        get_display_nth(position: bigint | number): ParameterDisplay;

        /**
         * Returns number of elements in the `self` of DISPLAY
         * @returns number of elements
         * @since 4.0
         */
        get_display_size(): number;

        /**
         * Returns value of the EMAIL `self`
         * @returns the EMAIL value
         * @since 3.0.15
         */
        get_email(): string;

        /**
         * Returns value of the ENABLE `self`
         * @returns the ENABLE value
         * @since 1.0
         */
        get_enable(): ParameterEnable;

        /**
         * Returns value of the ENCODING `self`
         * @returns the ENCODING value
         * @since 1.0
         */
        get_encoding(): ParameterEncoding;

        /**
         * Returns value of the FBTYPE `self`
         * @returns the FBTYPE value
         * @since 1.0
         */
        get_fbtype(): ParameterFbtype;

        /**
         * Gets the value of the `self` of FEATURE.
         * 
         * Note: this returns copy of the array, not the one stored
         * in the `self`
         * @returns the {@link ICalGLib.EnumArray} value of the `self`
         * @since 4.0
         */
        get_feature(): EnumArray;

        /**
         * Returns the n-th element of the `self` of FEATURE
         * @param position the position of the element
         * @returns the n-th element
         * @since 4.0
         */
        get_feature_nth(position: bigint | number): ParameterFeature;

        /**
         * Returns number of elements in the `self` of FEATURE
         * @returns number of elements
         * @since 4.0
         */
        get_feature_size(): number;

        /**
         * Returns value of the FILENAME `self`
         * @returns the FILENAME value
         * @since 2.0
         */
        get_filename(): string;

        /**
         * Returns value of the FMTTYPE `self`
         * @returns the FMTTYPE value
         * @since 1.0
         */
        get_fmttype(): string;

        /**
         * Returns value of the GAP `self`
         * @returns the GAP value
         * @since 4.0
         */
        get_gap(): Duration | null;

        /**
         * Returns value of the IANA `self`
         * @returns the IANA value
         * @since 1.0
         */
        get_iana(): string;

        /**
         * Gets the iana_name property of the native part of the {@link ICalGLib.Parameter}.
         * @returns The property of the `value`
         * @since 1.0
         */
        get_iana_name(): string | null;

        /**
         * Gets the iana_value property of the native part of the {@link ICalGLib.Parameter}.
         * @returns The property of the `value`
         * @since 1.0
         */
        get_iana_value(): string | null;

        /**
         * Returns value of the ID `self`
         * @returns the ID value
         * @since 1.0
         */
        get_id(): string;

        /**
         * Returns value of the LABEL `self`
         * @returns the LABEL value
         * @since 3.0.15
         */
        get_label(): string;

        /**
         * Returns value of the LANGUAGE `self`
         * @returns the LANGUAGE value
         * @since 1.0
         */
        get_language(): string;

        /**
         * Returns value of the LATENCY `self`
         * @returns the LATENCY value
         * @since 1.0
         */
        get_latency(): string;

        /**
         * Returns value of the LINKREL `self`
         * @returns the LINKREL value
         * @since 4.0
         */
        get_linkrel(): string;

        /**
         * Returns value of the LOCAL `self`
         * @returns the LOCAL value
         * @since 1.0
         */
        get_local(): ParameterLocal;

        /**
         * Returns value of the LOCALIZE `self`
         * @returns the LOCALIZE value
         * @since 1.0
         */
        get_localize(): string;

        /**
         * Returns value of the MANAGEDID `self`
         * @returns the MANAGEDID value
         * @since 2.0
         */
        get_managedid(): string;

        /**
         * Gets the value of the `self` of MEMBER.
         * 
         * Note: this returns copy of the string array, not the one
         * stored in the `self`
         * @returns the {@link ICalGLib.StrArray} value of the `self`
         * @since 4.0
         */
        get_member(): StrArray;

        /**
         * Returns the n-th element of the `self` of MEMBER
         * @param position Position of the MEMBER item to get
         * @returns n-th element of the MEMBER `self`
         * @since 4.0
         */
        get_member_nth(position: bigint | number): string | null;

        /**
         * Returns number of elements in the `self` of MEMBER
         * @returns number of elements
         * @since 4.0
         */
        get_member_size(): number;

        /**
         * Returns value of the MODIFIED `self`
         * @returns the MODIFIED value
         * @since 2.0
         */
        get_modified(): string;

        /**
         * Returns value of the OPTIONS `self`
         * @returns the OPTIONS value
         * @since 1.0
         */
        get_options(): string;

        /**
         * Returns value of the ORDER `self`
         * @returns the ORDER value
         * @since 4.0
         */
        get_order(): number;

        /**
         * Gets the parent {@link ICalGLib.Property} of the specified {@link ICalGLib.Parameter}.
         * @returns The parent {@link ICalGLib.Property}
         * @since 3.0
         */
        get_parent(): Property | null;

        /**
         * Returns value of the PARTSTAT `self`
         * @returns the PARTSTAT value
         * @since 1.0
         */
        get_partstat(): ParameterPartstat;

        /**
         * Returns value of the PATCHACTION `self`
         * @returns the PATCHACTION value
         * @since 3.0.15
         */
        get_patchaction(): ParameterPatchaction;

        /**
         * Returns value of the PUBLICCOMMENT `self`
         * @returns the PUBLICCOMMENT value
         * @since 2.0
         */
        get_publiccomment(): string;

        /**
         * Returns value of the RANGE `self`
         * @returns the RANGE value
         * @since 1.0
         */
        get_range(): ParameterRange;

        /**
         * Returns value of the REASON `self`
         * @returns the REASON value
         * @since 2.0
         */
        get_reason(): string;

        /**
         * Returns value of the RELATED `self`
         * @returns the RELATED value
         * @since 1.0
         */
        get_related(): ParameterRelated;

        /**
         * Returns value of the RELTYPE `self`
         * @returns the RELTYPE value
         * @since 1.0
         */
        get_reltype(): ParameterReltype;

        /**
         * Returns value of the REQUIRED `self`
         * @returns the REQUIRED value
         * @since 2.0
         */
        get_required(): ParameterRequired;

        /**
         * Returns value of the RESPONSE `self`
         * @returns the RESPONSE value
         * @since 2.0
         */
        get_response(): number;

        /**
         * Returns value of the ROLE `self`
         * @returns the ROLE value
         * @since 1.0
         */
        get_role(): ParameterRole;

        /**
         * Returns value of the RSVP `self`
         * @returns the RSVP value
         * @since 1.0
         */
        get_rsvp(): ParameterRsvp;

        /**
         * Returns value of the SCHEDULEAGENT `self`
         * @returns the SCHEDULEAGENT value
         * @since 1.0
         */
        get_scheduleagent(): ParameterScheduleagent;

        /**
         * Returns value of the SCHEDULEFORCESEND `self`
         * @returns the SCHEDULEFORCESEND value
         * @since 1.0
         */
        get_scheduleforcesend(): ParameterScheduleforcesend;

        /**
         * Returns value of the SCHEDULESTATUS `self`
         * @returns the SCHEDULESTATUS value
         * @since 1.0
         */
        get_schedulestatus(): string;

        /**
         * Returns value of the SCHEMA `self`
         * @returns the SCHEMA value
         * @since 4.0
         */
        get_schema(): string;

        /**
         * Returns value of the SENTBY `self`
         * @returns the SENTBY value
         * @since 1.0
         */
        get_sentby(): string;

        /**
         * Returns value of the SIZE `self`
         * @returns the SIZE value
         * @since 2.0
         */
        get_size(): string;

        /**
         * Returns value of the STAYINFORMED `self`
         * @returns the STAYINFORMED value
         * @since 2.0
         */
        get_stayinformed(): ParameterStayinformed;

        /**
         * Returns value of the SUBSTATE `self`
         * @returns the SUBSTATE value
         * @since 1.0
         */
        get_substate(): ParameterSubstate;

        /**
         * Returns value of the TZID `self`
         * @returns the TZID value
         * @since 1.0
         */
        get_tzid(): string;

        /**
         * Returns value of the VALUE `self`
         * @returns the VALUE value
         * @since 1.0
         */
        get_value(): ParameterValue;

        /**
         * Returns value of the X `self`
         * @returns the X value
         * @since 1.0
         */
        get_x(): string;

        /**
         * Returns value of the XLICCOMPARETYPE `self`
         * @returns the XLICCOMPARETYPE value
         * @since 1.0
         */
        get_xliccomparetype(): ParameterXliccomparetype;

        /**
         * Returns value of the XLICERRORTYPE `self`
         * @returns the XLICERRORTYPE value
         * @since 1.0
         */
        get_xlicerrortype(): ParameterXlicerrortype;

        /**
         * Gets the xname property of the native part of the {@link ICalGLib.Parameter}.
         * @returns The property of the `value`
         * @since 1.0
         */
        get_xname(): string | null;

        /**
         * Gets the xvalue property of the native part of the {@link ICalGLib.Parameter}.
         * @returns The property of the `value`
         * @since 1.0
         */
        get_xvalue(): string | null;

        /**
         * Checks whether native parts of two `ICalParameters` have the same name.
         * @param param2 The {@link ICalGLib.Parameter} to be checked
         * @returns true if the parameters have the same name, false or not.
         * @since 1.0
         */
        has_same_name(param2: Parameter): boolean;

        /**
         * Returns whether the `param` is a multivalued parameter.
         * @returns whether the@param is a multivalued parameter
         * @since 4.0
         */
        is_multivalued(): boolean;

        /**
         * Checks the type of a {@link ICalGLib.Parameter}.
         * @returns The type of the `parameter`.
         * @since 1.0
         */
        isa(): ParameterKind;

        /**
         * Checks whether the native part of the {@link ICalGLib.Parameter} is of type icalparameter.
         * @returns true if the native part is of type icalparameter, false if not.
         * @since 1.0
         */
        isa_parameter(): boolean;

        /**
         * Removes a string from the `self` of DELEGATEDFROM.
         * @param value the string to remove from the `self`
         * @since 4.0
         */
        remove_delegatedfrom(value: string): void;

        /**
         * Removes a string from the `self` of DELEGATEDTO.
         * @param value the string to remove from the `self`
         * @since 4.0
         */
        remove_delegatedto(value: string): void;

        /**
         * Removes an element with the provided value.
         * @param value the {@link ICalGLib.ParameterDisplay}
         * @param x_value an X name, or `null`; when set, the `value` should be a corresponding X value
         * @since 4.0
         */
        remove_display(value: ParameterDisplay, x_value: string | null): void;

        /**
         * Removes an element with the provided value.
         * @param value the {@link ICalGLib.ParameterFeature}
         * @param x_value an X name, or `null`; when set, the `value` should be a corresponding X value
         * @since 4.0
         */
        remove_feature(value: ParameterFeature, x_value: string | null): void;

        /**
         * Removes a string from the `self` of MEMBER.
         * @param value the string to remove from the `self`
         * @since 4.0
         */
        remove_member(value: string): void;

        /**
         * Sets value to the ACTIONPARAM `self`
         * @param value the ACTIONPARAM value
         * @since 1.0
         */
        set_actionparam(value: ParameterAction): void;

        /**
         * Sets value to the ALTREP `self`
         * @param value the ALTREP value
         * @since 1.0
         */
        set_altrep(value: string): void;

        /**
         * Sets value to the CHARSET `self`
         * @param value the CHARSET value
         * @since 1.0
         */
        set_charset(value: string): void;

        /**
         * Sets value to the CN `self`
         * @param value the CN value
         * @since 1.0
         */
        set_cn(value: string): void;

        /**
         * Sets value to the CUTYPE `self`
         * @param value the CUTYPE value
         * @since 1.0
         */
        set_cutype(value: ParameterCutype): void;

        /**
         * Sets the value of the `self` of DELEGATEDFROM.
         * 
         * Note: this uses a copy of the string array, not the
         * one stored in the `value`
         * @param value the string array value
         * @since 4.0
         */
        set_delegatedfrom(value: StrArray): void;

        /**
         * Sets the value of the `self` of DELEGATEDTO.
         * 
         * Note: this uses a copy of the string array, not the
         * one stored in the `value`
         * @param value the string array value
         * @since 4.0
         */
        set_delegatedto(value: StrArray): void;

        /**
         * Sets value to the DERIVED `self`
         * @param value the DERIVED value
         * @since 4.0
         */
        set_derived(value: ParameterDerived): void;

        /**
         * Sets value to the DIR `self`
         * @param value the DIR value
         * @since 1.0
         */
        set_dir(value: string): void;

        /**
         * Sets the value of the `self` of DISPLAY.
         * 
         * Note: this uses a copy of the array, not the one stored
         * in the `value`
         * @param value the array value
         * @since 4.0
         */
        set_display(value: EnumArray): void;

        /**
         * Sets value to the EMAIL `self`
         * @param value the EMAIL value
         * @since 3.0.15
         */
        set_email(value: string): void;

        /**
         * Sets value to the ENABLE `self`
         * @param value the ENABLE value
         * @since 1.0
         */
        set_enable(value: ParameterEnable): void;

        /**
         * Sets value to the ENCODING `self`
         * @param value the ENCODING value
         * @since 1.0
         */
        set_encoding(value: ParameterEncoding): void;

        /**
         * Sets value to the FBTYPE `self`
         * @param value the FBTYPE value
         * @since 1.0
         */
        set_fbtype(value: ParameterFbtype): void;

        /**
         * Sets the value of the `self` of FEATURE.
         * 
         * Note: this uses a copy of the array, not the one stored
         * in the `value`
         * @param value the array value
         * @since 4.0
         */
        set_feature(value: EnumArray): void;

        /**
         * Sets value to the FILENAME `self`
         * @param value the FILENAME value
         * @since 2.0
         */
        set_filename(value: string): void;

        /**
         * Sets value to the FMTTYPE `self`
         * @param value the FMTTYPE value
         * @since 1.0
         */
        set_fmttype(value: string): void;

        /**
         * Sets value to the GAP `self`
         * @param value the GAP value
         * @since 4.0
         */
        set_gap(value: Duration): void;

        /**
         * Sets value to the IANA `self`
         * @param value the IANA value
         * @since 1.0
         */
        set_iana(value: string): void;

        /**
         * Sets the iana_name property of the native part of the {@link ICalGLib.Parameter}.
         * @param v The name to be set into the `param`
         * @since 1.0
         */
        set_iana_name(v: string): void;

        /**
         * Sets the iana_value property of the native part of the {@link ICalGLib.Parameter}.
         * @param v The value to be set into the `param`
         * @since 1.0
         */
        set_iana_value(v: string): void;

        /**
         * Sets value to the ID `self`
         * @param value the ID value
         * @since 1.0
         */
        set_id(value: string): void;

        /**
         * Sets value to the LABEL `self`
         * @param value the LABEL value
         * @since 3.0.15
         */
        set_label(value: string): void;

        /**
         * Sets value to the LANGUAGE `self`
         * @param value the LANGUAGE value
         * @since 1.0
         */
        set_language(value: string): void;

        /**
         * Sets value to the LATENCY `self`
         * @param value the LATENCY value
         * @since 1.0
         */
        set_latency(value: string): void;

        /**
         * Sets value to the LINKREL `self`
         * @param value the LINKREL value
         * @since 4.0
         */
        set_linkrel(value: string): void;

        /**
         * Sets value to the LOCAL `self`
         * @param value the LOCAL value
         * @since 1.0
         */
        set_local(value: ParameterLocal): void;

        /**
         * Sets value to the LOCALIZE `self`
         * @param value the LOCALIZE value
         * @since 1.0
         */
        set_localize(value: string): void;

        /**
         * Sets value to the MANAGEDID `self`
         * @param value the MANAGEDID value
         * @since 2.0
         */
        set_managedid(value: string): void;

        /**
         * Sets the value of the `self` of MEMBER.
         * 
         * Note: this uses a copy of the string array, not the one
         * stored in the `value`
         * @param value the string array value
         * @since 4.0
         */
        set_member(value: StrArray): void;

        /**
         * Sets value to the MODIFIED `self`
         * @param value the MODIFIED value
         * @since 2.0
         */
        set_modified(value: string): void;

        /**
         * Sets value to the OPTIONS `self`
         * @param value the OPTIONS value
         * @since 1.0
         */
        set_options(value: string): void;

        /**
         * Sets value to the ORDER `self`
         * @param value the ORDER value
         * @since 4.0
         */
        set_order(value: number): void;

        /**
         * Sets the parent {@link ICalGLib.Property} of an {@link ICalGLib.Parameter}.
         * @param property The parent {@link ICalGLib.Property}
         * @since 3.0
         */
        set_parent(property: Property | null): void;

        /**
         * Sets value to the PARTSTAT `self`
         * @param value the PARTSTAT value
         * @since 1.0
         */
        set_partstat(value: ParameterPartstat): void;

        /**
         * Sets value to the PATCHACTION `self`
         * @param value the PATCHACTION value
         * @since 3.0.15
         */
        set_patchaction(value: ParameterPatchaction): void;

        /**
         * Sets value to the PUBLICCOMMENT `self`
         * @param value the PUBLICCOMMENT value
         * @since 2.0
         */
        set_publiccomment(value: string): void;

        /**
         * Sets value to the RANGE `self`
         * @param value the RANGE value
         * @since 1.0
         */
        set_range(value: ParameterRange): void;

        /**
         * Sets value to the REASON `self`
         * @param value the REASON value
         * @since 2.0
         */
        set_reason(value: string): void;

        /**
         * Sets value to the RELATED `self`
         * @param value the RELATED value
         * @since 1.0
         */
        set_related(value: ParameterRelated): void;

        /**
         * Sets value to the RELTYPE `self`
         * @param value the RELTYPE value
         * @since 1.0
         */
        set_reltype(value: ParameterReltype): void;

        /**
         * Sets value to the REQUIRED `self`
         * @param value the REQUIRED value
         * @since 2.0
         */
        set_required(value: ParameterRequired): void;

        /**
         * Sets value to the RESPONSE `self`
         * @param value the RESPONSE value
         * @since 2.0
         */
        set_response(value: number): void;

        /**
         * Sets value to the ROLE `self`
         * @param value the ROLE value
         * @since 1.0
         */
        set_role(value: ParameterRole): void;

        /**
         * Sets value to the RSVP `self`
         * @param value the RSVP value
         * @since 1.0
         */
        set_rsvp(value: ParameterRsvp): void;

        /**
         * Sets value to the SCHEDULEAGENT `self`
         * @param value the SCHEDULEAGENT value
         * @since 1.0
         */
        set_scheduleagent(value: ParameterScheduleagent): void;

        /**
         * Sets value to the SCHEDULEFORCESEND `self`
         * @param value the SCHEDULEFORCESEND value
         * @since 1.0
         */
        set_scheduleforcesend(value: ParameterScheduleforcesend): void;

        /**
         * Sets value to the SCHEDULESTATUS `self`
         * @param value the SCHEDULESTATUS value
         * @since 1.0
         */
        set_schedulestatus(value: string): void;

        /**
         * Sets value to the SCHEMA `self`
         * @param value the SCHEMA value
         * @since 4.0
         */
        set_schema(value: string): void;

        /**
         * Sets value to the SENTBY `self`
         * @param value the SENTBY value
         * @since 1.0
         */
        set_sentby(value: string): void;

        /**
         * Sets value to the SIZE `self`
         * @param value the SIZE value
         * @since 2.0
         */
        set_size(value: string): void;

        /**
         * Sets value to the STAYINFORMED `self`
         * @param value the STAYINFORMED value
         * @since 2.0
         */
        set_stayinformed(value: ParameterStayinformed): void;

        /**
         * Sets value to the SUBSTATE `self`
         * @param value the SUBSTATE value
         * @since 1.0
         */
        set_substate(value: ParameterSubstate): void;

        /**
         * Sets value to the TZID `self`
         * @param value the TZID value
         * @since 1.0
         */
        set_tzid(value: string): void;

        /**
         * Sets value to the VALUE `self`
         * @param value the VALUE value
         * @since 1.0
         */
        set_value(value: ParameterValue): void;

        /**
         * Sets value to the X `self`
         * @param value the X value
         * @since 1.0
         */
        set_x(value: string): void;

        /**
         * Sets value to the XLICCOMPARETYPE `self`
         * @param value the XLICCOMPARETYPE value
         * @since 1.0
         */
        set_xliccomparetype(value: ParameterXliccomparetype): void;

        /**
         * Sets value to the XLICERRORTYPE `self`
         * @param value the XLICERRORTYPE value
         * @since 1.0
         */
        set_xlicerrortype(value: ParameterXlicerrortype): void;

        /**
         * Sets the xname property of the native part of the {@link ICalGLib.Parameter}.
         * @param v The name to be set into the `param`
         * @since 1.0
         */
        set_xname(v: string): void;

        /**
         * Sets the xvalue property of the native part of the {@link ICalGLib.Parameter}.
         * @param v The value to be set into the `param`
         * @since 1.0
         */
        set_xvalue(v: string): void;
    }


    namespace Parser {
        // Signal signatures
        interface SignalSignatures extends Object.SignalSignatures {
            "notify::always-destroy": (pspec: GObject.ParamSpec) => void;
            "notify::is-global-memory": (pspec: GObject.ParamSpec) => void;
            "notify::native": (pspec: GObject.ParamSpec) => void;
            "notify::native-destroy-func": (pspec: GObject.ParamSpec) => void;
            "notify::owner": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends Object.ConstructorProps {}
    }

    /**
     * This is the ICalParser instance.
     * @gir-type Class
     */
    class Parser extends Object {
        static $gtype: GObject.GType<Parser>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: Parser.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<Parser.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        static ["new"](): Parser;

        // Signals
        /** @signal */
        connect<K extends keyof Parser.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Parser.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof Parser.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Parser.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof Parser.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<Parser.SignalSignatures[K]>): void;

        // Static methods
        /**
         * Gets the current parser setting how to handle CONTROL characters. `I_CAL_PARSER_CTRL_KEEP` keeps CONTROL
         * characters in content-line, `I_CAL_PARSER_CTRL_OMIT` omits CONTROL characters from content-line and `I_CAL_PARSER_CTRL_ERROR`
         * inserts an X-LIC-ERROR instead of content-line
         * @since 4.0
         */
        static get_ctrl(): ParserCtrl;

        /**
         * Parses the string into a {@link ICalGLib.Component}.
         * @param str The string to be parsed
         * @since 1.0
         */
        static parse_string(str: string): Component;

        /**
         * Sets the parser setting how to handle CONTROL characters. `I_CAL_PARSER_CTRL_KEEP` keeps CONTROL characters
         * in content-line, `I_CAL_PARSER_CTRL_OMIT` omits CONTROL characters from content-line and `I_CAL_PARSER_CTRL_ERROR`
         * inserts an X-LIC-ERROR instead of content-line
         * @param value an {@link ICalGLib.ParserCtrl}
         * @since 4.0
         */
        static set_ctrl(value: ParserCtrl): void;

        // Methods
        /**
         * Add a line at one time into the {@link ICalGLib.Parser} until the parsing is complete and {@link ICalGLib.Component} will be
         * returned.
         * @param str A line of string representation of the {@link ICalGLib.Component}
         * @returns The complete {@link ICalGLib.Component}.
         * @since 1.0
         */
        add_line(str: string | null): Component | null;

        /**
         * We won't get a clean exit if some components did not have an "END" tag. Clear off any component that
         * may be left in the list.
         * @returns The root {@link ICalGLib.Component} in `parser`.
         * @since 1.0
         */
        clean(): Component | null;

        /**
         * Frees a {@link ICalGLib.Parser}.
         * @since 1.0
         */
        free(): void;

        /**
         * Given a line generator function, returns a single iCal content line.
         * @param func A line generator function
         * @returns A single iCal content line.
         * @since 1.0
         */
        get_line(func: ParserLineGenFunc): string;

        /**
         * Gets the state of the target parser.
         * @returns The parser state stored in the {@link ICalGLib.Parser}.
         * @since 1.0
         */
        get_state(): ParserState;

        /**
         * icalparser_parse takes a string that holds the text ( in RFC 2445 format ) and returns a pointer to an
         * {@link ICalGLib.Component}. The caller owns the memory. `func` is a pointer to a function that returns one content
         * line per invocation.
         * @param func The function used to parse
         * @returns The component output by the parser.
         * @since 1.0
         */
        parse(func: ParserLineGenFunc): Component;
    }


    namespace Period {
        // Signal signatures
        interface SignalSignatures extends Object.SignalSignatures {
            "notify::always-destroy": (pspec: GObject.ParamSpec) => void;
            "notify::is-global-memory": (pspec: GObject.ParamSpec) => void;
            "notify::native": (pspec: GObject.ParamSpec) => void;
            "notify::native-destroy-func": (pspec: GObject.ParamSpec) => void;
            "notify::owner": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends Object.ConstructorProps {}
    }

    /**
     * This is the ICalPeriod instance.
     * @gir-type Class
     */
    class Period extends Object {
        static $gtype: GObject.GType<Period>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: Period.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<Period.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        static new_from_string(str: string): Period;

        static new_null_period(): Period;

        // Signals
        /** @signal */
        connect<K extends keyof Period.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Period.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof Period.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Period.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof Period.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<Period.SignalSignatures[K]>): void;

        // Methods
        /**
         * Translates {@link ICalGLib.Period} to string.
         * @returns The string representation of {@link ICalGLib.Period}.
         * @since 1.0
         */
        as_ical_string(): string;

        /**
         * Gets the duration from an {@link ICalGLib.Period}.
         * @returns The duration of `period`.
         * @since 1.0
         */
        get_duration(): Duration;

        /**
         * Gets the end time from an {@link ICalGLib.Period}.
         * @returns The end of `period`.
         * @since 1.0
         */
        get_end(): Time;

        /**
         * Gets the start time from an {@link ICalGLib.Period}.
         * @returns The start of `period`.
         * @since 1.0
         */
        get_start(): Time;

        /**
         * Checks the {@link ICalGLib.Period} is null_period.
         * @returns true if yes, false if not.
         * @since 1.0
         */
        is_null_period(): boolean;

        /**
         * Checks the {@link ICalGLib.Period} is valid_period.
         * @returns true if yes, false if not.
         * @since 1.0
         */
        is_valid_period(): boolean;

        /**
         * Sets the duration of an {@link ICalGLib.Period}.
         * @param duration The duration of `period`
         * @since 1.0
         */
        set_duration(duration: Duration): void;

        /**
         * Sets the end time of an {@link ICalGLib.Period}.
         * @param end The end of `period`
         * @since 1.0
         */
        set_end(end: Time): void;

        /**
         * Sets the start time of an {@link ICalGLib.Period}.
         * @param start The start of `period`
         * @since 1.0
         */
        set_start(start: Time): void;
    }


    namespace PropIter {
        // Signal signatures
        interface SignalSignatures extends Object.SignalSignatures {
            "notify::always-destroy": (pspec: GObject.ParamSpec) => void;
            "notify::is-global-memory": (pspec: GObject.ParamSpec) => void;
            "notify::native": (pspec: GObject.ParamSpec) => void;
            "notify::native-destroy-func": (pspec: GObject.ParamSpec) => void;
            "notify::owner": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends Object.ConstructorProps {}
    }

    /**
     * This is the ICalPropIter instance.
     * @gir-type Class
     */
    class PropIter extends Object {
        static $gtype: GObject.GType<PropIter>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: PropIter.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<PropIter.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        // Signals
        /** @signal */
        connect<K extends keyof PropIter.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, PropIter.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof PropIter.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, PropIter.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof PropIter.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<PropIter.SignalSignatures[K]>): void;

        // Methods
        /**
         * Gets the current {@link ICalGLib.Property} pointed by {@link ICalGLib.PropIter}.
         * @returns A {@link ICalGLib.Property}
         * @since 4.0
         */
        deref(): Property;

        /**
         * @returns true if a valid iterator; false otherwise.
         * @since 4.0
         */
        is_valid(): boolean;

        /**
         * Gets the next {@link ICalGLib.Property} pointed by {@link ICalGLib.PropIter}.
         * @returns A {@link ICalGLib.Property}
         * @since 4.0
         */
        next(): Property;
    }


    namespace Property {
        // Signal signatures
        interface SignalSignatures extends Object.SignalSignatures {
            "notify::always-destroy": (pspec: GObject.ParamSpec) => void;
            "notify::is-global-memory": (pspec: GObject.ParamSpec) => void;
            "notify::native": (pspec: GObject.ParamSpec) => void;
            "notify::native-destroy-func": (pspec: GObject.ParamSpec) => void;
            "notify::owner": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends Object.ConstructorProps {}
    }

    /**
     * This is the ICalProperty instance.
     * @gir-type Class
     */
    class Property extends Object {
        static $gtype: GObject.GType<Property>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: Property.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<Property.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        static ["new"](kind: PropertyKind): Property;

        static new_acceptresponse(value: string): Property;

        static new_acknowledged(value: Time): Property;

        static new_action(value: PropertyAction): Property;

        static new_allowconflict(value: string): Property;

        static new_attach(value: Attach): Property;

        static new_attendee(value: string): Property;

        static new_busytype(value: PropertyBusytype): Property;

        static new_calendaraddress(value: string): Property;

        static new_calid(value: string): Property;

        static new_calmaster(value: string): Property;

        static new_calscale(value: string): Property;

        static new_capversion(value: string): Property;

        static new_carid(value: string): Property;

        static new_carlevel(value: PropertyCarlevel): Property;

        static new_categories(value: string): Property;

        static new_class(value: PropertyClassenum): Property;

        static new_cmd(value: PropertyCmd): Property;

        static new_color(value: string): Property;

        static new_comment(value: string): Property;

        static new_completed(value: Time): Property;

        static new_components(value: string): Property;

        static new_concept(value: string): Property;

        static new_conference(value: string): Property;

        static new_contact(value: string): Property;

        static new_created(value: Time): Property;

        static new_csid(value: string): Property;

        static new_datemax(value: Time): Property;

        static new_datemin(value: Time): Property;

        static new_decreed(value: string): Property;

        static new_defaultcharset(value: string): Property;

        static new_defaultlocale(value: string): Property;

        static new_defaulttzid(value: string): Property;

        static new_defaultvcars(value: string): Property;

        static new_deny(value: string): Property;

        static new_description(value: string): Property;

        static new_dtend(value: Time): Property;

        static new_dtstamp(value: Time): Property;

        static new_dtstart(value: Time): Property;

        static new_due(value: Time): Property;

        static new_duration(value: Duration): Property;

        static new_estimatedduration(value: Duration): Property;

        static new_exdate(value: Time): Property;

        static new_expand(value: number): Property;

        static new_exrule(value: Recurrence): Property;

        static new_freebusy(value: Period): Property;

        static new_from_string(str: string): Property;

        static new_geo(value: Geo): Property;

        static new_grant(value: string): Property;

        static new_iana(value: string): Property;

        static new_image(value: Attach): Property;

        static new_itipversion(value: string): Property;

        static new_lastmodified(value: Time): Property;

        static new_link(value: string): Property;

        static new_location(value: string): Property;

        static new_locationtype(value: string): Property;

        static new_maxcomponentsize(value: number): Property;

        static new_maxdate(value: Time): Property;

        static new_maxresults(value: number): Property;

        static new_maxresultssize(value: number): Property;

        static new_method(value: PropertyMethod): Property;

        static new_mindate(value: Time): Property;

        static new_multipart(value: string): Property;

        static new_name(value: string): Property;

        static new_organizer(value: string): Property;

        static new_owner(value: string): Property;

        static new_participanttype(value: PropertyParticipanttype): Property;

        static new_patchdelete(value: string): Property;

        static new_patchorder(value: number): Property;

        static new_patchparameter(value: string): Property;

        static new_patchtarget(value: string): Property;

        static new_patchversion(value: string): Property;

        static new_percentcomplete(value: number): Property;

        static new_permission(value: string): Property;

        static new_pollcompletion(value: PropertyPollcompletion): Property;

        static new_pollitemid(value: number): Property;

        static new_pollmode(value: PropertyPollmode): Property;

        static new_pollproperties(value: string): Property;

        static new_pollwinner(value: number): Property;

        static new_priority(value: number): Property;

        static new_prodid(value: string): Property;

        static new_proximity(value: PropertyProximity): Property;

        static new_query(value: string): Property;

        static new_queryid(value: string): Property;

        static new_querylevel(value: PropertyQuerylevel): Property;

        static new_queryname(value: string): Property;

        static new_rdate(value: Datetimeperiod): Property;

        static new_recuraccepted(value: string): Property;

        static new_recurexpand(value: string): Property;

        static new_recurlimit(value: string): Property;

        static new_recurrenceid(value: Time): Property;

        static new_refid(value: string): Property;

        static new_refreshinterval(value: Duration): Property;

        static new_relatedto(value: string): Property;

        static new_relcalid(value: string): Property;

        static new_repeat(value: number): Property;

        static new_replyurl(value: string): Property;

        static new_requeststatus(value: Reqstat): Property;

        static new_resources(value: string): Property;

        static new_resourcetype(value: PropertyResourcetype): Property;

        static new_response(value: number): Property;

        static new_restriction(value: string): Property;

        static new_rrule(value: Recurrence): Property;

        static new_scope(value: string): Property;

        static new_sequence(value: number): Property;

        static new_source(value: string): Property;

        static new_status(value: PropertyStatus): Property;

        static new_storesexpanded(value: string): Property;

        static new_structureddata(value: Attach): Property;

        static new_styleddescription(value: string): Property;

        static new_summary(value: string): Property;

        static new_target(value: string): Property;

        static new_taskmode(value: PropertyTaskmode): Property;

        static new_transp(value: PropertyTransp): Property;

        static new_trigger(value: Trigger): Property;

        static new_tzid(value: string): Property;

        static new_tzidaliasof(value: string): Property;

        static new_tzname(value: string): Property;

        static new_tzoffsetfrom(value: number): Property;

        static new_tzoffsetto(value: number): Property;

        static new_tzuntil(value: Time): Property;

        static new_tzurl(value: string): Property;

        static new_uid(value: string): Property;

        static new_url(value: string): Property;

        static new_version(value: string): Property;

        static new_voter(value: string): Property;

        static new_x(value: string): Property;

        static new_xlicclass(value: PropertyXlicclass): Property;

        static new_xlicclustercount(value: string): Property;

        static new_xlicerror(value: string): Property;

        static new_xlicmimecharset(value: string): Property;

        static new_xlicmimecid(value: string): Property;

        static new_xlicmimecontenttype(value: string): Property;

        static new_xlicmimeencoding(value: string): Property;

        static new_xlicmimefilename(value: string): Property;

        static new_xlicmimeoptinfo(value: string): Property;

        // Signals
        /** @signal */
        connect<K extends keyof Property.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Property.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof Property.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Property.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof Property.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<Property.SignalSignatures[K]>): void;

        // Static methods
        /**
         * Converts the string to {@link ICalGLib.PropertyAction}.
         * @param str A string
         * @since 4.0
         */
        static action_from_string(str: string): PropertyAction;

        /**
         * Converts the {@link ICalGLib.PropertyAction} to string.
         * @param value The {@link ICalGLib.PropertyAction}
         * @since 4.0
         */
        static action_to_string(value: PropertyAction): string;

        /**
         * Converts the string to {@link ICalGLib.PropertyClassenum}.
         * @param str A string
         * @since 4.0
         */
        static classenum_from_string(str: string): PropertyClassenum;

        /**
         * Converts the {@link ICalGLib.PropertyClassenum} to string.
         * @param value The {@link ICalGLib.PropertyClassenum}
         * @since 4.0
         */
        static classenum_to_string(value: PropertyClassenum): string;

        /**
         * Converts the enum to string.
         * @param e The enum to be converted
         * @since 1.0
         */
        static enum_to_string(e: number): string;

        /**
         * Returns true if empty properties are allowed.
         * @since 4.0
         */
        static get_allow_empty_properties(): boolean;

        /**
         * Converts an integer and string into an enum.
         * @param kind The kind
         * @param str A string
         * @since 1.0
         */
        static kind_and_string_to_enum(kind: number, str: string): number;

        /**
         * Converts the string to {@link ICalGLib.PropertyKind}.
         * @param string A string representing {@link ICalGLib.PropertyKind}
         * @since 1.0
         */
        static kind_from_string(string: string): PropertyKind;

        /**
         * Checks whether the enum belongs to the {@link ICalGLib.PropertyKind}.
         * @param kind A {@link ICalGLib.PropertyKind}
         * @param e The enum to be checked
         * @since 1.0
         */
        static kind_has_property(kind: PropertyKind, e: number): boolean;

        /**
         * Checks whether {@link ICalGLib.PropertyKind} is valid.
         * @param kind The {@link ICalGLib.PropertyKind}
         * @since 1.0
         */
        static kind_is_valid(kind: PropertyKind): boolean;

        /**
         * Converts the {@link ICalGLib.PropertyKind} to a string.
         * @param kind A {@link ICalGLib.PropertyKind}
         * @since 1.0
         */
        static kind_to_string(kind: PropertyKind): string;

        /**
         * Converts the {@link ICalGLib.PropertyKind} to {@link ICalGLib.ValueKind}.
         * @param kind A {@link ICalGLib.PropertyKind}
         * @since 1.0
         */
        static kind_to_value_kind(kind: PropertyKind): ValueKind;

        /**
         * Converts the string to {@link ICalGLib.PropertyKind}.
         * @param str A string
         * @since 1.0
         */
        static method_from_string(str: string): PropertyMethod;

        /**
         * Converts the {@link ICalGLib.PropertyMethod} to string.
         * @param method The {@link ICalGLib.PropertyMethod}
         * @since 1.0
         */
        static method_to_string(method: PropertyMethod): string;

        /**
         * Converts the string to {@link ICalGLib.PropertyParticipanttype}.
         * @param str A string
         * @since 4.0
         */
        static participanttype_from_string(str: string): PropertyParticipanttype;

        /**
         * Converts the {@link ICalGLib.PropertyParticipanttype} to string.
         * @param value The {@link ICalGLib.PropertyParticipanttype}
         * @since 4.0
         */
        static participanttype_to_string(value: PropertyParticipanttype): string;

        /**
         * Decides if this recurrence is acceptable. This function decides if a specific recurrence value is excluded
         * by EXRULE or EXDATE properties.
         * @param comp A {@link ICalGLib.Component}
         * @param dtstart The base dtstart value for this component
         * @param recurtime The time to test against
         * @since 1.0
         */
        static recurrence_is_excluded(comp: Component, dtstart: Time, recurtime: Time): boolean;

        /**
         * Converts the string to {@link ICalGLib.PropertyResourcetype}.
         * @param str A string
         * @since 4.0
         */
        static resourcetype_from_string(str: string): PropertyResourcetype;

        /**
         * Converts the {@link ICalGLib.PropertyResourcetype} to string.
         * @param value The {@link ICalGLib.PropertyResourcetype}
         * @since 4.0
         */
        static resourcetype_to_string(value: PropertyResourcetype): string;

        /**
         * Sets if empty properties are allowed.
         * @param value value to set
         * @since 4.0
         */
        static set_allow_empty_properties(value: boolean): void;

        /**
         * Converts the string to {@link ICalGLib.PropertyKind}.
         * @param str A string
         * @since 1.0
         */
        static status_from_string(str: string): PropertyStatus;

        /**
         * Converts the {@link ICalGLib.PropertyStatus} to string.
         * @param method The {@link ICalGLib.PropertyStatus}
         * @since 1.0
         */
        static status_to_string(method: PropertyStatus): string;

        /**
         * Converts the string to {@link ICalGLib.PropertyTransp}.
         * @param str A string
         * @since 4.0
         */
        static transp_from_string(str: string): PropertyTransp;

        /**
         * Converts the {@link ICalGLib.PropertyTransp} to string.
         * @param value The {@link ICalGLib.PropertyTransp}
         * @since 4.0
         */
        static transp_to_string(value: PropertyTransp): string;

        // Methods
        /**
         * Adds a {@link ICalGLib.Parameter} into the {@link ICalGLib.Property}. It behaves like set the copy of the {@link ICalGLib.Parameter}. Upon
         * completion the native part of {@link ICalGLib.Parameter} will be set to NULL.
         * @param parameter The parameter to be added into `prop`
         * @since 1.0
         */
        add_parameter(parameter: Parameter): void;

        /**
         * Converts a {@link ICalGLib.Property} to a string representation.
         * @returns The string representation of `prop`.
         * @since 1.0
         */
        as_ical_string(): string;

        /**
         * Gets the {@link ICalGLib.ParamIter} pointing to the first parameter of type `kind` in {@link ICalGLib.Component}.
         * @param kind A {@link ICalGLib.ParameterKind}
         * @returns A {@link ICalGLib.ParamIter}
         * @since 4.0
         */
        begin_parameter(kind: ParameterKind): ParamIter;

        /**
         * Deeply clone a {@link ICalGLib.Property}.
         * @returns The newly created {@link ICalGLib.Property} deeply cloned from `prop`.
         * @since 4.0
         */
        clone(): Property;

        /**
         * Counts the parameters in the {@link ICalGLib.Property}.
         * @returns The count of the parameters in the {@link ICalGLib.Property}.
         * @since 1.0
         */
        count_parameters(): number;

        /**
         * Returns value of the ACCEPTRESPONSE `self`
         * @returns the ACCEPTRESPONSE value
         * @since 2.0
         */
        get_acceptresponse(): string;

        /**
         * Returns value of the ACKNOWLEDGED `self`
         * @returns the ACKNOWLEDGED value
         * @since 1.0
         */
        get_acknowledged(): Time;

        /**
         * Returns value of the ACTION `self`
         * @returns the ACTION value
         * @since 1.0
         */
        get_action(): PropertyAction;

        /**
         * Returns value of the ALLOWCONFLICT `self`
         * @returns the ALLOWCONFLICT value
         * @since 1.0
         */
        get_allowconflict(): string;

        /**
         * Returns value of the ATTACH `self`
         * @returns the ATTACH value
         * @since 1.0
         */
        get_attach(): Attach;

        /**
         * Returns value of the ATTENDEE `self`
         * @returns the ATTENDEE value
         * @since 1.0
         */
        get_attendee(): string;

        /**
         * Returns value of the BUSYTYPE `self`
         * @returns the BUSYTYPE value
         * @since 2.0
         */
        get_busytype(): PropertyBusytype;

        /**
         * Returns value of the CALENDARADDRESS `self`
         * @returns the CALENDARADDRESS value
         * @since 4.0
         */
        get_calendaraddress(): string;

        /**
         * Returns value of the CALID `self`
         * @returns the CALID value
         * @since 1.0
         */
        get_calid(): string;

        /**
         * Returns value of the CALMASTER `self`
         * @returns the CALMASTER value
         * @since 1.0
         */
        get_calmaster(): string;

        /**
         * Returns value of the CALSCALE `self`
         * @returns the CALSCALE value
         * @since 1.0
         */
        get_calscale(): string;

        /**
         * Returns value of the CAPVERSION `self`
         * @returns the CAPVERSION value
         * @since 1.0
         */
        get_capversion(): string;

        /**
         * Returns value of the CARID `self`
         * @returns the CARID value
         * @since 1.0
         */
        get_carid(): string;

        /**
         * Returns value of the CARLEVEL `self`
         * @returns the CARLEVEL value
         * @since 1.0
         */
        get_carlevel(): PropertyCarlevel;

        /**
         * Returns value of the CATEGORIES `self`
         * @returns the CATEGORIES value
         * @since 1.0
         */
        get_categories(): string;

        /**
         * Returns value of the CLASS `self`
         * @returns the CLASS value
         * @since 1.0
         */
        get_class(): PropertyClassenum;

        /**
         * Returns value of the CMD `self`
         * @returns the CMD value
         * @since 1.0
         */
        get_cmd(): PropertyCmd;

        /**
         * Returns value of the COLOR `self`
         * @returns the COLOR value
         * @since 3.0.5
         */
        get_color(): string;

        /**
         * Returns value of the COMMENT `self`
         * @returns the COMMENT value
         * @since 1.0
         */
        get_comment(): string;

        /**
         * Returns value of the COMPLETED `self`
         * @returns the COMPLETED value
         * @since 1.0
         */
        get_completed(): Time;

        /**
         * Returns value of the COMPONENTS `self`
         * @returns the COMPONENTS value
         * @since 1.0
         */
        get_components(): string;

        /**
         * Returns value of the CONCEPT `self`
         * @returns the CONCEPT value
         * @since 4.0
         */
        get_concept(): string;

        /**
         * Returns value of the CONFERENCE `self`
         * @returns the CONFERENCE value
         * @since 4.0
         */
        get_conference(): string;

        /**
         * Returns value of the CONTACT `self`
         * @returns the CONTACT value
         * @since 1.0
         */
        get_contact(): string;

        /**
         * Returns value of the CREATED `self`
         * @returns the CREATED value
         * @since 1.0
         */
        get_created(): Time;

        /**
         * Returns value of the CSID `self`
         * @returns the CSID value
         * @since 1.0
         */
        get_csid(): string;

        /**
         * Returns value of the DATEMAX `self`
         * @returns the DATEMAX value
         * @since 1.0
         */
        get_datemax(): Time;

        /**
         * Returns value of the DATEMIN `self`
         * @returns the DATEMIN value
         * @since 1.0
         */
        get_datemin(): Time;

        /**
         * If the property is a DATE-TIME with a TZID parameter and a corresponding VTIMEZONE is present in the
         * component, the returned component will already be in the correct timezone; otherwise the caller is responsible
         * for converting it.
         * 
         * The `comp` can be NULL, in which case the parent of the `prop` is used to find
         * the corresponding time zone.
         * @param comp An {@link ICalGLib.Component}
         * @returns Get a DATE or DATE-TIME property as an {@link ICalGLib.Time}.
         * @since 3.0.5
         */
        get_datetime_with_component(comp: Component | null): Time;

        /**
         * Returns value of the DECREED `self`
         * @returns the DECREED value
         * @since 1.0
         */
        get_decreed(): string;

        /**
         * Returns value of the DEFAULTCHARSET `self`
         * @returns the DEFAULTCHARSET value
         * @since 1.0
         */
        get_defaultcharset(): string;

        /**
         * Returns value of the DEFAULTLOCALE `self`
         * @returns the DEFAULTLOCALE value
         * @since 1.0
         */
        get_defaultlocale(): string;

        /**
         * Returns value of the DEFAULTTZID `self`
         * @returns the DEFAULTTZID value
         * @since 1.0
         */
        get_defaulttzid(): string;

        /**
         * Returns value of the DEFAULTVCARS `self`
         * @returns the DEFAULTVCARS value
         * @since 1.0
         */
        get_defaultvcars(): string;

        /**
         * Returns value of the deny `self`
         * @returns the deny value
         * @since 1.0
         */
        get_deny(): string;

        /**
         * Returns value of the description `self`
         * @returns the description value
         * @since 1.0
         */
        get_description(): string;

        /**
         * Returns value of the DTEND `self`
         * @returns the DTEND value
         * @since 1.0
         */
        get_dtend(): Time;

        /**
         * Returns value of the DTSTAMP `self`
         * @returns the DTSTAMP value
         * @since 1.0
         */
        get_dtstamp(): Time;

        /**
         * Returns value of the DTSTART `self`
         * @returns the DTSTART value
         * @since 1.0
         */
        get_dtstart(): Time;

        /**
         * Returns value of the DUE `self`
         * @returns the DUE value
         * @since 1.0
         */
        get_due(): Time;

        /**
         * Returns value of the DURATION `self`
         * @returns the DURATION value
         * @since 1.0
         */
        get_duration(): Duration;

        /**
         * Returns value of the ESTIMATEDDURATION `self`
         * @returns the ESTIMATEDDURATION value
         * @since 1.0
         */
        get_estimatedduration(): Duration;

        /**
         * Returns value of the EXDATE `self`
         * @returns the EXDATE value
         * @since 1.0
         */
        get_exdate(): Time;

        /**
         * Returns value of the EXPAND `self`
         * @returns the EXPAND value
         * @since 1.0
         */
        get_expand(): number;

        /**
         * Returns value of the EXRULE `self`
         * @returns the EXRULE value
         * @since 1.0
         */
        get_exrule(): Recurrence;

        /**
         * Gets the first {@link ICalGLib.Parameter} from the parent {@link ICalGLib.Property}.
         * @param kind The target kind of {@link ICalGLib.Parameter} to be retrieved
         * @returns The first {@link ICalGLib.Parameter} of `prop`.
         * @since 1.0
         */
        get_first_parameter(kind: ParameterKind): Parameter;

        /**
         * Returns value of the FREEBUSY `self`
         * @returns the FREEBUSY value
         * @since 1.0
         */
        get_freebusy(): Period;

        /**
         * Returns value of the GEO `self`
         * @returns the GEO value
         * @since 1.0
         */
        get_geo(): Geo;

        /**
         * Returns value of the GRANT `self`
         * @returns the GRANT value
         * @since 1.0
         */
        get_grant(): string;

        /**
         * Returns value of the IANA `self`
         * @returns the IANA value
         * @since 3.1
         */
        get_iana(): string;

        /**
         * Gets the IANA name of the {@link ICalGLib.Property}.
         * @returns The IANA property name.
         * @since 4.0
         */
        get_iana_name(): string | null;

        /**
         * Returns value of the IMAGE `self`
         * @returns the IMAGE value
         * @since 4.0
         */
        get_image(): Attach;

        /**
         * Returns value of the ITIPVERSION `self`
         * @returns the ITIPVERSION value
         * @since 1.0
         */
        get_itipversion(): string;

        /**
         * Returns value of the LASTMODIFIED `self`
         * @returns the LASTMODIFIED value
         * @since 1.0
         */
        get_lastmodified(): Time;

        /**
         * Returns value of the LINK `self`
         * @returns the LINK value
         * @since 4.0
         */
        get_link(): string;

        /**
         * Returns value of the LOCATION `self`
         * @returns the LOCATION value
         * @since 1.0
         */
        get_location(): string;

        /**
         * Returns value of the LOCATIONTYPE `self`
         * @returns the LOCATIONTYPE value
         * @since 4.0
         */
        get_locationtype(): string;

        /**
         * Returns value of the MAXCOMPONENTSIZE `self`
         * @returns the MAXCOMPONENTSIZE value
         * @since 1.0
         */
        get_maxcomponentsize(): number;

        /**
         * Returns value of the MAXDATE `self`
         * @returns the MAXDATE value
         * @since 1.0
         */
        get_maxdate(): Time;

        /**
         * Returns value of the MAXRESULTS `self`
         * @returns the MAXRESULTS value
         * @since 1.0
         */
        get_maxresults(): number;

        /**
         * Returns value of the MAXRESULTSSIZE `self`
         * @returns the MAXRESULTSSIZE value
         * @since 1.0
         */
        get_maxresultssize(): number;

        /**
         * Returns value of the METHOD `self`
         * @returns the METHOD value
         * @since 1.0
         */
        get_method(): PropertyMethod;

        /**
         * Returns value of the MINDATE `self`
         * @returns the MINDATE value
         * @since 1.0
         */
        get_mindate(): Time;

        /**
         * Returns value of the MULTIPART `self`
         * @returns the MULTIPART value
         * @since 1.0
         */
        get_multipart(): string;

        /**
         * Returns value of the NAME `self`
         * @returns the NAME value
         * @since 1.0
         */
        get_name(): string;

        /**
         * Gets the next {@link ICalGLib.Parameter} from the parent {@link ICalGLib.Property}.
         * @param kind The target kind of {@link ICalGLib.Parameter} to be retrieved
         * @returns The next {@link ICalGLib.Parameter} of `prop`.
         * @since 1.0
         */
        get_next_parameter(kind: ParameterKind): Parameter;

        /**
         * Returns value of the ORGANIZER `self`
         * @returns the ORGANIZER value
         * @since 1.0
         */
        get_organizer(): string;

        /**
         * Returns value of the OWNER `self`
         * @returns the OWNER value
         * @since 1.0
         */
        get_owner(): string;

        /**
         * Gets the string representation of the target parameter in the {@link ICalGLib.Property}.
         * @param name The name of the target parameter
         * @returns The string representation of the parameter.
         * @since 1.0
         */
        get_parameter_as_string(name: string): string;

        /**
         * Gets the parent component of the property. Use with caution. When icalproperty is deallocated, it won't
         * deallocate its parent. However the {@link ICalGLib.Component} object created using this method will be deallocated
         * (if no reference in other places). So You need to make sure there is another reference except the one
         * in {@link ICalGLib.Property}.
         * @returns The parent {@link ICalGLib.Component} of {@link ICalGLib.Property}.
         * @since 2.0
         */
        get_parent(): Component | null;

        /**
         * Returns value of the PARTICIPANTTYPE `self`
         * @returns the PARTICIPANTTYPE value
         * @since 4.0
         */
        get_participanttype(): PropertyParticipanttype;

        /**
         * Returns value of the PATCHDELETE `self`
         * @returns the PATCHDELETE value
         * @since 4.0
         */
        get_patchdelete(): string;

        /**
         * Returns value of the PATCHORDER `self`
         * @returns the PATCHORDER value
         * @since 4.0
         */
        get_patchorder(): number;

        /**
         * Returns value of the PATCHPARAMETER `self`
         * @returns the PATCHPARAMETER value
         * @since 4.0
         */
        get_patchparameter(): string;

        /**
         * Returns value of the PATCHTARGET `self`
         * @returns the PATCHTARGET value
         * @since 4.0
         */
        get_patchtarget(): string;

        /**
         * Returns value of the PATCHVERSION `self`
         * @returns the PATCHVERSION value
         * @since 4.0
         */
        get_patchversion(): string;

        /**
         * Returns value of the PERCENTCOMPLETE `self`
         * @returns the PERCENTCOMPLETE value
         * @since 1.0
         */
        get_percentcomplete(): number;

        /**
         * Returns value of the PERMISSION `self`
         * @returns the PERMISSION value
         * @since 1.0
         */
        get_permission(): string;

        /**
         * Returns value of the POLLCOMPLETION `self`
         * @returns the POLLCOMPLETION value
         * @since 1.0
         */
        get_pollcompletion(): PropertyPollcompletion;

        /**
         * Returns value of the POLLITEMID `self`
         * @returns the POLLITEMID value
         * @since 1.0
         */
        get_pollitemid(): number;

        /**
         * Returns value of the POLLMODE `self`
         * @returns the POLLMODE value
         * @since 1.0
         */
        get_pollmode(): PropertyPollmode;

        /**
         * Returns value of the POLLPROPERTIES `self`
         * @returns the POLLPROPERTIES value
         * @since 1.0
         */
        get_pollproperties(): string;

        /**
         * Returns value of the POLLWINNER `self`
         * @returns the POLLWINNER value
         * @since 1.0
         */
        get_pollwinner(): number;

        /**
         * Returns value of the PRIORITY `self`
         * @returns the PRIORITY value
         * @since 1.0
         */
        get_priority(): number;

        /**
         * Returns value of the PRODID `self`
         * @returns the PRODID value
         * @since 1.0
         */
        get_prodid(): string;

        /**
         * Gets the property name of {@link ICalGLib.Property}.
         * @returns Property name of {@link ICalGLib.Property}.
         * @since 1.0
         */
        get_property_name(): string;

        /**
         * Returns value of the PROXIMITY `self`
         * @returns the PROXIMITY value
         * @since 4.0
         */
        get_proximity(): PropertyProximity;

        /**
         * Returns value of the QUERY `self`
         * @returns the QUERY value
         * @since 1.0
         */
        get_query(): string;

        /**
         * Returns value of the QUERYID `self`
         * @returns the QUERYID value
         * @since 1.0
         */
        get_queryid(): string;

        /**
         * Returns value of the QUERYLEVEL `self`
         * @returns the QUERYLEVEL value
         * @since 1.0
         */
        get_querylevel(): PropertyQuerylevel;

        /**
         * Returns value of the QUERYNAME `self`
         * @returns the QUERYNAME value
         * @since 1.0
         */
        get_queryname(): string;

        /**
         * Returns value of the RDATE `self`
         * @returns the RDATE value
         * @since 1.0
         */
        get_rdate(): Datetimeperiod;

        /**
         * Returns value of the RECURACCEPTED `self`
         * @returns the RECURACCEPTED value
         * @since 1.0
         */
        get_recuraccepted(): string;

        /**
         * Returns value of the RECUREXPAND `self`
         * @returns the RECUREXPAND value
         * @since 1.0
         */
        get_recurexpand(): string;

        /**
         * Returns value of the RECURLIMIT `self`
         * @returns the RECURLIMIT value
         * @since 1.0
         */
        get_recurlimit(): string;

        /**
         * Returns value of the RECURRENCEID `self`
         * @returns the RECURRENCEID value
         * @since 1.0
         */
        get_recurrenceid(): Time;

        /**
         * Returns value of the REFID `self`
         * @returns the REFID value
         * @since 4.0
         */
        get_refid(): string;

        /**
         * Returns value of the REFRESHINTERVAL `self`
         * @returns the REFRESHINTERVAL value
         * @since 4.0
         */
        get_refreshinterval(): Duration;

        /**
         * Returns value of the RELATEDTO `self`
         * @returns the RELATEDTO value
         * @since 1.0
         */
        get_relatedto(): string;

        /**
         * Returns value of the RELCALID `self`
         * @returns the RELCALID value
         * @since 1.0
         */
        get_relcalid(): string;

        /**
         * Returns value of the REPEAT `self`
         * @returns the REPEAT value
         * @since 1.0
         */
        get_repeat(): number;

        /**
         * Returns value of the REPLYURL `self`
         * @returns the REPLYURL value
         * @since 2.0
         */
        get_replyurl(): string;

        /**
         * Returns value of the REQUESTSTATUS `self`
         * @returns the REQUESTSTATUS value
         * @since 1.0
         */
        get_requeststatus(): Reqstat;

        /**
         * Returns value of the RESOURCES `self`
         * @returns the RESOURCES value
         * @since 1.0
         */
        get_resources(): string;

        /**
         * Returns value of the RESOURCETYPE `self`
         * @returns the RESOURCETYPE value
         * @since 4.0
         */
        get_resourcetype(): PropertyResourcetype;

        /**
         * Returns value of the RESPONSE `self`
         * @returns the RESPONSE value
         * @since 2.0
         */
        get_response(): number;

        /**
         * Returns value of the RESTRICTION `self`
         * @returns the RESTRICTION value
         * @since 1.0
         */
        get_restriction(): string;

        /**
         * Returns value of the RRULE `self`
         * @returns the RRULE value
         * @since 1.0
         */
        get_rrule(): Recurrence;

        /**
         * Returns value of the SCOPE `self`
         * @returns the SCOPE value
         * @since 1.0
         */
        get_scope(): string;

        /**
         * Returns value of the SEQUENCE `self`
         * @returns the SEQUENCE value
         * @since 1.0
         */
        get_sequence(): number;

        /**
         * Returns value of the SOURCE `self`
         * @returns the SOURCE value
         * @since 4.0
         */
        get_source(): string;

        /**
         * Returns value of the STATUS `self`
         * @returns the STATUS value
         * @since 1.0
         */
        get_status(): PropertyStatus;

        /**
         * Returns value of the STORESEXPANDED `self`
         * @returns the STORESEXPANDED value
         * @since 1.0
         */
        get_storesexpanded(): string;

        /**
         * Returns value of the STRUCTUREDDATA `self`
         * @returns the STRUCTUREDDATA value
         * @since 4.0
         */
        get_structureddata(): Attach;

        /**
         * Returns value of the STYLEDDESCRIPTION `self`
         * @returns the STYLEDDESCRIPTION value
         * @since 4.0
         */
        get_styleddescription(): string;

        /**
         * Returns value of the SUMMARY `self`
         * @returns the SUMMARY value
         * @since 1.0
         */
        get_summary(): string;

        /**
         * Returns value of the TARGET `self`
         * @returns the TARGET value
         * @since 1.0
         */
        get_target(): string;

        /**
         * Returns value of the TASKMODE `self`
         * @returns the TASKMODE value
         * @since 2.0
         */
        get_taskmode(): PropertyTaskmode;

        /**
         * Returns value of the TRANSP `self`
         * @returns the TRANSP value
         * @since 1.0
         */
        get_transp(): PropertyTransp;

        /**
         * Returns value of the TRIGGER `self`
         * @returns the TRIGGER value
         * @since 1.0
         */
        get_trigger(): Trigger;

        /**
         * Returns value of the TZID `self`
         * @returns the TZID value
         * @since 1.0
         */
        get_tzid(): string;

        /**
         * Returns value of the TZIDALIASOF `self`
         * @returns the TZIDALIASOF value
         * @since 2.0
         */
        get_tzidaliasof(): string;

        /**
         * Returns value of the TZNAME `self`
         * @returns the TZNAME value
         * @since 1.0
         */
        get_tzname(): string;

        /**
         * Returns value of the TZOFFSETFROM `self`
         * @returns the TZOFFSETFROM value
         * @since 1.0
         */
        get_tzoffsetfrom(): number;

        /**
         * Returns value of the TZOFFSETTO `self`
         * @returns the TZOFFSETTO value
         * @since 1.0
         */
        get_tzoffsetto(): number;

        /**
         * Returns value of the TZUNTIL `self`
         * @returns the TZUNTIL value
         * @since 2.0
         */
        get_tzuntil(): Time;

        /**
         * Returns value of the TZURL `self`
         * @returns the TZURL value
         * @since 1.0
         */
        get_tzurl(): string;

        /**
         * Returns value of the UID `self`
         * @returns the UID value
         * @since 1.0
         */
        get_uid(): string;

        /**
         * Returns value of the URL `self`
         * @returns the URL value
         * @since 1.0
         */
        get_url(): string;

        /**
         * Gets the {@link ICalGLib.Value} of {@link ICalGLib.Property}.
         * @returns The {@link ICalGLib.Value} of `prop`.
         * @since 1.0
         */
        get_value(): Value;

        /**
         * Gets the string representation of the value in {@link ICalGLib.Property}.
         * @returns The string representation of the value of the {@link ICalGLib.Property}.
         * @since 1.0
         */
        get_value_as_string(): string;

        /**
         * Returns value of the VERSION `self`
         * @returns the VERSION value
         * @since 1.0
         */
        get_version(): string;

        /**
         * Returns value of the VOTER `self`
         * @returns the VOTER value
         * @since 1.0
         */
        get_voter(): string;

        /**
         * Returns value of the X `self`
         * @returns the X value
         * @since 1.0
         */
        get_x(): string;

        /**
         * Gets the name of x property.
         * @returns The name of x property.
         * @since 1.0
         */
        get_x_name(): string | null;

        /**
         * Returns value of the XLICCLASS `self`
         * @returns the XLICCLASS value
         * @since 1.0
         */
        get_xlicclass(): PropertyXlicclass;

        /**
         * Returns value of the XLICCLUSTERCOUNT `self`
         * @returns the XLICCLUSTERCOUNT value
         * @since 1.0
         */
        get_xlicclustercount(): string;

        /**
         * Returns value of the XLICERROR `self`
         * @returns the XLICERROR value
         * @since 1.0
         */
        get_xlicerror(): string;

        /**
         * Returns value of the XLICMIMECHARSET `self`
         * @returns the XLICMIMECHARSET value
         * @since 1.0
         */
        get_xlicmimecharset(): string;

        /**
         * Returns value of the XLICMIMECID `self`
         * @returns the XLICMIMECID value
         * @since 1.0
         */
        get_xlicmimecid(): string;

        /**
         * Returns value of the XLICMIMECONTENTTYPE `self`
         * @returns the XLICMIMECONTENTTYPE value
         * @since 1.0
         */
        get_xlicmimecontenttype(): string;

        /**
         * Returns value of the XLICMIMEENCODING `self`
         * @returns the XLICMIMEENCODING value
         * @since 1.0
         */
        get_xlicmimeencoding(): string;

        /**
         * Returns value of the XLICMIMEFILENAME `self`
         * @returns the XLICMIMEFILENAME value
         * @since 1.0
         */
        get_xlicmimefilename(): string;

        /**
         * Returns value of the XLICMIMEOPTINFO `self`
         * @returns the XLICMIMEOPTINFO value
         * @since 1.0
         */
        get_xlicmimeoptinfo(): string;

        /**
         * Gets the kind of {@link ICalGLib.Property}.
         * @returns The type of {@link ICalGLib.Property}.
         * @since 1.0
         */
        isa(): PropertyKind;

        /**
         * Checks whether the native part of {@link ICalGLib.Property} is of the type icalproperty.
         * @returns true if the native part of `property` is of the type icalproperty, false if not.
         * @since 1.0
         */
        isa_property(): boolean;

        /**
         * Normalizes (reorders and sorts the parameters) the specified `prop`.
         * @since 4.0
         */
        normalize(): void;

        /**
         * Removes the target kind of the parameters in the {@link ICalGLib.Property}.
         * @param kind The {@link ICalGLib.ParameterKind} to be removed
         * @since 1.0
         */
        remove_parameter_by_kind(kind: ParameterKind): void;

        /**
         * Removes parameter in the {@link ICalGLib.Property} by name.
         * @param name The name of the parameter to be removed
         * @since 1.0
         */
        remove_parameter_by_name(name: string): void;

        /**
         * Removes the parameter in the {@link ICalGLib.Property} by ref.
         * @param param The {@link ICalGLib.Parameter} to be removed
         * @since 1.0
         */
        remove_parameter_by_ref(param: Parameter): void;

        /**
         * Sets value to the ACCEPTRESPONSE `self`
         * @param value the ACCEPTRESPONSE value
         * @since 2.0
         */
        set_acceptresponse(value: string): void;

        /**
         * Sets value to the ACKNOWLEDGED `self`
         * @param value the ACKNOWLEDGED value
         * @since 1.0
         */
        set_acknowledged(value: Time): void;

        /**
         * Sets value to the ACTION `self`
         * @param value the ACTION value
         * @since 1.0
         */
        set_action(value: PropertyAction): void;

        /**
         * Sets value to the ALLOWCONFLICT `self`
         * @param value the ALLOWCONFLICT value
         * @since 1.0
         */
        set_allowconflict(value: string): void;

        /**
         * Sets value to the ATTACH `self`
         * @param value the ATTACH value
         * @since 1.0
         */
        set_attach(value: Attach): void;

        /**
         * Sets value to the ATTENDEE `self`
         * @param value the ATTENDEE value
         * @since 1.0
         */
        set_attendee(value: string): void;

        /**
         * Sets value to the BUSYTYPE `self`
         * @param value the BUSYTYPE value
         * @since 2.0
         */
        set_busytype(value: PropertyBusytype): void;

        /**
         * Sets value to the CALENDARADDRESS `self`
         * @param value the CALENDARADDRESS value
         * @since 4.0
         */
        set_calendaraddress(value: string): void;

        /**
         * Sets value to the CALID `self`
         * @param value the CALID value
         * @since 1.0
         */
        set_calid(value: string): void;

        /**
         * Sets value to the CALMASTER `self`
         * @param value the CALMASTER value
         * @since 1.0
         */
        set_calmaster(value: string): void;

        /**
         * Sets value to the CALSCALE `self`
         * @param value the CALSCALE value
         * @since 1.0
         */
        set_calscale(value: string): void;

        /**
         * Sets value to the CAPVERSION `self`
         * @param value the CAPVERSION value
         * @since 1.0
         */
        set_capversion(value: string): void;

        /**
         * Sets value to the CARID `self`
         * @param value the CARID value
         * @since 1.0
         */
        set_carid(value: string): void;

        /**
         * Sets value to the CARLEVEL `self`
         * @param value the CARLEVEL value
         * @since 1.0
         */
        set_carlevel(value: PropertyCarlevel): void;

        /**
         * Sets value to the CATEGORIES `self`
         * @param value the CATEGORIES value
         * @since 1.0
         */
        set_categories(value: string): void;

        /**
         * Sets value to the CLASS `self`
         * @param value the CLASS value
         * @since 1.0
         */
        set_class(value: PropertyClassenum): void;

        /**
         * Sets value to the CMD `self`
         * @param value the CMD value
         * @since 1.0
         */
        set_cmd(value: PropertyCmd): void;

        /**
         * Sets value to the COLOR `self`
         * @param value the COLOR value
         * @since 3.0.5
         */
        set_color(value: string): void;

        /**
         * Sets value to the COMMENT `self`
         * @param value the COMMENT value
         * @since 1.0
         */
        set_comment(value: string): void;

        /**
         * Sets value to the COMPLETED `self`
         * @param value the COMPLETED value
         * @since 1.0
         */
        set_completed(value: Time): void;

        /**
         * Sets value to the COMPONENTS `self`
         * @param value the COMPONENTS value
         * @since 1.0
         */
        set_components(value: string): void;

        /**
         * Sets value to the CONCEPT `self`
         * @param value the CONCEPT value
         * @since 4.0
         */
        set_concept(value: string): void;

        /**
         * Sets value to the CONFERENCE `self`
         * @param value the CONFERENCE value
         * @since 4.0
         */
        set_conference(value: string): void;

        /**
         * Sets value to the CONTACT `self`
         * @param value the CONTACT value
         * @since 1.0
         */
        set_contact(value: string): void;

        /**
         * Sets value to the CREATED `self`
         * @param value the CREATED value
         * @since 1.0
         */
        set_created(value: Time): void;

        /**
         * Sets value to the CSID `self`
         * @param value the CSID value
         * @since 1.0
         */
        set_csid(value: string): void;

        /**
         * Sets value to the DATEMAX `self`
         * @param value the DATEMAX value
         * @since 1.0
         */
        set_datemax(value: Time): void;

        /**
         * Sets value to the DATEMIN `self`
         * @param value the DATEMIN value
         * @since 1.0
         */
        set_datemin(value: Time): void;

        /**
         * Sets value to the DECREED `self`
         * @param value the DECREED value
         * @since 1.0
         */
        set_decreed(value: string): void;

        /**
         * Sets value to the DEFAULTCHARSET `self`
         * @param value the DEFAULTCHARSET value
         * @since 1.0
         */
        set_defaultcharset(value: string): void;

        /**
         * Sets value to the DEFAULTLOCALE `self`
         * @param value the DEFAULTLOCALE value
         * @since 1.0
         */
        set_defaultlocale(value: string): void;

        /**
         * Sets value to the DEFAULTTZID `self`
         * @param value the DEFAULTTZID value
         * @since 1.0
         */
        set_defaulttzid(value: string): void;

        /**
         * Sets value to the DEFAULTVCARS `self`
         * @param value the DEFAULTVCARS value
         * @since 1.0
         */
        set_defaultvcars(value: string): void;

        /**
         * Sets value to the deny `self`
         * @param value the deny value
         * @since 1.0
         */
        set_deny(value: string): void;

        /**
         * Sets value to the description `self`
         * @param value the description value
         * @since 1.0
         */
        set_description(value: string): void;

        /**
         * Sets value to the DTEND `self`
         * @param value the DTEND value
         * @since 1.0
         */
        set_dtend(value: Time): void;

        /**
         * Sets value to the DTSTAMP `self`
         * @param value the DTSTAMP value
         * @since 1.0
         */
        set_dtstamp(value: Time): void;

        /**
         * Sets value to the DTSTART `self`
         * @param value the DTSTART value
         * @since 1.0
         */
        set_dtstart(value: Time): void;

        /**
         * Sets value to the DUE `self`
         * @param value the DUE value
         * @since 1.0
         */
        set_due(value: Time): void;

        /**
         * Sets value to the DURATION `self`
         * @param value the DURATION value
         * @since 1.0
         */
        set_duration(value: Duration): void;

        /**
         * Sets value to the ESTIMATEDDURATION `self`
         * @param value the ESTIMATEDDURATION value
         * @since 1.0
         */
        set_estimatedduration(value: Duration): void;

        /**
         * Sets value to the EXDATE `self`
         * @param value the EXDATE value
         * @since 1.0
         */
        set_exdate(value: Time): void;

        /**
         * Sets value to the EXPAND `self`
         * @param value the EXPAND value
         * @since 1.0
         */
        set_expand(value: number): void;

        /**
         * Sets value to the EXRULE `self`
         * @param value the EXRULE value
         * @since 1.0
         */
        set_exrule(value: Recurrence): void;

        /**
         * Sets value to the FREEBUSY `self`
         * @param value the FREEBUSY value
         * @since 1.0
         */
        set_freebusy(value: Period): void;

        /**
         * Sets value to the GEO `self`
         * @param value the GEO value
         * @since 1.0
         */
        set_geo(value: Geo): void;

        /**
         * Sets value to the GRANT `self`
         * @param value the GRANT value
         * @since 1.0
         */
        set_grant(value: string): void;

        /**
         * Sets value to the IANA `self`
         * @param value the IANA value
         * @since 3.1
         */
        set_iana(value: string): void;

        /**
         * Sets the IANA name for the {@link ICalGLib.Property}.
         * @param name The IANA property name
         * @since 4.0
         */
        set_iana_name(name: string): void;

        /**
         * Sets value to the IMAGE `self`
         * @param value the IMAGE value
         * @since 4.0
         */
        set_image(value: Attach): void;

        /**
         * Sets value to the ITIPVERSION `self`
         * @param value the ITIPVERSION value
         * @since 1.0
         */
        set_itipversion(value: string): void;

        /**
         * Sets value to the LASTMODIFIED `self`
         * @param value the LASTMODIFIED value
         * @since 1.0
         */
        set_lastmodified(value: Time): void;

        /**
         * Sets value to the LINK `self`
         * @param value the LINK value
         * @since 4.0
         */
        set_link(value: string): void;

        /**
         * Sets value to the LOCATION `self`
         * @param value the LOCATION value
         * @since 1.0
         */
        set_location(value: string): void;

        /**
         * Sets value to the LOCATIONTYPE `self`
         * @param value the LOCATIONTYPE value
         * @since 4.0
         */
        set_locationtype(value: string): void;

        /**
         * Sets value to the MAXCOMPONENTSIZE `self`
         * @param value the MAXCOMPONENTSIZE value
         * @since 1.0
         */
        set_maxcomponentsize(value: number): void;

        /**
         * Sets value to the MAXDATE `self`
         * @param value the MAXDATE value
         * @since 1.0
         */
        set_maxdate(value: Time): void;

        /**
         * Sets value to the MAXRESULTS `self`
         * @param value the MAXRESULTS value
         * @since 1.0
         */
        set_maxresults(value: number): void;

        /**
         * Sets value to the MAXRESULTSSIZE `self`
         * @param value the MAXRESULTSSIZE value
         * @since 1.0
         */
        set_maxresultssize(value: number): void;

        /**
         * Sets value to the METHOD `self`
         * @param value the METHOD value
         * @since 1.0
         */
        set_method(value: PropertyMethod): void;

        /**
         * Sets value to the MINDATE `self`
         * @param value the MINDATE value
         * @since 1.0
         */
        set_mindate(value: Time): void;

        /**
         * Sets value to the MULTIPART `self`
         * @param value the MULTIPART value
         * @since 1.0
         */
        set_multipart(value: string): void;

        /**
         * Sets value to the NAME `self`
         * @param value the NAME value
         * @since 1.0
         */
        set_name(value: string): void;

        /**
         * Sets value to the ORGANIZER `self`
         * @param value the ORGANIZER value
         * @since 1.0
         */
        set_organizer(value: string): void;

        /**
         * Sets value to the OWNER `self`
         * @param value the OWNER value
         * @since 1.0
         */
        set_owner(value: string): void;

        /**
         * @param args 
         */
    // Conflicted with ICalGLib.Object.set_owner
        set_owner(...args: never[]): any;

        /**
         * Sets a {@link ICalGLib.Parameter} into the {@link ICalGLib.Property}. It behaves like set the copy of the {@link ICalGLib.Parameter}. Upon
         * completion the native part of {@link ICalGLib.Parameter} will be set to NULL.
         * @param parameter The parameter to be set into `prop`
         * @since 1.0
         */
        set_parameter(parameter: Parameter): void;

        /**
         * Sets the {@link ICalGLib.Property} with the parameter defined by the name and value.
         * @param name The name of the parameter
         * @param value The value of the parameter
         * @since 1.0
         */
        set_parameter_from_string(name: string, value: string): void;

        /**
         * Sets the parent {@link ICalGLib.Component} of the specified {@link ICalGLib.Property}.
         * @param component An {@link ICalGLib.Component}
         * @since 3.0
         */
        set_parent(component: Component | null): void;

        /**
         * Sets value to the PARTICIPANTTYPE `self`
         * @param value the PARTICIPANTTYPE value
         * @since 4.0
         */
        set_participanttype(value: PropertyParticipanttype): void;

        /**
         * Sets value to the PATCHDELETE `self`
         * @param value the PATCHDELETE value
         * @since 4.0
         */
        set_patchdelete(value: string): void;

        /**
         * Sets value to the PATCHORDER `self`
         * @param value the PATCHORDER value
         * @since 4.0
         */
        set_patchorder(value: number): void;

        /**
         * Sets value to the PATCHPARAMETER `self`
         * @param value the PATCHPARAMETER value
         * @since 4.0
         */
        set_patchparameter(value: string): void;

        /**
         * Sets value to the PATCHTARGET `self`
         * @param value the PATCHTARGET value
         * @since 4.0
         */
        set_patchtarget(value: string): void;

        /**
         * Sets value to the PATCHVERSION `self`
         * @param value the PATCHVERSION value
         * @since 4.0
         */
        set_patchversion(value: string): void;

        /**
         * Sets value to the PERCENTCOMPLETE `self`
         * @param value the PERCENTCOMPLETE value
         * @since 1.0
         */
        set_percentcomplete(value: number): void;

        /**
         * Sets value to the PERMISSION `self`
         * @param value the PERMISSION value
         * @since 1.0
         */
        set_permission(value: string): void;

        /**
         * Sets value to the POLLCOMPLETION `self`
         * @param value the POLLCOMPLETION value
         * @since 1.0
         */
        set_pollcompletion(value: PropertyPollcompletion): void;

        /**
         * Sets value to the POLLITEMID `self`
         * @param value the POLLITEMID value
         * @since 1.0
         */
        set_pollitemid(value: number): void;

        /**
         * Sets value to the POLLMODE `self`
         * @param value the POLLMODE value
         * @since 1.0
         */
        set_pollmode(value: PropertyPollmode): void;

        /**
         * Sets value to the POLLPROPERTIES `self`
         * @param value the POLLPROPERTIES value
         * @since 1.0
         */
        set_pollproperties(value: string): void;

        /**
         * Sets value to the POLLWINNER `self`
         * @param value the POLLWINNER value
         * @since 1.0
         */
        set_pollwinner(value: number): void;

        /**
         * Sets value to the PRIORITY `self`
         * @param value the PRIORITY value
         * @since 1.0
         */
        set_priority(value: number): void;

        /**
         * Sets value to the PRODID `self`
         * @param value the PRODID value
         * @since 1.0
         */
        set_prodid(value: string): void;

        /**
         * Sets value to the PROXIMITY `self`
         * @param value the PROXIMITY value
         * @since 4.0
         */
        set_proximity(value: PropertyProximity): void;

        /**
         * Sets value to the QUERY `self`
         * @param value the QUERY value
         * @since 1.0
         */
        set_query(value: string): void;

        /**
         * Sets value to the QUERYID `self`
         * @param value the QUERYID value
         * @since 1.0
         */
        set_queryid(value: string): void;

        /**
         * Sets value to the QUERYLEVEL `self`
         * @param value the QUERYLEVEL value
         * @since 1.0
         */
        set_querylevel(value: PropertyQuerylevel): void;

        /**
         * Sets value to the QUERYNAME `self`
         * @param value the QUERYNAME value
         * @since 1.0
         */
        set_queryname(value: string): void;

        /**
         * Sets value to the RDATE `self`
         * @param value the RDATE value
         * @since 1.0
         */
        set_rdate(value: Datetimeperiod): void;

        /**
         * Sets value to the RECURACCEPTED `self`
         * @param value the RECURACCEPTED value
         * @since 1.0
         */
        set_recuraccepted(value: string): void;

        /**
         * Sets value to the RECUREXPAND `self`
         * @param value the RECUREXPAND value
         * @since 1.0
         */
        set_recurexpand(value: string): void;

        /**
         * Sets value to the RECURLIMIT `self`
         * @param value the RECURLIMIT value
         * @since 1.0
         */
        set_recurlimit(value: string): void;

        /**
         * Sets value to the RECURRENCEID `self`
         * @param value the RECURRENCEID value
         * @since 1.0
         */
        set_recurrenceid(value: Time): void;

        /**
         * Sets value to the REFID `self`
         * @param value the REFID value
         * @since 4.0
         */
        set_refid(value: string): void;

        /**
         * Sets value to the REFRESHINTERVAL `self`
         * @param value the REFRESHINTERVAL value
         * @since 4.0
         */
        set_refreshinterval(value: Duration): void;

        /**
         * Sets value to the RELATEDTO `self`
         * @param value the RELATEDTO value
         * @since 1.0
         */
        set_relatedto(value: string): void;

        /**
         * Sets value to the RELCALID `self`
         * @param value the RELCALID value
         * @since 1.0
         */
        set_relcalid(value: string): void;

        /**
         * Sets value to the REPEAT `self`
         * @param value the REPEAT value
         * @since 1.0
         */
        set_repeat(value: number): void;

        /**
         * Sets value to the REPLYURL `self`
         * @param value the REPLYURL value
         * @since 2.0
         */
        set_replyurl(value: string): void;

        /**
         * Sets value to the REQUESTSTATUS `self`
         * @param value the REQUESTSTATUS value
         * @since 1.0
         */
        set_requeststatus(value: Reqstat): void;

        /**
         * Sets value to the RESOURCES `self`
         * @param value the RESOURCES value
         * @since 1.0
         */
        set_resources(value: string): void;

        /**
         * Sets value to the RESOURCETYPE `self`
         * @param value the RESOURCETYPE value
         * @since 4.0
         */
        set_resourcetype(value: PropertyResourcetype): void;

        /**
         * Sets value to the RESPONSE `self`
         * @param value the RESPONSE value
         * @since 2.0
         */
        set_response(value: number): void;

        /**
         * Sets value to the RESTRICTION `self`
         * @param value the RESTRICTION value
         * @since 1.0
         */
        set_restriction(value: string): void;

        /**
         * Sets value to the RRULE `self`
         * @param value the RRULE value
         * @since 1.0
         */
        set_rrule(value: Recurrence): void;

        /**
         * Sets value to the SCOPE `self`
         * @param value the SCOPE value
         * @since 1.0
         */
        set_scope(value: string): void;

        /**
         * Sets value to the SEQUENCE `self`
         * @param value the SEQUENCE value
         * @since 1.0
         */
        set_sequence(value: number): void;

        /**
         * Sets value to the SOURCE `self`
         * @param value the SOURCE value
         * @since 4.0
         */
        set_source(value: string): void;

        /**
         * Sets value to the STATUS `self`
         * @param value the STATUS value
         * @since 1.0
         */
        set_status(value: PropertyStatus): void;

        /**
         * Sets value to the STORESEXPANDED `self`
         * @param value the STORESEXPANDED value
         * @since 1.0
         */
        set_storesexpanded(value: string): void;

        /**
         * Sets value to the STRUCTUREDDATA `self`
         * @param value the STRUCTUREDDATA value
         * @since 4.0
         */
        set_structureddata(value: Attach): void;

        /**
         * Sets value to the STYLEDDESCRIPTION `self`
         * @param value the STYLEDDESCRIPTION value
         * @since 4.0
         */
        set_styleddescription(value: string): void;

        /**
         * Sets value to the SUMMARY `self`
         * @param value the SUMMARY value
         * @since 1.0
         */
        set_summary(value: string): void;

        /**
         * Sets value to the TARGET `self`
         * @param value the TARGET value
         * @since 1.0
         */
        set_target(value: string): void;

        /**
         * Sets value to the TASKMODE `self`
         * @param value the TASKMODE value
         * @since 2.0
         */
        set_taskmode(value: PropertyTaskmode): void;

        /**
         * Sets value to the TRANSP `self`
         * @param value the TRANSP value
         * @since 1.0
         */
        set_transp(value: PropertyTransp): void;

        /**
         * Sets value to the TRIGGER `self`
         * @param value the TRIGGER value
         * @since 1.0
         */
        set_trigger(value: Trigger): void;

        /**
         * Sets value to the TZID `self`
         * @param value the TZID value
         * @since 1.0
         */
        set_tzid(value: string): void;

        /**
         * Sets value to the TZIDALIASOF `self`
         * @param value the TZIDALIASOF value
         * @since 2.0
         */
        set_tzidaliasof(value: string): void;

        /**
         * Sets value to the TZNAME `self`
         * @param value the TZNAME value
         * @since 1.0
         */
        set_tzname(value: string): void;

        /**
         * Sets value to the TZOFFSETFROM `self`
         * @param value the TZOFFSETFROM value
         * @since 1.0
         */
        set_tzoffsetfrom(value: number): void;

        /**
         * Sets value to the TZOFFSETTO `self`
         * @param value the TZOFFSETTO value
         * @since 1.0
         */
        set_tzoffsetto(value: number): void;

        /**
         * Sets value to the TZUNTIL `self`
         * @param value the TZUNTIL value
         * @since 2.0
         */
        set_tzuntil(value: Time): void;

        /**
         * Sets value to the TZURL `self`
         * @param value the TZURL value
         * @since 1.0
         */
        set_tzurl(value: string): void;

        /**
         * Sets value to the UID `self`
         * @param value the UID value
         * @since 1.0
         */
        set_uid(value: string): void;

        /**
         * Sets value to the URL `self`
         * @param value the URL value
         * @since 1.0
         */
        set_url(value: string): void;

        /**
         * Sets the {@link ICalGLib.Property} with the {@link ICalGLib.Value}.
         * @param value The {@link ICalGLib.Value} will be set as the property of `prop`
         * @since 1.0
         */
        set_value(value: Value): void;

        /**
         * Sets the {@link ICalGLib.Property} with the {@link ICalGLib.Value} constructed from string.
         * @param value The value used to construct the {@link ICalGLib.Value}
         * @param kind The kind used to construct the {@link ICalGLib.Value}
         * @since 1.0
         */
        set_value_from_string(value: string, kind: string): void;

        /**
         * Sets value to the VERSION `self`
         * @param value the VERSION value
         * @since 1.0
         */
        set_version(value: string): void;

        /**
         * Sets value to the VOTER `self`
         * @param value the VOTER value
         * @since 1.0
         */
        set_voter(value: string): void;

        /**
         * Sets value to the X `self`
         * @param value the X value
         * @since 1.0
         */
        set_x(value: string): void;

        /**
         * Sets the name of x property for the {@link ICalGLib.Property}.
         * @param name The name string
         * @since 1.0
         */
        set_x_name(name: string): void;

        /**
         * Sets value to the XLICCLASS `self`
         * @param value the XLICCLASS value
         * @since 1.0
         */
        set_xlicclass(value: PropertyXlicclass): void;

        /**
         * Sets value to the XLICCLUSTERCOUNT `self`
         * @param value the XLICCLUSTERCOUNT value
         * @since 1.0
         */
        set_xlicclustercount(value: string): void;

        /**
         * Sets value to the XLICERROR `self`
         * @param value the XLICERROR value
         * @since 1.0
         */
        set_xlicerror(value: string): void;

        /**
         * Sets value to the XLICMIMECHARSET `self`
         * @param value the XLICMIMECHARSET value
         * @since 1.0
         */
        set_xlicmimecharset(value: string): void;

        /**
         * Sets value to the XLICMIMECID `self`
         * @param value the XLICMIMECID value
         * @since 1.0
         */
        set_xlicmimecid(value: string): void;

        /**
         * Sets value to the XLICMIMECONTENTTYPE `self`
         * @param value the XLICMIMECONTENTTYPE value
         * @since 1.0
         */
        set_xlicmimecontenttype(value: string): void;

        /**
         * Sets value to the XLICMIMEENCODING `self`
         * @param value the XLICMIMEENCODING value
         * @since 1.0
         */
        set_xlicmimeencoding(value: string): void;

        /**
         * Sets value to the XLICMIMEFILENAME `self`
         * @param value the XLICMIMEFILENAME value
         * @since 1.0
         */
        set_xlicmimefilename(value: string): void;

        /**
         * Sets value to the XLICMIMEOPTINFO `self`
         * @param value the XLICMIMEOPTINFO value
         * @since 1.0
         */
        set_xlicmimeoptinfo(value: string): void;
    }


    namespace RecurIterator {
        // Signal signatures
        interface SignalSignatures extends Object.SignalSignatures {
            "notify::always-destroy": (pspec: GObject.ParamSpec) => void;
            "notify::is-global-memory": (pspec: GObject.ParamSpec) => void;
            "notify::native": (pspec: GObject.ParamSpec) => void;
            "notify::native-destroy-func": (pspec: GObject.ParamSpec) => void;
            "notify::owner": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends Object.ConstructorProps {}
    }

    /**
     * This is the ICalRecurIterator instance.
     * @gir-type Class
     */
    class RecurIterator extends Object {
        static $gtype: GObject.GType<RecurIterator>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: RecurIterator.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<RecurIterator.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        static ["new"](rule: Recurrence, dtstart: Time): RecurIterator;

        // Signals
        /** @signal */
        connect<K extends keyof RecurIterator.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, RecurIterator.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof RecurIterator.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, RecurIterator.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof RecurIterator.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<RecurIterator.SignalSignatures[K]>): void;

        // Methods
        /**
         * Gets the next occurrence from an iterator.
         * @returns The next occurrence according to this recurrence rule.
         * @since 1.0
         */
        next(): Time;

        /**
         * Gets the previous occurrence from an iterator.
         * @returns The previous occurrence according to this recurrence rule.
         * @since 4.0
         */
        prev(): Time;

        /**
         * Sets the date-time at which the iterator will stop at the latest. Values equal to or greater than end
         * will not be returned by the iterator.
         * @param end The date-time at which the iterator will stop
         * @returns true if succeeded, false if failed
         * @since 4.0
         */
        set_end(end: Time): boolean;

        /**
         * Sets the date-times over which the iterator will run,
         * where `from` is a value between DTSTART and UNTIL.
         * 
         * If
         * `to` is a null time, the forward iterator will return values
         * up to and including UNTIL (if present), otherwise
         * up to the year 2582.
         * 
         * If `to` is non-null time and later than `from`,
         * the forward iterator will return
         * values up to and including `to`.
         * 
         * If `to` is non-null time and earlier than `from`,
         * the reverse iterator
         * will be set to start at `from`
         * and will return values down to and including `to`.
         * 
         * Note: CAN NOT be used
         * with RRULEs that contain COUNT.
         * @param from The start date-time for the iterator
         * @param to The end date-time for the iterator
         * @returns `true` if succeeded, `false` failed, like when the recurrence type is unsupported.
         * @since 4.0
         */
        set_range(from: Time, to: Time): boolean;

        /**
         * Sets the date-time at which the iterator will start, where 'start' is a value between DTSTART and UNTIL.
         * Note:
         * CAN NOT be used with RRULEs that contain COUNT.
         * @param start The date-time to move the iterator to
         * @returns true if succeeded, false failed, like when the recurrence type is unsupported.
         * @since 3.0
         */
        set_start(start: Time): boolean;
    }


    namespace Recurrence {
        // Signal signatures
        interface SignalSignatures extends Object.SignalSignatures {
            "notify::always-destroy": (pspec: GObject.ParamSpec) => void;
            "notify::is-global-memory": (pspec: GObject.ParamSpec) => void;
            "notify::native": (pspec: GObject.ParamSpec) => void;
            "notify::native-destroy-func": (pspec: GObject.ParamSpec) => void;
            "notify::owner": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends Object.ConstructorProps {}
    }

    /**
     * This is the ICalRecurrence instance.
     * @gir-type Class
     */
    class Recurrence extends Object {
        static $gtype: GObject.GType<Recurrence>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: Recurrence.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<Recurrence.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        static ["new"](): Recurrence;

        static new_from_string(str: string): Recurrence;

        // Signals
        /** @signal */
        connect<K extends keyof Recurrence.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Recurrence.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof Recurrence.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Recurrence.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof Recurrence.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<Recurrence.SignalSignatures[K]>): void;

        // Static methods
        /**
         * Decodes a day to a weekday in a week.
         * @param day The encoded day which represents the day of the week and Nth day of the week
         * @since 1.0
         */
        static day_day_of_week(day: number): RecurrenceWeekday;

        /**
         * Decodes a day to a position of the weekday.
         * @param day The encoded day which represents the day of the week and Nth day of the week
         * @since 1.0
         */
        static day_position(day: number): number;

        /**
         * Encodes the `weekday` and `position` into a single value, which can by split by `i_cal_recurrence_day_day_of_week()`
         * and `i_cal_recurrence_day_position()`.
         * @param weekday The {@link ICalGLib.RecurrenceWeekday} to use.
         * @param position The position to use. 0 == any of day of week. 1 == first, 2 = second, -2 == second to last, etc
         * @since 3.0.5
         */
        static encode_day(weekday: RecurrenceWeekday, position: number): number;

        /**
         * Encodes the `month` and the `is_leap` flag into a single value, which can be split by `i_cal_recurrence_month_is_leap()`
         * and `i_cal_recurrence_month_month()`.
         * @param month The month to be encoded
         * @param is_leap `true`, when the month is leap, `false` otherwise
         * @since 3.0.5
         */
        static encode_month(month: number, is_leap: boolean): number;

        /**
         * Converts a string representation to an enum representation for the frequency.
         * @param str The string representation of the frequency
         * @since 2.0
         */
        static frequency_from_string(str: string): RecurrenceFrequency;

        /**
         * Converts an enum representation to a string representation for the frequency.
         * @param kind The frequency enum
         * @since 2.0
         */
        static frequency_to_string(kind: RecurrenceFrequency): string;

        /**
         * Decodes a month and check whether it is a leap month.
         * @param month The month to be decoded
         * @since 2.0
         */
        static month_is_leap(month: number): boolean;

        /**
         * Decode a month from an encoded value by `i_cal_recurrence_encode_month()`.
         * @param month The month to be decoded
         * @since 2.0
         */
        static month_month(month: number): number;

        /**
         * Gets an array of calendars supporting rscale (currently always return NULL).
         * @since 2.0
         */
        static rscale_supported_calendars(): Array;

        /**
         * Converts a string representation to an enum representation for the skip.
         * @param str The string representation of the skip
         * @since 2.0
         */
        static skip_from_string(str: string): RecurrenceSkip;

        /**
         * Converts an enum representation to a string representation for the skip.
         * @param kind The frequency enum
         * @since 2.0
         */
        static skip_to_string(kind: RecurrenceSkip): string;

        /**
         * Converts a string representation to an enum representation for the weekday.
         * @param str The string representation of the weekday
         * @since 1.0
         */
        static weekday_from_string(str: string): RecurrenceWeekday;

        /**
         * Converts an enum representation to a string representation for the weekday.
         * @param kind The frequency enum
         * @since 2.0
         */
        static weekday_to_string(kind: RecurrenceWeekday): string;

        // Methods
        /**
         * Creates a copy of the `src`.
         * @returns The newly created {@link ICalGLib.Recurrence}.
         * @since 4.0
         */
        clone(): Recurrence;

        /**
         * Returns the element at the specified index of the 'by' array if it exists, 0 otherwise.
         * @param byrule The 'by' part to use.
         * @param index The index in the by[byrule] array of {@link ICalGLib.Recurrence}.
         * @returns The 'by' part at the given position.
         * @since 4.0
         */
        get_by(byrule: RecurrenceByRule, index: number): number;

        /**
         * Gets the by[byrule] array from {@link ICalGLib.Recurrence}.
         * @param byrule The 'by' part to use.
         * @returns The by[byrule] of {@link ICalGLib.Recurrence}.
         * @since 4.0
         */
        get_by_array(byrule: RecurrenceByRule): number[];

        /**
         * Returns the size of given 'by' array from {@link ICalGLib.Recurrence}.
         * @param byrule The 'by' part to use.
         * @returns The current size of the given 'by' array.
         * @since 4.0
         */
        get_by_array_size(byrule: RecurrenceByRule): number;

        /**
         * Gets the count from {@link ICalGLib.Recurrence}.
         * @returns The count of {@link ICalGLib.Recurrence}.
         * @since 1.0
         */
        get_count(): number;

        /**
         * Gets the freq from {@link ICalGLib.Recurrence}.
         * @returns The freq of {@link ICalGLib.Recurrence}.
         * @since 1.0
         */
        get_freq(): RecurrenceFrequency;

        /**
         * Gets the interval from {@link ICalGLib.Recurrence}.
         * @returns The interval of {@link ICalGLib.Recurrence}.
         * @since 1.0
         */
        get_interval(): number;

        /**
         * Gets the until from {@link ICalGLib.Recurrence}.
         * @returns The until of {@link ICalGLib.Recurrence}.
         * @since 1.0
         */
        get_until(): Time;

        /**
         * Gets the week_start from {@link ICalGLib.Recurrence}.
         * @returns The week_start of {@link ICalGLib.Recurrence}.
         * @since 1.0
         */
        get_week_start(): RecurrenceWeekday;

        /**
         * Resizes the 'by' array to the given size.
         * @param byrule The 'by' part to use.
         * @param size The new size of the 'by' array
         * @since 4.0
         */
        resize_by_array(byrule: RecurrenceByRule, size: number): void;

        /**
         * Sets the by array at the given index. Resizes the array to have a size of at least index+1 elements if
         * necessary.
         * @param byrule The 'by' part to use.
         * @param index The index in the 'by' array
         * @param value The value to be set
         * @since 4.0
         */
        set_by(byrule: RecurrenceByRule, index: number, value: number): void;

        /**
         * Sets the given 'by' array.
         * @param byrule The 'by' part to use.
         * @param values The array of values
         * @since 4.0
         */
        set_by_array(byrule: RecurrenceByRule, values: number[]): void;

        /**
         * Sets the count from {@link ICalGLib.Recurrence}.
         * @param count The count of {@link ICalGLib.Recurrence}
         * @since 1.0
         */
        set_count(count: number): void;

        /**
         * Sets the freq from {@link ICalGLib.Recurrence}.
         * @param freq The freq of {@link ICalGLib.Recurrence}
         * @since 1.0
         */
        set_freq(freq: RecurrenceFrequency): void;

        /**
         * Sets the interval from {@link ICalGLib.Recurrence}.
         * @param interval The interval of {@link ICalGLib.Recurrence}
         * @since 1.0
         */
        set_interval(interval: number): void;

        /**
         * Sets the until from {@link ICalGLib.Recurrence}.
         * @param until The until of {@link ICalGLib.Recurrence}
         * @since 1.0
         */
        set_until(until: Time): void;

        /**
         * Sets the week_start from {@link ICalGLib.Recurrence}.
         * @param week_start The week_start of {@link ICalGLib.Recurrence}
         * @since 1.0
         */
        set_week_start(week_start: RecurrenceWeekday): void;

        /**
         * Converts a {@link ICalGLib.Recurrence} to a string.
         * @returns The string representation of `recur`.
         * @since 1.0
         */
        to_string(): string;
    }


    namespace Reqstat {
        // Signal signatures
        interface SignalSignatures extends Object.SignalSignatures {
            "notify::always-destroy": (pspec: GObject.ParamSpec) => void;
            "notify::is-global-memory": (pspec: GObject.ParamSpec) => void;
            "notify::native": (pspec: GObject.ParamSpec) => void;
            "notify::native-destroy-func": (pspec: GObject.ParamSpec) => void;
            "notify::owner": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends Object.ConstructorProps {}
    }

    /**
     * This is the ICalReqstat instance.
     * @gir-type Class
     */
    class Reqstat extends Object {
        static $gtype: GObject.GType<Reqstat>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: Reqstat.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<Reqstat.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        static new_from_string(str: string): Reqstat;

        // Signals
        /** @signal */
        connect<K extends keyof Reqstat.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Reqstat.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof Reqstat.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Reqstat.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof Reqstat.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<Reqstat.SignalSignatures[K]>): void;

        // Methods
        /**
         * Gets the code of {@link ICalGLib.Reqstat}.
         * @returns The code of `reqstat`.
         * @since 1.0
         */
        get_code(): RequestStatus;

        /**
         * Gets the debug of {@link ICalGLib.Reqstat}.
         * @returns The debug of `reqstat`.
         * @since 1.0
         */
        get_debug(): string;

        /**
         * Gets the desc of {@link ICalGLib.Reqstat}.
         * @returns The desc of `reqstat`.
         * @since 1.0
         */
        get_desc(): string;

        /**
         * Sets the code of {@link ICalGLib.Reqstat}.
         * @param code The code of `reqstat`
         * @since 1.0
         */
        set_code(code: RequestStatus): void;

        /**
         * Converts {@link ICalGLib.Reqstat} to a string representation.
         * @returns A string.
         * @since 1.0
         */
        to_string(): string;
    }


    namespace StrArray {
        // Signal signatures
        interface SignalSignatures extends Object.SignalSignatures {
            "notify::always-destroy": (pspec: GObject.ParamSpec) => void;
            "notify::is-global-memory": (pspec: GObject.ParamSpec) => void;
            "notify::native": (pspec: GObject.ParamSpec) => void;
            "notify::native-destroy-func": (pspec: GObject.ParamSpec) => void;
            "notify::owner": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends Object.ConstructorProps {}
    }

    /**
     * This is the ICalStrArray instance.
     * @gir-type Class
     */
    class StrArray extends Object {
        static $gtype: GObject.GType<StrArray>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: StrArray.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<StrArray.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        static ["new"](increment_size: number): StrArray;

        // Signals
        /** @signal */
        connect<K extends keyof StrArray.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, StrArray.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof StrArray.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, StrArray.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof StrArray.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<StrArray.SignalSignatures[K]>): void;

        // Methods
        /**
         * Creates a deep copy of {@link ICalGLib.StrArray} with the same properties as the `array`.
         * @returns The newly cloned {@link ICalGLib.StrArray} with the same value as the `array`
         * @since 4.0
         */
        clone(): StrArray;

        /**
         * Removes all the occurrences of the `value` in the `array`.
         * @param value The value to remove.
         * @since 4.0
         */
        remove(value: string): void;

        /**
         * Removes the element at the `position` from the `array`.
         * @param position The position in which the element will be removed from the array
         * @since 4.0
         */
        remove_element_at(position: bigint | number): void;

        /**
         * Gets the size of the array.
         * @returns The size of current array.
         * @since 4.0
         */
        size(): number;
    }


    namespace Time {
        // Signal signatures
        interface SignalSignatures extends Object.SignalSignatures {
            "notify::always-destroy": (pspec: GObject.ParamSpec) => void;
            "notify::is-global-memory": (pspec: GObject.ParamSpec) => void;
            "notify::native": (pspec: GObject.ParamSpec) => void;
            "notify::native-destroy-func": (pspec: GObject.ParamSpec) => void;
            "notify::owner": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends Object.ConstructorProps {}
    }

    /**
     * This is the ICalTime instance.
     * @gir-type Class
     */
    class Time extends Object {
        static $gtype: GObject.GType<Time>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: Time.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<Time.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        static ["new"](): Time;

        static new_current_with_zone(zone: Timezone | null): Time;

        static new_from_day_of_year(day: number, year: number): Time;

        static new_from_string(str: string): Time;

        static new_from_timet_with_zone(v: bigint | number, is_date: boolean, zone: Timezone | null): Time;

        static new_null_date(): Time;

        static new_null_time(): Time;

        static new_today(): Time;

        // Signals
        /** @signal */
        connect<K extends keyof Time.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Time.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof Time.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Time.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof Time.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<Time.SignalSignatures[K]>): void;

        // Static methods
        /**
         * Gets the number of days in the target month in the target year.
         * @param month The target month
         * @param year The target year
         * @since 1.0
         */
        static days_in_month(month: number, year: number): number;

        /**
         * Returns the number of days in this year.
         * @param year The target year
         * @since 2.0
         */
        static days_in_year(year: number): number;

        /**
         * Checks whether a year is a leap year.
         * @param year The target year
         * @since 1.0
         */
        static days_is_leap_year(year: number): boolean;

        /**
         * Applies a list of timezone changes on the array of components until the end year.
         * @param comp The {@link ICalGLib.Component}
         * @param end_year The end year
         * @param changes The changes to be applies
         * @since 2.0
         */
        static timezone_expand_vtimezone(comp: Component, end_year: number, changes: Array): void;

        // Methods
        /**
         * Adds or subtracts a number of days, hours, minutes and seconds from `tt`.
         * @param days Difference of days adjusted
         * @param hours Difference of hours adjusted
         * @param minutes Difference of minutes adjusted
         * @param seconds Difference of seconds adjusted
         * @since 1.0
         */
        adjust(days: number, hours: number, minutes: number, seconds: number): void;

        /**
         * Returns a string representation of the time, in RFC2445 format.
         * @returns The string representation
         * @since 1.0
         */
        as_ical_string(): string;

        /**
         * Returns the time as seconds past the UNIX epoch.
         * @returns The time as seconds past the UNIX epoch
         * @since 1.0
         */
        as_timet(): number;

        /**
         * Returns the time as seconds past the UNIX epoch, using timezones.
         * @param zone The timezone
         * @returns The time as seconds past the UNIX epoch
         * @since 1.0
         */
        as_timet_with_zone(zone: Timezone | null): number;

        /**
         * Creates a new {@link ICalGLib.Time}, copy of `timetype`.
         * @returns The newly created {@link ICalGLib.Time}, copy of `timetype`.
         * @since 1.0
         */
        clone(): Time;

        /**
         * i_cal_time_compare returns an integer indicating the result of the comparison, as follow:
         * @param b The {@link ICalGLib.Time} to be compared
         * @returns -1, 0, or 1 to indicate that a less than b, a==b or a larger than b.
         * @since 1.0
         */
        compare(b: Time): number;

        /**
         * Like `i_cal_time_compare()`, but only use the date parts.
         * @param b The {@link ICalGLib.Time} to be compared
         * @returns -1, 0, or 1 to indicate that a less than b, a==b or a larger than b.
         * @since 1.0
         */
        compare_date_only(b: Time): number;

        /**
         * Like `i_cal_time_compare_tz()`, but only use the date parts; accepts timezone.
         * @param b The {@link ICalGLib.Time} to be compared
         * @param zone The target timezone
         * @returns -1, 0, or 1 to indicate that a less than b, a==b or a larger than b.
         * @since 1.0
         */
        compare_date_only_tz(b: Time, zone: Timezone | null): number;

        /**
         * Convert time from one timezone to another.
         * @param from_zone From timezone
         * @param to_zone To timezone
         * @since 1.0
         */
        convert_timezone(from_zone: Timezone | null, to_zone: Timezone | null): void;

        /**
         * Converts `tt` to `zone` and return new {@link ICalGLib.Time} object.
         * @param zone The target timezone
         * @returns The converted {@link ICalGLib.Time}
         * @since 1.0
         */
        convert_to_zone(zone: Timezone | null): Time;

        /**
         * Converts `tt` to `zone` and store the result into `tt`.
         * @param zone The target timezone
         * @since 3.0.5
         */
        convert_to_zone_inplace(zone: Timezone | null): void;

        /**
         * Returns the day of the week of the given time. Sunday is 1.
         * @returns The day of the week of the given time. Sunday is 1.
         * @since 1.0
         */
        day_of_week(): number;

        /**
         * Returns the day of the year of the given time.
         * @returns The day of the year of the given time. Returns 0 if the specified time is invalid (eg. month less than 1 or greater than 12).
         * @since 1.0
         */
        day_of_year(): number;

        /**
         * Gets the year/month/date parts of the `timetype` in one call.
         * @since 1.0
         */
        get_date(): [number, number, number];

        /**
         * Gets the day of {@link ICalGLib.Time}.
         * @returns The day.
         * @since 1.0
         */
        get_day(): number;

        /**
         * Gets the hour of {@link ICalGLib.Time}.
         * @returns The hour.
         * @since 1.0
         */
        get_hour(): number;

        /**
         * Gets the minute of {@link ICalGLib.Time}.
         * @returns The minute.
         * @since 1.0
         */
        get_minute(): number;

        /**
         * Gets the month of {@link ICalGLib.Time}.
         * @returns The month.
         * @since 1.0
         */
        get_month(): number;

        /**
         * Gets the second of {@link ICalGLib.Time}.
         * @returns The second.
         * @since 1.0
         */
        get_second(): number;

        /**
         * Gets the hour/minute/second parts of the `timetype` in one call.
         * @since 1.0
         */
        get_time(): [number, number, number];

        /**
         * Returns the timezone, the {@link ICalGLib.Timezone} object is cached and can be either unreferenced once the last
         * instance is used or can be kept until `i_cal_object_free_global_objects()` is called (usually at the very
         * end of the program).
         * @returns The timezone information
         * @since 1.0
         */
        get_timezone(): Timezone;

        /**
         * Returns the tzid, or NULL for a floating time.
         * @returns The tzid of {@link ICalGLib.Time}, or NULL if floating type
         * @since 1.0
         */
        get_tzid(): string | null;

        /**
         * Gets the year of {@link ICalGLib.Time}.
         * @returns The year.
         * @since 1.0
         */
        get_year(): number;

        /**
         * Returns true if time is of DATE type, false if DATE-TIME.
         * @returns True if time is of DATE type, false if DATE-TIME.
         * @since 1.0
         */
        is_date(): boolean;

        /**
         * Gets the is_daylight of {@link ICalGLib.Time}.
         * @returns The is_daylight.
         * @since 1.0
         */
        is_daylight(): boolean;

        /**
         * Returns true if the time is null.
         * @returns Whether `tt` is null_time. true if yes, false if not.
         * @since 1.0
         */
        is_null_time(): boolean;

        /**
         * Returns true if time is relative to UTC zone.
         * @returns True if time is relative to UTC zone.
         * @since 1.0
         */
        is_utc(): boolean;

        /**
         * Returns true if the time is invalid.
         * @returns Whether `tt` is valid true if yes, false if not.
         * @since 1.0
         */
        is_valid_time(): boolean;

        /**
         * Normalizes the icaltime, so that all fields are within the normal range.
         * @returns The {@link ICalGLib.Time} normalized
         * @since 1.0
         */
        normalize(): Time;

        /**
         * Normalizes the `tt`, so that all fields are within the normal range.
         * @since 3.0.5
         */
        normalize_inplace(): void;

        /**
         * Sets the year/month/date parts of the `timetype` in one call. This doesn't verify validity of the given
         * date.
         * @param year The 'year' part of the date
         * @param month The 'month' part of the date
         * @param day The 'day' part of the date
         * @since 1.0
         */
        set_date(year: number, month: number, day: number): void;

        /**
         * Sets the day of {@link ICalGLib.Time}.
         * @param day The day
         * @since 1.0
         */
        set_day(day: number): void;

        /**
         * Sets the hour of {@link ICalGLib.Time}.
         * @param hour The hour
         * @since 1.0
         */
        set_hour(hour: number): void;

        /**
         * Sets the is_date of {@link ICalGLib.Time}.
         * @param is_date The is_date
         * @since 1.0
         */
        set_is_date(is_date: boolean): void;

        /**
         * Sets the is_daylight of {@link ICalGLib.Time}.
         * @param is_daylight The is_daylight
         * @since 1.0
         */
        set_is_daylight(is_daylight: boolean): void;

        /**
         * Sets the minute of {@link ICalGLib.Time}.
         * @param minute The minute
         * @since 1.0
         */
        set_minute(minute: number): void;

        /**
         * Sets the month of {@link ICalGLib.Time}.
         * @param month The month
         * @since 1.0
         */
        set_month(month: number): void;

        /**
         * Sets the second of {@link ICalGLib.Time}.
         * @param second The second
         * @since 1.0
         */
        set_second(second: number): void;

        /**
         * Sets the hour/minute/second parts of the `timetype` in one call. This doesn't verify validity of the given
         * time.
         * @param hour The 'hour' part of the time
         * @param minute The 'minute' part of the time
         * @param second The 'second' part of the time
         * @since 1.0
         */
        set_time(hour: number, minute: number, second: number): void;

        /**
         * Sets the timezone of the `tt`.
         * @param zone The timezone
         * @since 1.0
         */
        set_timezone(zone: Timezone | null): void;

        /**
         * Sets the year of {@link ICalGLib.Time}.
         * @param year The year
         * @since 1.0
         */
        set_year(year: number): void;

        /**
         * Returns the day of the year for the first day of the week that the given time is within.
         * @param fdow The first day of the week
         * @returns The day of the year for the Sunday of the week that the given time is within.
         * @since 1.0
         */
        start_doy_week(fdow: number): number;
    }


    namespace TimeSpan {
        // Signal signatures
        interface SignalSignatures extends Object.SignalSignatures {
            "notify::always-destroy": (pspec: GObject.ParamSpec) => void;
            "notify::is-global-memory": (pspec: GObject.ParamSpec) => void;
            "notify::native": (pspec: GObject.ParamSpec) => void;
            "notify::native-destroy-func": (pspec: GObject.ParamSpec) => void;
            "notify::owner": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends Object.ConstructorProps {}
    }

    /**
     * This is the ICalTimeSpan instance.
     * @gir-type Class
     */
    class TimeSpan extends Object {
        static $gtype: GObject.GType<TimeSpan>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: TimeSpan.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<TimeSpan.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        static ["new"](dtstart: Time, dtend: Time, is_busy: number): TimeSpan;

        static new_timet(start: bigint | number, end: bigint | number, is_busy: boolean): TimeSpan;

        // Signals
        /** @signal */
        connect<K extends keyof TimeSpan.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, TimeSpan.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof TimeSpan.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, TimeSpan.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof TimeSpan.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<TimeSpan.SignalSignatures[K]>): void;

        // Methods
        /**
         * Creates a new {@link ICalGLib.TimeSpan}, clone of `src`. Free it with `g_object_unref()`, when no longer needed.
         * @returns The newly created {@link ICalGLib.TimeSpan}, clone of `src`.
         * @since 3.0.5
         */
        clone(): TimeSpan;

        /**
         * Checks whether one {@link ICalGLib.TimeSpan} is contained in another {@link ICalGLib.TimeSpan}.
         * @param container The target container of {@link ICalGLib.TimeSpan}
         * @returns Whether one {@link ICalGLib.TimeSpan} is contained in another {@link ICalGLib.TimeSpan}.
         * @since 1.0
         */
        contains(container: TimeSpan): number;

        /**
         * Gets the end of {@link ICalGLib.TimeSpan}.
         * @returns The end.
         * @since 1.0
         */
        get_end(): number;

        /**
         * Gets the is_busy of {@link ICalGLib.TimeSpan}.
         * @returns The is_busy.
         * @since 1.0
         */
        get_is_busy(): boolean;

        /**
         * Gets the start of {@link ICalGLib.TimeSpan}.
         * @returns The start.
         * @since 1.0
         */
        get_start(): number;

        /**
         * Checks whether two spans overlap.
         * @param s2 The second {@link ICalGLib.TimeSpan}
         * @returns Whether these two span are overlapped.
         * @since 1.0
         */
        overlaps(s2: TimeSpan): number;

        /**
         * Sets the end of {@link ICalGLib.TimeSpan}.
         * @param end The end
         * @since 1.0
         */
        set_end(end: bigint | number): void;

        /**
         * Sets the is_busy of {@link ICalGLib.TimeSpan}.
         * @param is_busy The is_busy
         * @since 1.0
         */
        set_is_busy(is_busy: boolean): void;

        /**
         * Sets the start of {@link ICalGLib.TimeSpan}.
         * @param start The start
         * @since 1.0
         */
        set_start(start: bigint | number): void;
    }


    namespace Timezone {
        // Signal signatures
        interface SignalSignatures extends Object.SignalSignatures {
            "notify::always-destroy": (pspec: GObject.ParamSpec) => void;
            "notify::is-global-memory": (pspec: GObject.ParamSpec) => void;
            "notify::native": (pspec: GObject.ParamSpec) => void;
            "notify::native-destroy-func": (pspec: GObject.ParamSpec) => void;
            "notify::owner": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends Object.ConstructorProps {}
    }

    /**
     * This is the ICalTimezone instance.
     * @gir-type Class
     */
    class Timezone extends Object {
        static $gtype: GObject.GType<Timezone>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: Timezone.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<Timezone.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        static ["new"](): Timezone;

        // Signals
        /** @signal */
        connect<K extends keyof Timezone.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Timezone.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof Timezone.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Timezone.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof Timezone.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<Timezone.SignalSignatures[K]>): void;

        // Static methods
        /**
         * Gets the {@link ICalGLib.Timezone} at specified position in array.
         * @param timezones The array to be visited
         * @param index The index
         * @since 1.0
         */
        static array_element_at(timezones: Array, index: number): Timezone;

        /**
         * Frees any builtin timezone information.
         * @since 1.0
         */
        static free_builtin_timezones(): void;

        /**
         * Frees memory dedicated to the zonefile directory.
         * @since 1.0
         */
        static free_zone_directory(): void;

        /**
         * Returns a single builtin timezone, given its Olson city name.
         * @param location The location representing the timezone
         * @since 1.0
         */
        static get_builtin_timezone(location: string | null): Timezone | null;

        /**
         * Returns a single builtin timezone, given its offset.
         * @param offset The offset used to get the {@link ICalGLib.Timezone}
         * @param tzname The reference {@link ICalGLib.Timezone} name
         * @since 1.0
         */
        static get_builtin_timezone_from_offset(offset: number, tzname: string | null): Timezone;

        /**
         * Returns a single builtin timezone, given its TZID.
         * @param tzid The tzid name
         * @since 1.0
         */
        static get_builtin_timezone_from_tzid(tzid: string | null): Timezone;

        /**
         * Returns a list of builtin timezones.
         * @since 1.0
         */
        static get_builtin_timezones(): Array;

        /**
         * Gets whether to use builtin timezones files.
         * @since 2.0
         */
        static get_builtin_tzdata(): boolean;

        /**
         * Gets the location of the vtimezone in component.
         * @param component The {@link ICalGLib.Component} to be queried
         * @since 2.0
         */
        static get_location_from_vtimezone(component: Component): string | null;

        /**
         * Returns the full path to the system zoneinfo directory (where zone.tab lives).
         * @since 4.0
         */
        static get_system_zone_directory(): string;

        /**
         * Returns the current timezone ID prefix used by the libical. See `i_cal_timezone_set_tzid_prefix()`.
         * @since 4.0
         */
        static get_tzid_prefix(): string;

        /**
         * Gets the name of the vtimezone in component.
         * @param component The {@link ICalGLib.Component} to be queried
         * @since 2.0
         */
        static get_tznames_from_vtimezone(component: Component): string | null;

        /**
         * Returns the UTC timezone.
         * @since 1.0
         */
        static get_utc_timezone(): Timezone;

        /**
         * Gets the directory to look for the zonefiles.
         * @since 3.0.17
         */
        static get_zone_directory(): string;

        /**
         * Sets whether to use builtin timezones files.
         * @param set Whether to use builtin timezones files
         * @since 2.0
         */
        static set_builtin_tzdata(set: boolean): void;

        /**
         * Sets the full path to the system zoneinfo directory (where zone.tab lives).
         * @param path The path to look for the zonefiles
         * @since 4.0
         */
        static set_system_zone_directory(path: string): void;

        /**
         * Sets the prefix to be used for tzid's generated from system tzdata. Must be globally unique (such as
         * a domain name owned by the developer of the calling application), and begin and end with forward slashes.
         * Do not change or de-allocate the string buffer after calling this.
         * @param new_prefix The {@link ICalGLib.Timezone} to be set
         * @since 1.0
         */
        static set_tzid_prefix(new_prefix: string): void;

        /**
         * Sets the directory to look for the zonefiles.
         * @param path The path to look for the zonefiles
         * @since 1.0
         */
        static set_zone_directory(path: string): void;

        /**
         * Truncate a VTIMEZONE component to the given start and end times.
         * If either time is null, then no truncation
         * will occur at that point.
         * If either time is non-null, then it MUST be specified as UTC.
         * If the start
         * time is non-null and ms_compatible is zero,
         * then the DTSTART of RRULEs will be adjusted to occur after
         * the start time.
         * @param comp an {@link ICalGLib.Component}
         * @param start a start {@link ICalGLib.Time}
         * @param end an end {@link ICalGLib.Time}
         * @param ms_compatible whether to truncate the timezone in a Microsoft-compatible way
         * @since 4.0
         */
        static truncate_vtimezone(comp: Component, start: Time, end: Time, ms_compatible: boolean): void;

        // Methods
        /**
         * The clone method for {@link ICalGLib.Timezone}.
         * @returns The newly created {@link ICalGLib.Timezone} with the same values as `zone`
         * @since 1.0
         */
        copy(): Timezone;

        /**
         * Outputs a list of timezone changes for the given timezone to the given file, up to the maximum year given.
         * @param max_year Max year
         * @param fp The file handle
         * @returns true if success.
         * @since 1.0
         */
        dump_changes(max_year: number, fp: null): boolean;

        /**
         * Returns the VTIMEZONE component of a timezone.
         * @returns The VTIMEZONE component of the `zone`.
         * @since 1.0
         */
        get_component(): Component;

        /**
         * Gets the display name of the `zone`.
         * @returns The display name of `zone`
         * @since 1.0
         */
        get_display_name(): string;

        /**
         * Returns the latitude of a builtin timezone.
         * @returns The latitude of the {@link ICalGLib.Timezone}
         * @since 1.0
         */
        get_latitude(): number;

        /**
         * Returns the city name of a timezone, or `null`, when none is set or when `zone` is also `null`.
         * @returns The location of the {@link ICalGLib.Timezone}, or `null`
         * @since 1.0
         */
        get_location(): string | null;

        /**
         * Returns the longitude of a builtin timezone.
         * @returns The longitude of the {@link ICalGLib.Timezone}.
         * @since 1.0
         */
        get_longitude(): number;

        /**
         * Returns the TZID of a timezone, or `null`, when none is set or when `zone` is also `null`.
         * @returns The timezone id, or `null`
         * @since 1.0
         */
        get_tzid(): string | null;

        /**
         * Returns the TZNAME properties used in the latest STANDARD and DAYLIGHT components. If they are the same
         * it will return just one, e.g. "LMT". If they are different it will format them like "EST/EDT". Note that
         * this may also return NULL.
         * @returns The timezone name
         * @since 1.0
         */
        get_tznames(): string | null;

        /**
         * Calculates the UTC offset of a given local time in the given timezone.  It is the number of seconds to
         * add to UTC to get local time.  The is_daylight flag is set to 1 if the time is in daylight-savings time.
         * @param tt The local time
         * @returns UTC offset of the `zone`
         * @since 1.0
         */
        get_utc_offset(tt: Time | null): [number, number];

        /**
         * Calculates the UTC offset of a given UTC time in the given timezone.  It is the number of seconds to
         * add to UTC to get local time.  The is_daylight flag is set to 1 if the time is in daylight-savings time.
         * @param tt The local time
         * @returns UTC offset of the `zone`
         * @since 1.0
         */
        get_utc_offset_of_utc_time(tt: Time): [number, number];

        /**
         * Sets the VTIMEZONE component of {@link ICalGLib.Timezone}, initializing the tzid, location and tzname fields. It
         * returns 1 on success or 0 on failure, i.e. no TZID was found.
         * 
         * `note` The `zone` assumes ownership
         * of the `comp`, thus make sure you pass an unowned {@link ICalGLib.Component}.
         * @param comp The VTIMEZONE component of an {@link ICalGLib.Timezone}, initializing the tzid, location and tzname fields
         * @returns Whether the action is successful. 1 for success, 0 for failure.
         * @since 1.0
         */
        set_component(comp: Component): number;
    }


    namespace Trigger {
        // Signal signatures
        interface SignalSignatures extends Object.SignalSignatures {
            "notify::always-destroy": (pspec: GObject.ParamSpec) => void;
            "notify::is-global-memory": (pspec: GObject.ParamSpec) => void;
            "notify::native": (pspec: GObject.ParamSpec) => void;
            "notify::native-destroy-func": (pspec: GObject.ParamSpec) => void;
            "notify::owner": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends Object.ConstructorProps {}
    }

    /**
     * This is the ICalTrigger instance.
     * @gir-type Class
     */
    class Trigger extends Object {
        static $gtype: GObject.GType<Trigger>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: Trigger.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<Trigger.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        static new_from_seconds(reltime: number): Trigger;

        static new_from_string(str: string): Trigger;

        // Signals
        /** @signal */
        connect<K extends keyof Trigger.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Trigger.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof Trigger.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Trigger.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof Trigger.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<Trigger.SignalSignatures[K]>): void;

        // Methods
        /**
         * Gets the duration from {@link ICalGLib.Trigger}.
         * @returns The duration of {@link ICalGLib.Trigger}.
         * @since 1.0
         */
        get_duration(): Duration;

        /**
         * Gets the time from {@link ICalGLib.Trigger}.
         * @returns The time of {@link ICalGLib.Trigger}.
         * @since 1.0
         */
        get_time(): Time;

        /**
         * Checks if a {@link ICalGLib.Trigger} is a bad trigger.
         * @returns true if yes, false if not.
         * @since 1.0
         */
        is_bad_trigger(): boolean;

        /**
         * Checks if a {@link ICalGLib.Trigger} is a null trigger.
         * @returns true if yes, false if not.
         * @since 1.0
         */
        is_null_trigger(): boolean;

        /**
         * Sets the duration from {@link ICalGLib.Trigger}.
         * @param duration The duration of {@link ICalGLib.Trigger}
         * @since 1.0
         */
        set_duration(duration: Duration): void;

        /**
         * Sets the time from {@link ICalGLib.Trigger}.
         * @param time The time of {@link ICalGLib.Trigger}
         * @since 1.0
         */
        set_time(time: Time): void;
    }


    namespace Value {
        // Signal signatures
        interface SignalSignatures extends Object.SignalSignatures {
            "notify::always-destroy": (pspec: GObject.ParamSpec) => void;
            "notify::is-global-memory": (pspec: GObject.ParamSpec) => void;
            "notify::native": (pspec: GObject.ParamSpec) => void;
            "notify::native-destroy-func": (pspec: GObject.ParamSpec) => void;
            "notify::owner": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends Object.ConstructorProps {}
    }

    /**
     * This is the ICalValue instance.
     * @gir-type Class
     */
    class Value extends Object {
        static $gtype: GObject.GType<Value>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: Value.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<Value.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        static ["new"](kind: ValueKind): Value;

        static new_action(value: PropertyAction): Value;

        static new_attach(value: Attach): Value;

        static new_binary(value: string): Value;

        static new_boolean(value: boolean): Value;

        static new_busytype(value: PropertyBusytype): Value;

        static new_caladdress(value: string): Value;

        static new_carlevel(value: PropertyCarlevel): Value;

        static new_class(value: PropertyClassenum): Value;

        static new_cmd(value: PropertyCmd): Value;

        static new_color(value: string): Value;

        static new_date(value: Time): Value;

        static new_datetime(value: Time): Value;

        static new_datetimedate(value: Time): Value;

        static new_datetimeperiod(value: Datetimeperiod): Value;

        static new_duration(value: Duration): Value;

        static new_float(value: number): Value;

        static new_from_string(kind: ValueKind, str: string): Value;

        static new_geo(value: Geo): Value;

        static new_integer(value: number): Value;

        static new_method(value: PropertyMethod): Value;

        static new_participanttype(value: PropertyParticipanttype): Value;

        static new_period(value: Period): Value;

        static new_pollcompletion(value: PropertyPollcompletion): Value;

        static new_pollmode(value: PropertyPollmode): Value;

        static new_proximity(value: PropertyProximity): Value;

        static new_query(value: string): Value;

        static new_querylevel(value: PropertyQuerylevel): Value;

        static new_recur(value: Recurrence): Value;

        static new_requeststatus(value: Reqstat): Value;

        static new_resourcetype(value: PropertyResourcetype): Value;

        static new_status(value: PropertyStatus): Value;

        static new_string(value: string): Value;

        static new_taskmode(value: PropertyTaskmode): Value;

        static new_text(value: string): Value;

        static new_transp(value: PropertyTransp): Value;

        static new_trigger(value: Trigger): Value;

        static new_uid(value: string): Value;

        static new_uri(value: string): Value;

        static new_utcoffset(value: number): Value;

        static new_x(value: string): Value;

        static new_xlicclass(value: PropertyXlicclass): Value;

        static new_xmlreference(value: string): Value;

        // Signals
        /** @signal */
        connect<K extends keyof Value.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Value.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof Value.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, Value.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof Value.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<Value.SignalSignatures[K]>): void;

        // Static methods
        /**
         * Extracts the original character string encoded by the above function.
         * @param szText A string
         * @since 1.0
         */
        static decode_ical_string(szText: string): string | null;

        /**
         * Encodes a character string in ical format, escape certain characters, etc.
         * @param szText A string
         * @since 1.0
         */
        static encode_ical_string(szText: string): string | null;

        /**
         * Converts a string to {@link ICalGLib.ValueKind}.
         * @param str A string
         * @since 1.0
         */
        static kind_from_string(str: string): ValueKind;

        /**
         * Checks whether the {@link ICalGLib.ValueKind} is valid.
         * @param kind The {@link ICalGLib.ValueKind} to be checked
         * @since 1.0
         */
        static kind_is_valid(kind: ValueKind): boolean;

        /**
         * Converts a {@link ICalGLib.ValueKind} to a {@link ICalGLib.PropertyKind}.
         * @param kind A {@link ICalGLib.ValueKind}
         * @since 1.0
         */
        static kind_to_property_kind(kind: ValueKind): PropertyKind;

        /**
         * Converts the {@link ICalGLib.ValueKind} to a string.
         * @param kind A {@link ICalGLib.ValueKind}
         * @since 1.0
         */
        static kind_to_string(kind: ValueKind): string;

        // Methods
        /**
         * Converts the {@link ICalGLib.Value} to a string.
         * @returns The string representation.
         * @since 1.0
         */
        as_ical_string(): string;

        /**
         * Deeply clone a {@link ICalGLib.Value}.
         * @returns The newly created {@link ICalGLib.Value} with the same property as `value`.
         * @since 4.0
         */
        clone(): Value;

        /**
         * Compares two {@link ICalGLib.Value}. If the values do not have the same type ICAL_XLICCOMPARETYPE_NOTEQUAL is returned.
         * ICAL_XLICCOMPARETYPE_NONE is returned if the values type is unknown or one of the values is null.
         * @param b A {@link ICalGLib.Value}
         * @returns The compare result.
         * @since 1.0
         */
        compare(b: Value): ParameterXliccomparetype;

        /**
         * Returns value of the ACTION `self`
         * @returns the ACTION value
         * @since 1.0
         */
        get_action(): PropertyAction;

        /**
         * Returns value of the ATTACH `self`
         * @returns the ATTACH value
         * @since 1.0
         */
        get_attach(): Attach;

        /**
         * Returns value of the BINARY `self`
         * @returns the BINARY value
         * @since 1.0
         */
        get_binary(): string;

        /**
         * Returns value of the BOOLEAN `self`
         * @returns the BOOLEAN value
         * @since 1.0
         */
        get_boolean(): boolean;

        /**
         * Returns value of the BUSYTYPE `self`
         * @returns the BUSYTYPE value
         * @since 2.0
         */
        get_busytype(): PropertyBusytype;

        /**
         * Returns value of the CALADDRESS `self`
         * @returns the CALADDRESS value
         * @since 1.0
         */
        get_caladdress(): string;

        /**
         * Returns value of the CARLEVEL `self`
         * @returns the CARLEVEL value
         * @since 1.0
         */
        get_carlevel(): PropertyCarlevel;

        /**
         * Returns value of the CLASS `self`
         * @returns the CLASS value
         * @since 1.0
         */
        get_class(): PropertyClassenum;

        /**
         * Returns value of the CMD `self`
         * @returns the CMD value
         * @since 1.0
         */
        get_cmd(): PropertyCmd;

        /**
         * Returns value of the COLOR `self`
         * @returns the COLOR value
         * @since 1.0
         */
        get_color(): string;

        /**
         * Returns value of the DATE `self`
         * @returns the DATE value
         * @since 1.0
         */
        get_date(): Time;

        /**
         * Returns value of the DATETIME `self`
         * @returns the DATETIME value
         * @since 1.0
         */
        get_datetime(): Time;

        /**
         * Returns value of the DATETIMEDATE `self`
         * @returns the DATETIMEDATE value
         * @since 3.0
         */
        get_datetimedate(): Time;

        /**
         * Returns value of the DATETIMEPERIOD `self`
         * @returns the DATETIMEPERIOD value
         * @since 1.0
         */
        get_datetimeperiod(): Datetimeperiod;

        /**
         * Returns value of the DURATION `self`
         * @returns the DURATION value
         * @since 1.0
         */
        get_duration(): Duration;

        /**
         * Returns value of the FLOAT `self`
         * @returns the FLOAT value
         * @since 1.0
         */
        get_float(): number;

        /**
         * Returns value of the GEO `self`
         * @returns the GEO value
         * @since 1.0
         */
        get_geo(): Geo;

        /**
         * Returns value of the INTEGER `self`
         * @returns the INTEGER value
         * @since 1.0
         */
        get_integer(): number;

        /**
         * Returns value of the METHOD `self`
         * @returns the METHOD value
         * @since 1.0
         */
        get_method(): PropertyMethod;

        /**
         * Gets the parent {@link ICalGLib.Property} of the specified {@link ICalGLib.Value}.
         * @returns The parent {@link ICalGLib.Property}
         * @since 3.0
         */
        get_parent(): Property | null;

        /**
         * Returns value of the PARTICIPANTTYPE `self`
         * @returns the PARTICIPANTTYPE value
         * @since 4.0
         */
        get_participanttype(): PropertyParticipanttype;

        /**
         * Returns value of the PERIOD `self`
         * @returns the PERIOD value
         * @since 1.0
         */
        get_period(): Period;

        /**
         * Returns value of the POLLCOMPLETION `self`
         * @returns the POLLCOMPLETION value
         * @since 2.0
         */
        get_pollcompletion(): PropertyPollcompletion;

        /**
         * Returns value of the POLLMODE `self`
         * @returns the POLLMODE value
         * @since 2.0
         */
        get_pollmode(): PropertyPollmode;

        /**
         * Returns value of the PROXIMITY `self`
         * @returns the PROXIMITY value
         * @since 4.0
         */
        get_proximity(): PropertyProximity;

        /**
         * Returns value of the QUERY `self`
         * @returns the QUERY value
         * @since 1.0
         */
        get_query(): string;

        /**
         * Returns value of the QUERYLEVEL `self`
         * @returns the QUERYLEVEL value
         * @since 1.0
         */
        get_querylevel(): PropertyQuerylevel;

        /**
         * Returns value of the RECUR `self`
         * @returns the RECUR value
         * @since 1.0
         */
        get_recur(): Recurrence;

        /**
         * Returns value of the REQUESTSTATUS `self`
         * @returns the REQUESTSTATUS value
         * @since 1.0
         */
        get_requeststatus(): Reqstat;

        /**
         * Returns value of the RESOURCETYPE `self`
         * @returns the RESOURCETYPE value
         * @since 4.0
         */
        get_resourcetype(): PropertyResourcetype;

        /**
         * Returns value of the STATUS `self`
         * @returns the STATUS value
         * @since 1.0
         */
        get_status(): PropertyStatus;

        /**
         * Returns value of the STRING `self`
         * @returns the STRING value
         * @since 1.0
         */
        get_string(): string;

        /**
         * Returns value of the TASKMODE `self`
         * @returns the TASKMODE value
         * @since 2.0
         */
        get_taskmode(): PropertyTaskmode;

        /**
         * Returns value of the TEXT `self`
         * @returns the TEXT value
         * @since 1.0
         */
        get_text(): string;

        /**
         * Returns value of the TRANSP `self`
         * @returns the TRANSP value
         * @since 1.0
         */
        get_transp(): PropertyTransp;

        /**
         * Returns value of the TRIGGER `self`
         * @returns the TRIGGER value
         * @since 1.0
         */
        get_trigger(): Trigger;

        /**
         * Returns value of the UID `self`
         * @returns the UID value
         * @since 4.0
         */
        get_uid(): string;

        /**
         * Returns value of the URI `self`
         * @returns the URI value
         * @since 1.0
         */
        get_uri(): string;

        /**
         * Returns value of the UTCOFFSET `self`
         * @returns the UTCOFFSET value
         * @since 1.0
         */
        get_utcoffset(): number;

        /**
         * Returns value of the X `self`
         * @returns the X value
         * @since 1.0
         */
        get_x(): string;

        /**
         * Returns value of the XLICCLASS `self`
         * @returns the XLICCLASS value
         * @since 1.0
         */
        get_xlicclass(): PropertyXlicclass;

        /**
         * Returns value of the XMLREFERENCE `self`
         * @returns the XMLREFERENCE value
         * @since 4.0
         */
        get_xmlreference(): string;

        /**
         * Checks if {@link ICalGLib.Value} is valid.
         * @returns true if valid, false if not.
         * @since 1.0
         */
        is_valid(): boolean;

        /**
         * Gets the kind of {@link ICalGLib.Value}.
         * @returns The kind of `value`.
         * @since 1.0
         */
        isa(): ValueKind;

        /**
         * Checks whether the native part of {@link ICalGLib.Value} is an icalvalue.
         * @returns true if yes, false if not.
         * @since 1.0
         */
        isa_value(): boolean;

        /**
         * Resets the kind of {@link ICalGLib.Value}.
         * @since 1.0
         */
        reset_kind(): void;

        /**
         * Sets value to the ACTION `self`
         * @param value the ACTION value
         * @since 1.0
         */
        set_action(value: PropertyAction): void;

        /**
         * Sets value to the ATTACH `self`
         * @param value the ATTACH value
         * @since 1.0
         */
        set_attach(value: Attach): void;

        /**
         * Sets value to the BINARY `self`
         * @param value the BINARY value
         * @since 1.0
         */
        set_binary(value: string): void;

        /**
         * Sets value to the BOOLEAN `self`
         * @param value the BOOLEAN value
         * @since 1.0
         */
        set_boolean(value: boolean): void;

        /**
         * Sets value to the BUSYTYPE `self`
         * @param value the BUSYTYPE value
         * @since 2.0
         */
        set_busytype(value: PropertyBusytype): void;

        /**
         * Sets value to the CALADDRESS `self`
         * @param value the CALADDRESS value
         * @since 1.0
         */
        set_caladdress(value: string): void;

        /**
         * Sets value to the CARLEVEL `self`
         * @param value the CARLEVEL value
         * @since 1.0
         */
        set_carlevel(value: PropertyCarlevel): void;

        /**
         * Sets value to the CLASS `self`
         * @param value the CLASS value
         * @since 1.0
         */
        set_class(value: PropertyClassenum): void;

        /**
         * Sets value to the CMD `self`
         * @param value the CMD value
         * @since 1.0
         */
        set_cmd(value: PropertyCmd): void;

        /**
         * Sets value to the COLOR `self`
         * @param value the COLOR value
         * @since 1.0
         */
        set_color(value: string): void;

        /**
         * Sets value to the DATE `self`
         * @param value the DATE value
         * @since 1.0
         */
        set_date(value: Time): void;

        /**
         * Sets value to the DATETIME `self`
         * @param value the DATETIME value
         * @since 1.0
         */
        set_datetime(value: Time): void;

        /**
         * Sets value to the DATETIMEDATE `self`
         * @param value the DATETIMEDATE value
         * @since 3.0
         */
        set_datetimedate(value: Time): void;

        /**
         * Sets value to the DATETIMEPERIOD `self`
         * @param value the DATETIMEPERIOD value
         * @since 1.0
         */
        set_datetimeperiod(value: Datetimeperiod): void;

        /**
         * Sets value to the DURATION `self`
         * @param value the DURATION value
         * @since 1.0
         */
        set_duration(value: Duration): void;

        /**
         * Sets value to the FLOAT `self`
         * @param value the FLOAT value
         * @since 1.0
         */
        set_float(value: number): void;

        /**
         * Sets value to the GEO `self`
         * @param value the GEO value
         * @since 1.0
         */
        set_geo(value: Geo): void;

        /**
         * Sets value to the INTEGER `self`
         * @param value the INTEGER value
         * @since 1.0
         */
        set_integer(value: number): void;

        /**
         * Sets value to the METHOD `self`
         * @param value the METHOD value
         * @since 1.0
         */
        set_method(value: PropertyMethod): void;

        /**
         * Sets the parent property of a value.
         * @param property The parent {@link ICalGLib.Property}
         * @since 2.0
         */
        set_parent(property: Property | null): void;

        /**
         * Sets value to the PARTICIPANTTYPE `self`
         * @param value the PARTICIPANTTYPE value
         * @since 4.0
         */
        set_participanttype(value: PropertyParticipanttype): void;

        /**
         * Sets value to the PERIOD `self`
         * @param value the PERIOD value
         * @since 1.0
         */
        set_period(value: Period): void;

        /**
         * Sets value to the POLLCOMPLETION `self`
         * @param value the POLLCOMPLETION value
         * @since 2.0
         */
        set_pollcompletion(value: PropertyPollcompletion): void;

        /**
         * Sets value to the POLLMODE `self`
         * @param value the POLLMODE value
         * @since 2.0
         */
        set_pollmode(value: PropertyPollmode): void;

        /**
         * Sets value to the PROXIMITY `self`
         * @param value the PROXIMITY value
         * @since 4.0
         */
        set_proximity(value: PropertyProximity): void;

        /**
         * Sets value to the QUERY `self`
         * @param value the QUERY value
         * @since 1.0
         */
        set_query(value: string): void;

        /**
         * Sets value to the QUERYLEVEL `self`
         * @param value the QUERYLEVEL value
         * @since 1.0
         */
        set_querylevel(value: PropertyQuerylevel): void;

        /**
         * Sets value to the RECUR `self`
         * @param value the RECUR value
         * @since 1.0
         */
        set_recur(value: Recurrence): void;

        /**
         * Sets value to the REQUESTSTATUS `self`
         * @param value the REQUESTSTATUS value
         * @since 1.0
         */
        set_requeststatus(value: Reqstat): void;

        /**
         * Sets value to the RESOURCETYPE `self`
         * @param value the RESOURCETYPE value
         * @since 4.0
         */
        set_resourcetype(value: PropertyResourcetype): void;

        /**
         * Sets value to the STATUS `self`
         * @param value the STATUS value
         * @since 1.0
         */
        set_status(value: PropertyStatus): void;

        /**
         * Sets value to the STRING `self`
         * @param value the STRING value
         * @since 1.0
         */
        set_string(value: string): void;

        /**
         * Sets value to the TASKMODE `self`
         * @param value the TASKMODE value
         * @since 2.0
         */
        set_taskmode(value: PropertyTaskmode): void;

        /**
         * Sets value to the TEXT `self`
         * @param value the TEXT value
         * @since 1.0
         */
        set_text(value: string): void;

        /**
         * Sets value to the TRANSP `self`
         * @param value the TRANSP value
         * @since 1.0
         */
        set_transp(value: PropertyTransp): void;

        /**
         * Sets value to the TRIGGER `self`
         * @param value the TRIGGER value
         * @since 1.0
         */
        set_trigger(value: Trigger): void;

        /**
         * Sets value to the UID `self`
         * @param value the UID value
         * @since 4.0
         */
        set_uid(value: string): void;

        /**
         * Sets value to the URI `self`
         * @param value the URI value
         * @since 1.0
         */
        set_uri(value: string): void;

        /**
         * Sets value to the UTCOFFSET `self`
         * @param value the UTCOFFSET value
         * @since 1.0
         */
        set_utcoffset(value: number): void;

        /**
         * Sets value to the X `self`
         * @param value the X value
         * @since 1.0
         */
        set_x(value: string): void;

        /**
         * Sets value to the XLICCLASS `self`
         * @param value the XLICCLASS value
         * @since 1.0
         */
        set_xlicclass(value: PropertyXlicclass): void;

        /**
         * Sets value to the XMLREFERENCE `self`
         * @param value the XMLREFERENCE value
         * @since 4.0
         */
        set_xmlreference(value: string): void;
    }


    namespace VcardComponent {
        // Signal signatures
        interface SignalSignatures extends Object.SignalSignatures {
            "notify::always-destroy": (pspec: GObject.ParamSpec) => void;
            "notify::is-global-memory": (pspec: GObject.ParamSpec) => void;
            "notify::native": (pspec: GObject.ParamSpec) => void;
            "notify::native-destroy-func": (pspec: GObject.ParamSpec) => void;
            "notify::owner": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends Object.ConstructorProps {}
    }

    /**
     * This is the ICalVcardComponent instance.
     * @gir-type Class
     */
    class VcardComponent extends Object {
        static $gtype: GObject.GType<VcardComponent>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: VcardComponent.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<VcardComponent.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        static ["new"](kind: VcardComponentKind): VcardComponent;

        static new_from_string(str: string): VcardComponent;

        // Signals
        /** @signal */
        connect<K extends keyof VcardComponent.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, VcardComponent.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof VcardComponent.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, VcardComponent.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof VcardComponent.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<VcardComponent.SignalSignatures[K]>): void;

        // Static methods
        /**
         * Converts a string to an {@link ICalGLib.VcardComponentKind}.
         * @param string A string
         * @since 4.0
         */
        static kind_from_string(string: string): VcardComponentKind;

        /**
         * Checks if an {@link ICalGLib.VcardComponentKind} is valid.
         * @param kind An {@link ICalGLib.VcardComponentKind}
         * @since 4.0
         */
        static kind_is_valid(kind: VcardComponentKind): boolean;

        /**
         * Converts an {@link ICalGLib.VcardComponentKind} to a string.
         * @param kind An {@link ICalGLib.VcardComponentKind}
         * @since 4.0
         */
        static kind_to_string(kind: VcardComponentKind): string;

        // Methods
        /**
         * Adds an {@link ICalGLib.VcardComponent} into another {@link ICalGLib.VcardComponent} as a child component.
         * @param child A child {@link ICalGLib.VcardComponent}
         * @since 4.0
         */
        add_component(child: VcardComponent): void;

        /**
         * Adds an {@link ICalGLib.VcardProperty} into {@link ICalGLib.VcardComponent}.
         * @param property An {@link ICalGLib.VcardProperty}
         * @since 4.0
         */
        add_property(property: VcardProperty): void;

        /**
         * Converts an {@link ICalGLib.VcardComponent} to a string.
         * @returns The string representation of {@link ICalGLib.VcardComponent}.
         * @since 4.0
         */
        as_vcard_string(): string;

        /**
         * Checks the number of restrictions in {@link ICalGLib.VcardComponent}.
         * @returns The number of restrictions in `comp`
         * @since 4.0
         */
        check_restrictions(): number;

        /**
         * Deeply clone `component`.
         * @returns The newly deeply cloned {@link ICalGLib.VcardComponent}.
         * @since 4.0
         */
        clone(): VcardComponent;

        /**
         * Counts the child {@link ICalGLib.VcardComponent} with the target kind in the parent one.
         * @param kind The target {@link ICalGLib.VcardComponentKind}
         * @returns The count of child {@link ICalGLib.VcardComponent} in the parent one.
         * @since 4.0
         */
        count_components(kind: VcardComponentKind): number;

        /**
         * Counts the number of errors in {@link ICalGLib.VcardComponent}.
         * @returns The count of errors.
         * @since 4.0
         */
        count_errors(): number;

        /**
         * Counts the number of {@link ICalGLib.VcardProperty} in {@link ICalGLib.VcardComponent}.
         * @param kind An {@link ICalGLib.VcardPropertyKind}
         * @param ignore_alts whether to ignore alternatives
         * @returns The number of {@link ICalGLib.VcardProperty}.
         * @since 4.0
         */
        count_properties(kind: VcardPropertyKind, ignore_alts: boolean): number;

        /**
         * Gets the current {@link ICalGLib.VcardComponent} in {@link ICalGLib.VcardComponent}.
         * @returns The current {@link ICalGLib.VcardComponent}.
         * @since 4.0
         */
        get_current_component(): VcardComponent;

        /**
         * Gets the current {@link ICalGLib.VcardProperty} in {@link ICalGLib.VcardComponent}.
         * @returns The current {@link ICalGLib.VcardProperty}.
         * @since 4.0
         */
        get_current_property(): VcardProperty;

        /**
         * Gets the first {@link ICalGLib.VcardComponent} with specific kind in {@link ICalGLib.VcardComponent}.
         * @param kind An {@link ICalGLib.VcardComponentKind}
         * @returns The first {@link ICalGLib.VcardComponent}.
         * @since 4.0
         */
        get_first_component(kind: VcardComponentKind): VcardComponent | null;

        /**
         * Gets the first {@link ICalGLib.VcardProperty} with specific kind in {@link ICalGLib.VcardComponent}.
         * @param kind An {@link ICalGLib.VcardPropertyKind}
         * @returns The first {@link ICalGLib.VcardProperty}.
         * @since 4.0
         */
        get_first_property(kind: VcardPropertyKind): VcardProperty | null;

        /**
         * Gets the FN property value of the `comp`.
         * @returns The FN property value of the `comp`.
         * @since 4.0
         */
        get_fn(): string;

        /**
         * Gets the next {@link ICalGLib.VcardComponent} with specific kind in {@link ICalGLib.VcardComponent}.
         * @param kind An {@link ICalGLib.VcardComponentKind}
         * @returns The next {@link ICalGLib.VcardComponent}.
         * @since 4.0
         */
        get_next_component(kind: VcardComponentKind): VcardComponent | null;

        /**
         * Gets the next {@link ICalGLib.VcardProperty} with specific kind in {@link ICalGLib.VcardComponent}.
         * @param kind An {@link ICalGLib.VcardPropertyKind}
         * @returns The next {@link ICalGLib.VcardProperty}.
         * @since 4.0
         */
        get_next_property(kind: VcardPropertyKind): VcardProperty | null;

        /**
         * Gets the UID of the `comp`.
         * @returns The UID of the `comp`.
         * @since 4.0
         */
        get_uid(): string;

        /**
         * Returns the current vCard version of th `comp` as {@link ICalGLib.VcardPropertyVersion}.
         * @returns Current vCard version of the `comp`. VCARD_VERSION_NONE is returned if the version property is empty or `comp` is null.
         * @since 4.0
         */
        get_version(): VcardPropertyVersion;

        /**
         * Checks whether {@link ICalGLib.VcardComponent} is valid.
         * @returns true if yes, false if not.
         * @since 4.0
         */
        is_valid(): boolean;

        /**
         * Gets the type of {@link ICalGLib.VcardComponent}.
         * @returns An {@link ICalGLib.VcardComponentKind}.
         * @since 4.0
         */
        isa(): VcardComponentKind;

        /**
         * Checks whether the native part of {@link ICalGLib.VcardComponent} is {@link ICalGLib.VcardComponent}.
         * @returns true if yes, false if not.
         * @since 4.0
         */
        isa_component(): boolean;

        /**
         * Normalizes (reorders and sorts the properties) the specified vCard `comp`.
         * @since 4.0
         */
        normalize(): void;

        /**
         * Removes a child {@link ICalGLib.VcardComponent} from another {@link ICalGLib.VcardComponent}.
         * @param child A child {@link ICalGLib.VcardComponent}
         * @since 4.0
         */
        remove_component(child: VcardComponent): void;

        /**
         * Removes {@link ICalGLib.VcardProperty} from {@link ICalGLib.VcardComponent}. Caution: The compare is based on address. So you
         * must use the original {@link ICalGLib.VcardProperty} as the target.
         * @param property An {@link ICalGLib.VcardProperty}
         * @since 4.0
         */
        remove_property(property: VcardProperty): void;

        /**
         * Removes all X-LIC-ERROR properties.
         * @since 4.0
         */
        strip_errors(): void;

        /**
         * Transforms (converts) the `comp` properties to specified vCard `version`.
         * @param version An {@link ICalGLib.VcardPropertyVersion}
         * @since 4.0
         */
        transform(version: VcardPropertyVersion): void;
    }


    namespace VcardEnumArray {
        // Signal signatures
        interface SignalSignatures extends Object.SignalSignatures {
            "notify::always-destroy": (pspec: GObject.ParamSpec) => void;
            "notify::is-global-memory": (pspec: GObject.ParamSpec) => void;
            "notify::native": (pspec: GObject.ParamSpec) => void;
            "notify::native-destroy-func": (pspec: GObject.ParamSpec) => void;
            "notify::owner": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends Object.ConstructorProps {}
    }

    /**
     * This is the ICalVcardEnumArray instance.
     * @gir-type Class
     */
    class VcardEnumArray extends Object {
        static $gtype: GObject.GType<VcardEnumArray>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: VcardEnumArray.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<VcardEnumArray.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        static ["new"](increment_size: number): VcardEnumArray;

        // Signals
        /** @signal */
        connect<K extends keyof VcardEnumArray.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, VcardEnumArray.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof VcardEnumArray.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, VcardEnumArray.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof VcardEnumArray.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<VcardEnumArray.SignalSignatures[K]>): void;

        // Methods
        /**
         * Creates a deep copy of {@link ICalGLib.VcardEnumArray} with the same properties as the `array`.
         * @returns The newly cloned {@link ICalGLib.VcardEnumArray} with the same value as the `array`
         * @since 4.0
         */
        clone(): VcardEnumArray;

        /**
         * Removes the element at the `position` from the array.
         * @param position The position in which the element will be removed from the array
         * @since 4.0
         */
        remove_element_at(position: bigint | number): void;

        /**
         * Gets the size of the array.
         * @returns The size of current array.
         * @since 4.0
         */
        size(): number;
    }


    namespace VcardGeo {
        // Signal signatures
        interface SignalSignatures extends Object.SignalSignatures {
            "notify::always-destroy": (pspec: GObject.ParamSpec) => void;
            "notify::is-global-memory": (pspec: GObject.ParamSpec) => void;
            "notify::native": (pspec: GObject.ParamSpec) => void;
            "notify::native-destroy-func": (pspec: GObject.ParamSpec) => void;
            "notify::owner": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends Object.ConstructorProps {}
    }

    /**
     * This is the ICalVcardGeo instance.
     * @gir-type Class
     */
    class VcardGeo extends Object {
        static $gtype: GObject.GType<VcardGeo>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: VcardGeo.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<VcardGeo.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        static new_coords(lat: string, lon: string): VcardGeo;

        static new_uri(uri: string): VcardGeo;

        // Signals
        /** @signal */
        connect<K extends keyof VcardGeo.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, VcardGeo.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof VcardGeo.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, VcardGeo.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof VcardGeo.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<VcardGeo.SignalSignatures[K]>): void;

        // Methods
        /**
         * Creates a new {@link ICalGLib.VcardGeo}, copy of `self`.
         * @returns The newly created {@link ICalGLib.VcardGeo}, copy of `self`.
         * @since 4.0
         */
        clone(): VcardGeo;

        /**
         * Gets the latitude coordinate of the `self`. It can return `null` when not set or when the `self` is not
         * of type coordinate.
         * @returns a latitude coordinate
         * @since 4.0
         */
        get_coord_lat(): string | null;

        /**
         * Gets the longitude coordinate of the `self`. It can return `null` when not set or when the `self` is not
         * of type coordinate.
         * @returns a longitude coordinate
         * @since 4.0
         */
        get_coord_lon(): string | null;

        /**
         * Gets the coordinates value of the `self`. It can return `null` when not set or when the `self` is not of
         * coordinates type. The returned strings are valid as long as the `self` is not freed nor modified.
         * @since 4.0
         */
        get_coords(): [string, string];

        /**
         * Gets the URI value of the `self`. It can return `null` when not set or when the `self` is not of type URI.
         * @returns a URI
         * @since 4.0
         */
        get_uri(): string | null;

        /**
         * Sets the coordinate value of the `self`.
         * @param lat a latitude
         * @param lon a longitude
         * @since 4.0
         */
        set_coords(lat: string, lon: string): void;

        /**
         * Sets the URI value of the `self`.
         * @param uri a URI
         * @since 4.0
         */
        set_uri(uri: string): void;
    }


    namespace VcardParameter {
        // Signal signatures
        interface SignalSignatures extends Object.SignalSignatures {
            "notify::always-destroy": (pspec: GObject.ParamSpec) => void;
            "notify::is-global-memory": (pspec: GObject.ParamSpec) => void;
            "notify::native": (pspec: GObject.ParamSpec) => void;
            "notify::native-destroy-func": (pspec: GObject.ParamSpec) => void;
            "notify::owner": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends Object.ConstructorProps {}
    }

    /**
     * This is the ICalVcardParameter instance.
     * @gir-type Class
     */
    class VcardParameter extends Object {
        static $gtype: GObject.GType<VcardParameter>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: VcardParameter.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<VcardParameter.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        static ["new"](kind: VcardParameterKind): VcardParameter;

        static new_altid(value: string): VcardParameter;

        static new_author(value: string): VcardParameter;

        static new_authorname(value: string): VcardParameter;

        static new_calscale(value: VcardParameterCalscale): VcardParameter;

        static new_cc(value: string): VcardParameter;

        static new_context(value: string): VcardParameter;

        static new_created(value: VcardTime): VcardParameter;

        static new_derived(value: VcardParameterDerived): VcardParameter;

        static new_encoding(value: VcardParameterEncoding): VcardParameter;

        static new_from_string(value: string): VcardParameter;

        static new_from_value_string(kind: VcardParameterKind, value: string): VcardParameter;

        static new_geo(value: string): VcardParameter;

        static new_iana(value: string): VcardParameter;

        static new_index(value: number): VcardParameter;

        static new_jscomps(value: VcardStructured): VcardParameter;

        static new_jsptr(value: string): VcardParameter;

        static new_label(value: string): VcardParameter;

        static new_language(value: string): VcardParameter;

        static new_level(value: VcardParameterLevel): VcardParameter;

        static new_mediatype(value: string): VcardParameter;

        static new_phonetic(value: VcardParameterPhonetic): VcardParameter;

        static new_pid(value: string): VcardParameter;

        static new_pid_list(value: VcardStrArray): VcardParameter;

        static new_pref(value: number): VcardParameter;

        static new_propid(value: string): VcardParameter;

        static new_script(value: string): VcardParameter;

        static new_servicetype(value: string): VcardParameter;

        static new_sortas(value: string): VcardParameter;

        static new_sortas_list(value: VcardStrArray): VcardParameter;

        static new_type(value: VcardParameterType): VcardParameter;

        static new_type_list(value: VcardEnumArray): VcardParameter;

        static new_tz(value: string): VcardParameter;

        static new_username(value: string): VcardParameter;

        static new_value(value: VcardParameterValue): VcardParameter;

        static new_x(value: string): VcardParameter;

        static new_xliccomparetype(value: VcardParameterXliccomparetype): VcardParameter;

        static new_xlicerrortype(value: VcardParameterXlicerrortype): VcardParameter;

        // Signals
        /** @signal */
        connect<K extends keyof VcardParameter.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, VcardParameter.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof VcardParameter.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, VcardParameter.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof VcardParameter.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<VcardParameter.SignalSignatures[K]>): void;

        // Static methods
        /**
         * Converts a string representation of a parameter enum to a its numeric value.
         * @param str a string enum value
         * @since 4.0
         */
        static enum_from_string(str: string): number;

        /**
         * Converts an integer representation of a parameter enum to a string.
         * @param e an enum numeric value
         * @since 4.0
         */
        static enum_to_string(e: number): string;

        /**
         * Checks whether {@link ICalGLib.VcardParameterKind} is valid.
         * @param kind The {@link ICalGLib.VcardPropertyKind}
         * @since 4.0
         */
        static kind_is_valid(kind: VcardParameterKind): boolean;

        /**
         * Converts the `kind` to the string representation.
         * @param kind The {@link ICalGLib.VcardParameterKind} to be converted
         * @since 4.0
         */
        static kind_to_string(kind: VcardParameterKind): string;

        /**
         * Returns corresponding {@link ICalGLib.VcardValueKind} for the given `kind` and sets whether the `kind` is a multivalued
         * parameter.
         * @param kind The {@link ICalGLib.VcardPropertyKind}
         * @since 4.0
         */
        static kind_value_kind(kind: VcardParameterKind): [VcardValueKind, boolean];

        /**
         * Converts a string to the {@link ICalGLib.VcardParameterKind}.
         * @param string The string representation of the {@link ICalGLib.VcardParameterKind}
         * @since 4.0
         */
        static string_to_kind(string: string): VcardParameterKind;

        /**
         * Converts the {@link ICalGLib.VcardParameterValue} to {@link ICalGLib.VcardValueKind}.
         * @param value An {@link ICalGLib.VcardParameterValue}
         * @since 4.0
         */
        static value_to_value_kind(value: VcardParameterValue): VcardValueKind;

        // Methods
        /**
         * Adds a string into the `self` of PID.
         * @param value the string to add into the `self`
         * @since 4.0
         */
        add_pid(value: string): void;

        /**
         * Adds a string into the `self` of SORTAS.
         * @param value the string to add into the `self`
         * @since 4.0
         */
        add_sortas(value: string): void;

        /**
         * Adds an element.
         * @param value the {@link ICalGLib.VcardParameterType}
         * @param x_value an X name, or `null`; when set, the `value` should a corresponding X value
         * @since 4.0
         */
        add_type(value: VcardParameterType, x_value: string | null): void;

        /**
         * Adds a `param` value from string `value`. This can be used for parameters which can hold multiple values.
         * @param value The string value to add
         * @since 4.0
         */
        add_value_from_string(value: string): void;

        /**
         * Converts an {@link ICalGLib.VcardParameter} to the string representation.
         * @returns The string representation of the `parameter`.
         * @since 4.0
         */
        as_vcard_string(): string;

        /**
         * Deep clones the `param`.
         * @returns The newly created {@link ICalGLib.VcardParameter} as a clone of the `param`.
         * @since 4.0
         */
        clone(): VcardParameter;

        /**
         * Returns value of the ALTID `self`
         * @returns the ALTID value
         * @since 4.0
         */
        get_altid(): string;

        /**
         * Returns value of the AUTHOR `self`
         * @returns the AUTHOR value
         * @since 4.0
         */
        get_author(): string;

        /**
         * Returns value of the AUTHORNAME `self`
         * @returns the AUTHORNAME value
         * @since 4.0
         */
        get_authorname(): string;

        /**
         * Returns value of the CALSCALE `self`
         * @returns the CALSCALE value
         * @since 4.0
         */
        get_calscale(): VcardParameterCalscale;

        /**
         * Returns value of the CC `self`
         * @returns the CC value
         * @since 4.0
         */
        get_cc(): string;

        /**
         * Returns value of the CONTEXT `self`
         * @returns the CONTEXT value
         * @since 4.0
         */
        get_context(): string;

        /**
         * Returns value of the CREATED `self`
         * @returns the CREATED value
         * @since 4.0
         */
        get_created(): VcardTime;

        /**
         * Returns value of the DERIVED `self`
         * @returns the DERIVED value
         * @since 4.0
         */
        get_derived(): VcardParameterDerived;

        /**
         * Returns value of the ENCODING `self`
         * @returns the ENCODING value
         * @since 4.0
         */
        get_encoding(): VcardParameterEncoding;

        /**
         * Returns value of the GEO `self`
         * @returns the GEO value
         * @since 4.0
         */
        get_geo(): string;

        /**
         * Returns value of the IANA `self`
         * @returns the IANA value
         * @since 4.0
         */
        get_iana(): string;

        /**
         * Gets the iana_name property of the native part of the {@link ICalGLib.VcardParameter}.
         * @returns The property of the `value`
         * @since 4.0
         */
        get_iana_name(): string | null;

        /**
         * Gets the iana_value property of the native part of the {@link ICalGLib.VcardParameter}.
         * @returns The property of the `value`
         * @since 4.0
         */
        get_iana_value(): string | null;

        /**
         * Returns value of the INDEX `self`
         * @returns the INDEX value
         * @since 4.0
         */
        get_index(): number;

        /**
         * Returns value of the JSCOMPS `self`
         * 
         * Note: this uses a copy of the structured type, not the one stored
         * in the `self`
         * @returns the JSCOMPS value
         * @since 4.0
         */
        get_jscomps(): VcardStructured;

        /**
         * Returns value of the JSPTR `self`
         * @returns the JSPTR value
         * @since 4.0
         */
        get_jsptr(): string;

        /**
         * Returns value of the LABEL `self`
         * @returns the LABEL value
         * @since 4.0
         */
        get_label(): string;

        /**
         * Returns value of the LANGUAGE `self`
         * @returns the LANGUAGE value
         * @since 4.0
         */
        get_language(): string;

        /**
         * Returns value of the LEVEL `self`
         * @returns the LEVEL value
         * @since 4.0
         */
        get_level(): VcardParameterLevel;

        /**
         * Returns value of the MEDIATYPE `self`
         * @returns the MEDIATYPE value
         * @since 4.0
         */
        get_mediatype(): string;

        /**
         * Gets the parent {@link ICalGLib.VcardProperty} of the specified {@link ICalGLib.VcardParameter}.
         * @returns The parent {@link ICalGLib.VcardProperty}
         * @since 4.0
         */
        get_parent(): VcardProperty | null;

        /**
         * Returns value of the PHONETIC `self`
         * @returns the PHONETIC value
         * @since 4.0
         */
        get_phonetic(): VcardParameterPhonetic;

        /**
         * Gets the value of the `self` of PID.
         * 
         * Note: this returns copy of the string array, not the one stored
         * in the `self`
         * @returns the {@link ICalGLib.VcardStrArray} value of the `self`
         * @since 4.0
         */
        get_pid(): VcardStrArray;

        /**
         * Returns the n-th element of the `self` of PID
         * @param position Position of the PID item to get
         * @returns n-th element of the PID `self`
         * @since 4.0
         */
        get_pid_nth(position: bigint | number): string | null;

        /**
         * Returns number of elements in the `self` of PID
         * @returns number of elements
         * @since 4.0
         */
        get_pid_size(): number;

        /**
         * Returns value of the PREF `self`
         * @returns the PREF value
         * @since 4.0
         */
        get_pref(): number;

        /**
         * Returns value of the PROPID `self`
         * @returns the PROPID value
         * @since 4.0
         */
        get_propid(): string;

        /**
         * Returns value of the SCRIPT `self`
         * @returns the SCRIPT value
         * @since 4.0
         */
        get_script(): string;

        /**
         * Returns value of the SERVICETYPE `self`
         * @returns the SERVICETYPE value
         * @since 4.0
         */
        get_servicetype(): string;

        /**
         * Gets the value of the `self` of SORTAS.
         * 
         * Note: this returns copy of the string array, not the one
         * stored in the `self`
         * @returns the {@link ICalGLib.VcardStrArray} value of the `self`
         * @since 4.0
         */
        get_sortas(): VcardStrArray;

        /**
         * Returns the n-th element of the `self` of SORTAS
         * @param position Position of the SORTAS item to get
         * @returns n-th element of the SORTAS `self`
         * @since 4.0
         */
        get_sortas_nth(position: bigint | number): string | null;

        /**
         * Returns number of elements in the `self` of SORTAS
         * @returns number of elements
         * @since 4.0
         */
        get_sortas_size(): number;

        /**
         * Returns the n-th element of the `self` of TYPE
         * @param position the position of the element
         * @returns the n-th element
         * @since 4.0
         */
        get_type_nth(position: bigint | number): VcardParameterType;

        /**
         * Returns number of elements in the `self` of TYPE
         * @returns number of elements
         * @since 4.0
         */
        get_type_size(): number;

        /**
         * Gets the value of the `self` of TYPE.
         * 
         * Note: this returns copy of the array, not the one stored in
         * the `self`
         * @returns the {@link ICalGLib.VcardEnumArray} value of the `self`
         * @since 4.0
         */
        get_type_value(): VcardEnumArray;

        /**
         * Returns value of the TZ `self`
         * @returns the TZ value
         * @since 4.0
         */
        get_tz(): string;

        /**
         * Returns value of the USERNAME `self`
         * @returns the USERNAME value
         * @since 4.0
         */
        get_username(): string;

        /**
         * Returns value of the VALUE `self`
         * @returns the VALUE value
         * @since 4.0
         */
        get_value(): VcardParameterValue;

        /**
         * Returns value of the X `self`
         * @returns the X value
         * @since 4.0
         */
        get_x(): string;

        /**
         * Returns value of the XLICCOMPARETYPE `self`
         * @returns the XLICCOMPARETYPE value
         * @since 4.0
         */
        get_xliccomparetype(): VcardParameterXliccomparetype;

        /**
         * Returns value of the XLICERRORTYPE `self`
         * @returns the XLICERRORTYPE value
         * @since 4.0
         */
        get_xlicerrortype(): VcardParameterXlicerrortype;

        /**
         * Gets the xname property of the native part of the {@link ICalGLib.VcardParameter}.
         * @returns The property of the `value`
         * @since 4.0
         */
        get_xname(): string | null;

        /**
         * Gets the xvalue property of the native part of the {@link ICalGLib.VcardParameter}.
         * @returns The property of the `value`
         * @since 4.0
         */
        get_xvalue(): string | null;

        /**
         * Checks whether native parts of two `ICalVcardParameters` have the same name.
         * @param param2 The {@link ICalGLib.VcardParameter} to be checked
         * @returns true if the parameters have the same name, false or not.
         * @since 4.0
         */
        has_same_name(param2: VcardParameter): boolean;

        /**
         * Returns whether `param` is a multivalued parameter. Multivalued parameters can hold more than one value.
         * @returns true if the `param` is a multivalued parameter.
         * @since 4.0
         */
        is_multivalued(): boolean;

        /**
         * Returns whether `param` is a structured parameter. Structured parameters have their value encoded in a
         * specific format.
         * @returns true if the `param` is a structured parameter.
         * @since 4.0
         */
        is_structured(): boolean;

        /**
         * Returns the kind of an {@link ICalGLib.VcardParameter}.
         * @returns The kind of the `parameter`.
         * @since 4.0
         */
        isa(): VcardParameterKind;

        /**
         * Checks whether the native part of the {@link ICalGLib.VcardParameter} is of type {@link ICalGLib.VcardParameter}.
         * @returns true if the native part is of type {@link ICalGLib.VcardParameter}, false if not.
         * @since 4.0
         */
        isa_parameter(): boolean;

        /**
         * Removes a string from the `self` of PID.
         * @param value the string to remove from the `self`
         * @since 4.0
         */
        remove_pid(value: string): void;

        /**
         * Removes a string from the `self` of SORTAS.
         * @param value the string to remove from the `self`
         * @since 4.0
         */
        remove_sortas(value: string): void;

        /**
         * Removes an element with the provided value.
         * @param value the {@link ICalGLib.VcardParameterType}
         * @param x_value an X name, or `null`; when set, the `value` should be a corresponding X value
         * @since 4.0
         */
        remove_type(value: VcardParameterType, x_value: string | null): void;

        /**
         * Sets value to the ALTID `self`
         * @param value the ALTID value
         * @since 4.0
         */
        set_altid(value: string): void;

        /**
         * Sets value to the AUTHOR `self`
         * @param value the AUTHOR value
         * @since 4.0
         */
        set_author(value: string): void;

        /**
         * Sets value to the AUTHORNAME `self`
         * @param value the AUTHORNAME value
         * @since 4.0
         */
        set_authorname(value: string): void;

        /**
         * Sets value to the CALSCALE `self`
         * @param value the CALSCALE value
         * @since 4.0
         */
        set_calscale(value: VcardParameterCalscale): void;

        /**
         * Sets value to the CC `self`
         * @param value the CC value
         * @since 4.0
         */
        set_cc(value: string): void;

        /**
         * Sets value to the CONTEXT `self`
         * @param value the CONTEXT value
         * @since 4.0
         */
        set_context(value: string): void;

        /**
         * Sets value to the CREATED `self`
         * @param value the CREATED value
         * @since 4.0
         */
        set_created(value: VcardTime): void;

        /**
         * Sets value to the DERIVED `self`
         * @param value the DERIVED value
         * @since 4.0
         */
        set_derived(value: VcardParameterDerived): void;

        /**
         * Sets value to the ENCODING `self`
         * @param value the ENCODING value
         * @since 4.0
         */
        set_encoding(value: VcardParameterEncoding): void;

        /**
         * Sets value to the GEO `self`
         * @param value the GEO value
         * @since 4.0
         */
        set_geo(value: string): void;

        /**
         * Sets value to the IANA `self`
         * @param value the IANA value
         * @since 4.0
         */
        set_iana(value: string): void;

        /**
         * Sets the iana_name property of the native part of the {@link ICalGLib.VcardParameter}.
         * @param v The name to be set into the `param`
         * @since 4.0
         */
        set_iana_name(v: string): void;

        /**
         * Sets the iana_value property of the native part of the {@link ICalGLib.VcardParameter}.
         * @param v The value to be set into the `param`
         * @since 4.0
         */
        set_iana_value(v: string): void;

        /**
         * Sets value to the INDEX `self`
         * @param value the INDEX value
         * @since 4.0
         */
        set_index(value: number): void;

        /**
         * Sets value to the JSCOMPS `self`
         * 
         * Note: this uses a copy of the structured type, not the one stored
         * in the `self`
         * @param value the JSCOMPS value
         * @since 4.0
         */
        set_jscomps(value: VcardStructured): void;

        /**
         * Sets value to the JSPTR `self`
         * @param value the JSPTR value
         * @since 4.0
         */
        set_jsptr(value: string): void;

        /**
         * Sets value to the LABEL `self`
         * @param value the LABEL value
         * @since 4.0
         */
        set_label(value: string): void;

        /**
         * Sets value to the LANGUAGE `self`
         * @param value the LANGUAGE value
         * @since 4.0
         */
        set_language(value: string): void;

        /**
         * Sets value to the LEVEL `self`
         * @param value the LEVEL value
         * @since 4.0
         */
        set_level(value: VcardParameterLevel): void;

        /**
         * Sets value to the MEDIATYPE `self`
         * @param value the MEDIATYPE value
         * @since 4.0
         */
        set_mediatype(value: string): void;

        /**
         * Sets the parent {@link ICalGLib.VcardProperty} of an {@link ICalGLib.VcardParameter}.
         * @param property The parent {@link ICalGLib.VcardProperty}
         * @since 4.0
         */
        set_parent(property: VcardProperty | null): void;

        /**
         * Sets value to the PHONETIC `self`
         * @param value the PHONETIC value
         * @since 4.0
         */
        set_phonetic(value: VcardParameterPhonetic): void;

        /**
         * Sets the value of the `self` of PID.
         * 
         * Note: this uses a copy of the string array, not the one stored
         * in the `value`
         * @param value the string array value
         * @since 4.0
         */
        set_pid(value: VcardStrArray): void;

        /**
         * Sets value to the PREF `self`
         * @param value the PREF value
         * @since 4.0
         */
        set_pref(value: number): void;

        /**
         * Sets value to the PROPID `self`
         * @param value the PROPID value
         * @since 4.0
         */
        set_propid(value: string): void;

        /**
         * Sets value to the SCRIPT `self`
         * @param value the SCRIPT value
         * @since 4.0
         */
        set_script(value: string): void;

        /**
         * Sets value to the SERVICETYPE `self`
         * @param value the SERVICETYPE value
         * @since 4.0
         */
        set_servicetype(value: string): void;

        /**
         * Sets the value of the `self` of SORTAS.
         * 
         * Note: this uses a copy of the string array, not the one
         * stored in the `value`
         * @param value the string array value
         * @since 4.0
         */
        set_sortas(value: VcardStrArray): void;

        /**
         * Sets the value of the `self` of TYPE.
         * 
         * Note: this uses a copy of the array, not the one stored in
         * the `value`
         * @param value the array value
         * @since 4.0
         */
        set_type_value(value: VcardEnumArray): void;

        /**
         * Sets value to the TZ `self`
         * @param value the TZ value
         * @since 4.0
         */
        set_tz(value: string): void;

        /**
         * Sets value to the USERNAME `self`
         * @param value the USERNAME value
         * @since 4.0
         */
        set_username(value: string): void;

        /**
         * Sets value to the VALUE `self`
         * @param value the VALUE value
         * @since 4.0
         */
        set_value(value: VcardParameterValue): void;

        /**
         * Sets a `param` value from string `value`.
         * @param value The string value to set
         * @since 4.0
         */
        set_value_from_string(value: string): void;

        /**
         * Sets value to the X `self`
         * @param value the X value
         * @since 4.0
         */
        set_x(value: string): void;

        /**
         * Sets value to the XLICCOMPARETYPE `self`
         * @param value the XLICCOMPARETYPE value
         * @since 4.0
         */
        set_xliccomparetype(value: VcardParameterXliccomparetype): void;

        /**
         * Sets value to the XLICERRORTYPE `self`
         * @param value the XLICERRORTYPE value
         * @since 4.0
         */
        set_xlicerrortype(value: VcardParameterXlicerrortype): void;

        /**
         * Sets the xname property of the native part of the {@link ICalGLib.VcardParameter}.
         * @param v The name to be set into the `param`
         * @since 4.0
         */
        set_xname(v: string): void;

        /**
         * Sets the xvalue property of the native part of the {@link ICalGLib.VcardParameter}.
         * @param v The value to be set into the `param`
         * @since 4.0
         */
        set_xvalue(v: string): void;
    }


    namespace VcardProperty {
        // Signal signatures
        interface SignalSignatures extends Object.SignalSignatures {
            "notify::always-destroy": (pspec: GObject.ParamSpec) => void;
            "notify::is-global-memory": (pspec: GObject.ParamSpec) => void;
            "notify::native": (pspec: GObject.ParamSpec) => void;
            "notify::native-destroy-func": (pspec: GObject.ParamSpec) => void;
            "notify::owner": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends Object.ConstructorProps {}
    }

    /**
     * This is the ICalVcardProperty instance.
     * @gir-type Class
     */
    class VcardProperty extends Object {
        static $gtype: GObject.GType<VcardProperty>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: VcardProperty.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<VcardProperty.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        static ["new"](kind: VcardPropertyKind): VcardProperty;

        static new_adr(value: VcardStructured): VcardProperty;

        static new_agent(value: string): VcardProperty;

        static new_anniversary(value: VcardTime): VcardProperty;

        static new_bday(value: VcardTime): VcardProperty;

        static new_birthplace(value: string): VcardProperty;

        static new_caladruri(value: string): VcardProperty;

        static new_caluri(value: string): VcardProperty;

        static new_categories(value: VcardStrArray): VcardProperty;

        static new_class(value: string): VcardProperty;

        static new_clientpidmap(value: VcardStrArray): VcardProperty;

        static new_contacturi(value: string): VcardProperty;

        static new_created(value: VcardTime): VcardProperty;

        static new_deathdate(value: VcardTime): VcardProperty;

        static new_deathplace(value: string): VcardProperty;

        static new_email(value: string): VcardProperty;

        static new_expertise(value: string): VcardProperty;

        static new_fburl(value: string): VcardProperty;

        static new_fn(value: string): VcardProperty;

        static new_from_string(str: string): VcardProperty;

        static new_gender(value: VcardStrArray): VcardProperty;

        static new_geo(value: VcardGeo): VcardProperty;

        static new_gramgender(value: VcardPropertyGramgender): VcardProperty;

        static new_hobby(value: string): VcardProperty;

        static new_impp(value: string): VcardProperty;

        static new_interest(value: string): VcardProperty;

        static new_jsprop(value: string): VcardProperty;

        static new_key(value: string): VcardProperty;

        static new_kind(value: VcardPropertyKindenum): VcardProperty;

        static new_label(value: string): VcardProperty;

        static new_lang(value: string): VcardProperty;

        static new_language(value: string): VcardProperty;

        static new_logo(value: string): VcardProperty;

        static new_mailer(value: string): VcardProperty;

        static new_member(value: string): VcardProperty;

        static new_n(value: VcardStructured): VcardProperty;

        static new_name(value: string): VcardProperty;

        static new_nickname(value: VcardStrArray): VcardProperty;

        static new_note(value: string): VcardProperty;

        static new_org(value: VcardStrArray): VcardProperty;

        static new_orgdirectory(value: string): VcardProperty;

        static new_photo(value: string): VcardProperty;

        static new_prodid(value: string): VcardProperty;

        static new_pronouns(value: string): VcardProperty;

        static new_related(value: string): VcardProperty;

        static new_rev(value: VcardTime): VcardProperty;

        static new_role(value: string): VcardProperty;

        static new_socialprofile(value: string): VcardProperty;

        static new_sortstring(value: string): VcardProperty;

        static new_sound(value: string): VcardProperty;

        static new_source(value: string): VcardProperty;

        static new_tel(value: string): VcardProperty;

        static new_title(value: string): VcardProperty;

        static new_tz(value: VcardTz): VcardProperty;

        static new_uid(value: string): VcardProperty;

        static new_url(value: string): VcardProperty;

        static new_version(value: VcardPropertyVersion): VcardProperty;

        static new_x(value: string): VcardProperty;

        static new_xlicerror(value: string): VcardProperty;

        static new_xml(value: string): VcardProperty;

        // Signals
        /** @signal */
        connect<K extends keyof VcardProperty.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, VcardProperty.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof VcardProperty.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, VcardProperty.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof VcardProperty.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<VcardProperty.SignalSignatures[K]>): void;

        // Static methods
        /**
         * Checks whether the `kind` can hold `e`.
         * @param kind an {@link ICalGLib.VcardPropertyKind}
         * @param e an enum value
         * @since 4.0
         */
        static enum_belongs_to_property(kind: VcardPropertyKind, e: number): boolean;

        /**
         * Gets string representation of the `e`.
         * @param e An enum value
         * @since 4.0
         */
        static enum_to_string(e: number): string | null;

        /**
         * Returns enum value for the provided `kind` and `str`, or 0 for unknown kind.
         * @param kind An {@link ICalGLib.VcardValueKind} as integer
         * @param str A string
         * @since 4.0
         */
        static kind_and_string_to_enum(kind: number, str: string): number;

        /**
         * Converts the string to {@link ICalGLib.VcardPropertyKind}.
         * @param string A string representing {@link ICalGLib.VcardPropertyKind}
         * @since 4.0
         */
        static kind_from_string(string: string): VcardPropertyKind;

        /**
         * Returns whether the `kind` is a multivalued property. Multivalued properties can hold more than one value.
         * @param kind an {@link ICalGLib.VcardPropertyKind}
         * @since 4.0
         */
        static kind_is_multivalued(kind: VcardPropertyKind): boolean;

        /**
         * Returns whether the `kind` is a structured property. Structured properties have their value encoded in
         * a specific format.
         * @param kind an {@link ICalGLib.VcardPropertyKind}
         * @since 4.0
         */
        static kind_is_structured(kind: VcardPropertyKind): boolean;

        /**
         * Checks whether {@link ICalGLib.VcardPropertyKind} is valid.
         * @param kind The {@link ICalGLib.VcardPropertyKind}
         * @since 4.0
         */
        static kind_is_valid(kind: VcardPropertyKind): boolean;

        /**
         * Converts the {@link ICalGLib.VcardPropertyKind} to a string.
         * @param kind An {@link ICalGLib.VcardPropertyKind}
         * @since 4.0
         */
        static kind_to_string(kind: VcardPropertyKind): string;

        /**
         * Converts the {@link ICalGLib.VcardPropertyKind} to {@link ICalGLib.VcardValueKind}.
         * @param kind An {@link ICalGLib.VcardPropertyKind}
         * @since 4.0
         */
        static kind_to_value_kind(kind: VcardPropertyKind): VcardValueKind;

        // Methods
        /**
         * Adds an {@link ICalGLib.VcardParameter} into the {@link ICalGLib.VcardProperty}. It behaves like set the copy of the {@link ICalGLib.VcardParameter}.
         * Upon completion the native part of {@link ICalGLib.VcardParameter} will be set to `null`.
         * @param parameter The parameter to be added into `prop`
         * @since 4.0
         */
        add_parameter(parameter: VcardParameter): void;

        /**
         * Adds an {@link ICalGLib.VcardParameterType} TYPE parameter into the `prop`. See also `i_cal_vcard_property_add_type_x_parameter()`
         * @param type_param a TYPE parameter as {@link ICalGLib.VcardParameterType}
         * @since 4.0
         */
        add_type_parameter(type_param: VcardParameterType): void;

        /**
         * Adds an X (custom) TYPE parameter into the `prop`. See also `i_cal_vcard_property_add_type_parameter()`
         * @param type_param an X value of a TYPE parameter
         * @since 4.0
         */
        add_type_x_parameter(type_param: string): void;

        /**
         * Converts an {@link ICalGLib.VcardProperty} to a string representation.
         * @returns The string representation of `prop`.
         * @since 4.0
         */
        as_vcard_string(): string;

        /**
         * Deeply clones the `prop`.
         * @returns The newly created {@link ICalGLib.VcardProperty} deeply cloned from `prop`.
         * @since 4.0
         */
        clone(): VcardProperty;

        /**
         * Counts the parameters in the {@link ICalGLib.VcardProperty}.
         * @returns The count of the parameters in the {@link ICalGLib.VcardProperty}.
         * @since 4.0
         */
        count_parameters(): number;

        /**
         * Returns value of the ADR `self`
         * 
         * Note: this uses a copy of the structured type, not the one stored
         * in the `self`
         * @returns the ADR value
         * @since 4.0
         */
        get_adr(): VcardStructured;

        /**
         * Returns value of the AGENT `self`
         * @returns the AGENT value
         * @since 4.0
         */
        get_agent(): string;

        /**
         * Returns value of the ANNIVERSARY `self`
         * @returns the ANNIVERSARY value
         * @since 4.0
         */
        get_anniversary(): VcardTime;

        /**
         * Returns value of the BDAY `self`
         * @returns the BDAY value
         * @since 4.0
         */
        get_bday(): VcardTime;

        /**
         * Returns value of the BIRTHPLACE `self`
         * @returns the BIRTHPLACE value
         * @since 4.0
         */
        get_birthplace(): string;

        /**
         * Returns value of the CALADRURI `self`
         * @returns the CALADRURI value
         * @since 4.0
         */
        get_caladruri(): string;

        /**
         * Returns value of the CALURI `self`
         * @returns the CALURI value
         * @since 4.0
         */
        get_caluri(): string;

        /**
         * Gets the value of the `self` of CATEGORIES.
         * 
         * Note: this returns copy of the string array, not the
         * one stored in the `self`
         * @returns the {@link ICalGLib.VcardStrArray} value of the `self`
         * @since 4.0
         */
        get_categories(): VcardStrArray;

        /**
         * Returns value of the CLASS `self`
         * @returns the CLASS value
         * @since 4.0
         */
        get_class(): string;

        /**
         * Gets the value of the `self` of CLIENTPIDMAP.
         * 
         * Note: this returns copy of the string array, not the
         * one stored in the `self`
         * @returns the {@link ICalGLib.VcardStrArray} value of the `self`
         * @since 4.0
         */
        get_clientpidmap(): VcardStrArray;

        /**
         * Returns value of the CONTACTURI `self`
         * @returns the CONTACTURI value
         * @since 4.0
         */
        get_contacturi(): string;

        /**
         * Returns value of the CREATED `self`
         * @returns the CREATED value
         * @since 4.0
         */
        get_created(): VcardTime;

        /**
         * Returns value of the DEATHDATE `self`
         * @returns the DEATHDATE value
         * @since 4.0
         */
        get_deathdate(): VcardTime;

        /**
         * Returns value of the DEATHPLACE `self`
         * @returns the DEATHPLACE value
         * @since 4.0
         */
        get_deathplace(): string;

        /**
         * Returns value of the EMAIL `self`
         * @returns the EMAIL value
         * @since 4.0
         */
        get_email(): string;

        /**
         * Returns value of the EXPERTISE `self`
         * @returns the EXPERTISE value
         * @since 4.0
         */
        get_expertise(): string;

        /**
         * Returns value of the FBURL `self`
         * @returns the FBURL value
         * @since 4.0
         */
        get_fburl(): string;

        /**
         * Gets the first {@link ICalGLib.VcardParameter} from the parent {@link ICalGLib.VcardProperty}.
         * @param kind The target kind of {@link ICalGLib.VcardParameter} to be retrieved
         * @returns The first {@link ICalGLib.VcardParameter} of `prop`.
         * @since 4.0
         */
        get_first_parameter(kind: VcardParameterKind): VcardParameter;

        /**
         * Returns value of the FN `self`
         * @returns the FN value
         * @since 4.0
         */
        get_fn(): string;

        /**
         * Gets the value of the `self` of GENDER.
         * 
         * Note: this returns copy of the string array, not the one
         * stored in the `self`
         * @returns the {@link ICalGLib.VcardStrArray} value of the `self`
         * @since 4.0
         */
        get_gender(): VcardStrArray;

        /**
         * Returns value of the GEO `self`
         * @returns the GEO value
         * @since 4.0
         */
        get_geo(): VcardGeo;

        /**
         * Returns value of the GRAMGENDER `self`
         * @returns the GRAMGENDER value
         * @since 4.0
         */
        get_gramgender(): VcardPropertyGramgender;

        /**
         * Gets the group name of the `prop`.
         * @returns The group name of the `prop`.
         * @since 4.0
         */
        get_group(): string | null;

        /**
         * Returns value of the HOBBY `self`
         * @returns the HOBBY value
         * @since 4.0
         */
        get_hobby(): string;

        /**
         * Returns value of the IMPP `self`
         * @returns the IMPP value
         * @since 4.0
         */
        get_impp(): string;

        /**
         * Returns value of the INTEREST `self`
         * @returns the INTEREST value
         * @since 4.0
         */
        get_interest(): string;

        /**
         * Returns value of the JSPROP `self`
         * @returns the JSPROP value
         * @since 4.0
         */
        get_jsprop(): string;

        /**
         * Returns value of the KEY `self`
         * @returns the KEY value
         * @since 4.0
         */
        get_key(): string;

        /**
         * Returns value of the KIND `self`
         * @returns the KIND value
         * @since 4.0
         */
        get_kind(): VcardPropertyKindenum;

        /**
         * Returns value of the LABEL `self`
         * @returns the LABEL value
         * @since 4.0
         */
        get_label(): string;

        /**
         * Returns value of the LANG `self`
         * @returns the LANG value
         * @since 4.0
         */
        get_lang(): string;

        /**
         * Returns value of the LANGUAGE `self`
         * @returns the LANGUAGE value
         * @since 4.0
         */
        get_language(): string;

        /**
         * Returns value of the LOGO `self`
         * @returns the LOGO value
         * @since 4.0
         */
        get_logo(): string;

        /**
         * Returns value of the MAILER `self`
         * @returns the MAILER value
         * @since 4.0
         */
        get_mailer(): string;

        /**
         * Returns value of the MEMBER `self`
         * @returns the MEMBER value
         * @since 4.0
         */
        get_member(): string;

        /**
         * Returns value of the N `self`
         * 
         * Note: this uses a copy of the structured type, not the one stored
         * in the `self`
         * @returns the N value
         * @since 4.0
         */
        get_n(): VcardStructured;

        /**
         * Returns value of the NAME `self`
         * @returns the NAME value
         * @since 4.0
         */
        get_name(): string;

        /**
         * Gets the next {@link ICalGLib.VcardParameter} from the parent {@link ICalGLib.VcardProperty}.
         * @param kind The target kind of {@link ICalGLib.VcardParameter} to be retrieved
         * @returns The next {@link ICalGLib.VcardParameter} of `prop`.
         * @since 4.0
         */
        get_next_parameter(kind: VcardParameterKind): VcardParameter;

        /**
         * Gets the value of the `self` of NICKNAME.
         * 
         * Note: this returns copy of the string array, not the one
         * stored in the `self`
         * @returns the {@link ICalGLib.VcardStrArray} value of the `self`
         * @since 4.0
         */
        get_nickname(): VcardStrArray;

        /**
         * Returns value of the NOTE `self`
         * @returns the NOTE value
         * @since 4.0
         */
        get_note(): string;

        /**
         * Gets the value of the `self` of ORG.
         * 
         * Note: this returns copy of the string array, not the one stored
         * in the `self`
         * @returns the {@link ICalGLib.VcardStrArray} value of the `self`
         * @since 4.0
         */
        get_org(): VcardStrArray;

        /**
         * Returns value of the ORGDIRECTORY `self`
         * @returns the ORGDIRECTORY value
         * @since 4.0
         */
        get_orgdirectory(): string;

        /**
         * Gets the string representation of the target parameter in the {@link ICalGLib.VcardProperty}.
         * @param name The name of the target parameter
         * @returns The string representation of the parameter.
         * @since 4.0
         */
        get_parameter_as_string(name: string): string;

        /**
         * Gets the parent component of the property. Use with caution. When icalproperty is deallocated, it won't
         * deallocate its parent. However the {@link ICalGLib.VcardComponent} object created using this method will be deallocated
         * (if no reference in other places). So You need to make sure there is another reference except the one
         * in {@link ICalGLib.VcardProperty}.
         * @returns The parent {@link ICalGLib.VcardComponent} of {@link ICalGLib.VcardProperty}.
         * @since 4.0
         */
        get_parent(): VcardComponent | null;

        /**
         * Returns value of the PHOTO `self`
         * @returns the PHOTO value
         * @since 4.0
         */
        get_photo(): string;

        /**
         * Returns value of the PRODID `self`
         * @returns the PRODID value
         * @since 4.0
         */
        get_prodid(): string;

        /**
         * Returns value of the PRONOUNS `self`
         * @returns the PRONOUNS value
         * @since 4.0
         */
        get_pronouns(): string;

        /**
         * Gets the property name of {@link ICalGLib.VcardProperty}.
         * @returns Property name of {@link ICalGLib.VcardProperty}.
         * @since 4.0
         */
        get_property_name(): string;

        /**
         * Returns value of the RELATED `self`
         * @returns the RELATED value
         * @since 4.0
         */
        get_related(): string;

        /**
         * Returns value of the REV `self`
         * @returns the REV value
         * @since 4.0
         */
        get_rev(): VcardTime;

        /**
         * Returns value of the ROLE `self`
         * @returns the ROLE value
         * @since 4.0
         */
        get_role(): string;

        /**
         * Returns value of the SOCIALPROFILE `self`
         * @returns the SOCIALPROFILE value
         * @since 4.0
         */
        get_socialprofile(): string;

        /**
         * Returns value of the SORTSTRING `self`
         * @returns the SORTSTRING value
         * @since 4.0
         */
        get_sortstring(): string;

        /**
         * Returns value of the SOUND `self`
         * @returns the SOUND value
         * @since 4.0
         */
        get_sound(): string;

        /**
         * Returns value of the SOURCE `self`
         * @returns the SOURCE value
         * @since 4.0
         */
        get_source(): string;

        /**
         * Returns value of the TEL `self`
         * @returns the TEL value
         * @since 4.0
         */
        get_tel(): string;

        /**
         * Returns value of the TITLE `self`
         * @returns the TITLE value
         * @since 4.0
         */
        get_title(): string;

        /**
         * Returns value of the TZ `self`
         * @returns the TZ value
         * @since 4.0
         */
        get_tz(): VcardTz;

        /**
         * Returns value of the UID `self`
         * @returns the UID value
         * @since 4.0
         */
        get_uid(): string;

        /**
         * Returns value of the URL `self`
         * @returns the URL value
         * @since 4.0
         */
        get_url(): string;

        /**
         * Gets the {@link ICalGLib.VcardValue} of {@link ICalGLib.VcardProperty}.
         * @returns The {@link ICalGLib.VcardValue} of `prop`.
         * @since 4.0
         */
        get_value(): VcardValue;

        /**
         * Gets the string representation of the value in {@link ICalGLib.VcardProperty}.
         * @returns The string representation of the value of the {@link ICalGLib.VcardProperty}.
         * @since 4.0
         */
        get_value_as_string(): string;

        /**
         * Returns value of the VERSION `self`
         * @returns the VERSION value
         * @since 4.0
         */
        get_version(): VcardPropertyVersion;

        /**
         * Returns value of the X `self`
         * @returns the X value
         * @since 4.0
         */
        get_x(): string;

        /**
         * Gets the name of X property.
         * @returns The name of x property.
         * @since 4.0
         */
        get_x_name(): string | null;

        /**
         * Returns value of the XLICERROR `self`
         * @returns the XLICERROR value
         * @since 4.0
         */
        get_xlicerror(): string;

        /**
         * Returns value of the XML `self`
         * @returns the XML value
         * @since 4.0
         */
        get_xml(): string;

        /**
         * Gets the kind of the `property`.
         * @returns The type of {@link ICalGLib.VcardProperty}.
         * @since 4.0
         */
        isa(): VcardPropertyKind;

        /**
         * Checks whether the native part of {@link ICalGLib.VcardProperty} is valid vCard property.
         * @returns true if the native part of `property` is of the type icalproperty, false if not.
         * @since 4.0
         */
        isa_property(): boolean;

        /**
         * Normalizes (reorder and sorts) the parameters of the `prop`.
         * @since 4.0
         */
        normalize(): void;

        /**
         * Removes all parameters of kind `kind` from the `prop`.
         * @param kind The {@link ICalGLib.VcardParameterKind} to be removed
         * @since 4.0
         */
        remove_parameter_by_kind(kind: VcardParameterKind): void;

        /**
         * Removes all parameters of name `name` from the `prop`.
         * @param name The name of the parameter to be removed
         * @since 4.0
         */
        remove_parameter_by_name(name: string): void;

        /**
         * Removes the parameter in the {@link ICalGLib.VcardProperty} by ref.
         * @param param The {@link ICalGLib.VcardParameter} to be removed
         * @since 4.0
         */
        remove_parameter_by_ref(param: VcardParameter): void;

        /**
         * Sets value to the ADR `self`
         * 
         * Note: this uses a copy of the structured type, not the one stored in
         * the `self`
         * @param value the ADR value
         * @since 4.0
         */
        set_adr(value: VcardStructured): void;

        /**
         * Sets value to the AGENT `self`
         * @param value the AGENT value
         * @since 4.0
         */
        set_agent(value: string): void;

        /**
         * Sets value to the ANNIVERSARY `self`
         * @param value the ANNIVERSARY value
         * @since 4.0
         */
        set_anniversary(value: VcardTime): void;

        /**
         * Sets value to the BDAY `self`
         * @param value the BDAY value
         * @since 4.0
         */
        set_bday(value: VcardTime): void;

        /**
         * Sets value to the BIRTHPLACE `self`
         * @param value the BIRTHPLACE value
         * @since 4.0
         */
        set_birthplace(value: string): void;

        /**
         * Sets value to the CALADRURI `self`
         * @param value the CALADRURI value
         * @since 4.0
         */
        set_caladruri(value: string): void;

        /**
         * Sets value to the CALURI `self`
         * @param value the CALURI value
         * @since 4.0
         */
        set_caluri(value: string): void;

        /**
         * Sets the value of the `self` of CATEGORIES.
         * 
         * Note: this uses a copy of the string array, not the
         * one stored in the `value`
         * @param value the string array value
         * @since 4.0
         */
        set_categories(value: VcardStrArray): void;

        /**
         * Sets value to the CLASS `self`
         * @param value the CLASS value
         * @since 4.0
         */
        set_class(value: string): void;

        /**
         * Sets the value of the `self` of CLIENTPIDMAP.
         * 
         * Note: this uses a copy of the string array, not the
         * one stored in the `value`
         * @param value the string array value
         * @since 4.0
         */
        set_clientpidmap(value: VcardStrArray): void;

        /**
         * Sets value to the CONTACTURI `self`
         * @param value the CONTACTURI value
         * @since 4.0
         */
        set_contacturi(value: string): void;

        /**
         * Sets value to the CREATED `self`
         * @param value the CREATED value
         * @since 4.0
         */
        set_created(value: VcardTime): void;

        /**
         * Sets value to the DEATHDATE `self`
         * @param value the DEATHDATE value
         * @since 4.0
         */
        set_deathdate(value: VcardTime): void;

        /**
         * Sets value to the DEATHPLACE `self`
         * @param value the DEATHPLACE value
         * @since 4.0
         */
        set_deathplace(value: string): void;

        /**
         * Sets value to the EMAIL `self`
         * @param value the EMAIL value
         * @since 4.0
         */
        set_email(value: string): void;

        /**
         * Sets value to the EXPERTISE `self`
         * @param value the EXPERTISE value
         * @since 4.0
         */
        set_expertise(value: string): void;

        /**
         * Sets value to the FBURL `self`
         * @param value the FBURL value
         * @since 4.0
         */
        set_fburl(value: string): void;

        /**
         * Sets value to the FN `self`
         * @param value the FN value
         * @since 4.0
         */
        set_fn(value: string): void;

        /**
         * Sets the value of the `self` of GENDER.
         * 
         * Note: this uses a copy of the string array, not the one
         * stored in the `value`
         * @param value the string array value
         * @since 4.0
         */
        set_gender(value: VcardStrArray): void;

        /**
         * Sets value to the GEO `self`
         * @param value the GEO value
         * @since 4.0
         */
        set_geo(value: VcardGeo): void;

        /**
         * Sets value to the GRAMGENDER `self`
         * @param value the GRAMGENDER value
         * @since 4.0
         */
        set_gramgender(value: VcardPropertyGramgender): void;

        /**
         * Sets the group name of the `prop`.
         * @param group A group name
         * @since 4.0
         */
        set_group(group: string): void;

        /**
         * Sets value to the HOBBY `self`
         * @param value the HOBBY value
         * @since 4.0
         */
        set_hobby(value: string): void;

        /**
         * Sets value to the IMPP `self`
         * @param value the IMPP value
         * @since 4.0
         */
        set_impp(value: string): void;

        /**
         * Sets value to the INTEREST `self`
         * @param value the INTEREST value
         * @since 4.0
         */
        set_interest(value: string): void;

        /**
         * Sets value to the JSPROP `self`
         * @param value the JSPROP value
         * @since 4.0
         */
        set_jsprop(value: string): void;

        /**
         * Sets value to the KEY `self`
         * @param value the KEY value
         * @since 4.0
         */
        set_key(value: string): void;

        /**
         * Sets value to the KIND `self`
         * @param value the KIND value
         * @since 4.0
         */
        set_kind(value: VcardPropertyKindenum): void;

        /**
         * Sets value to the LABEL `self`
         * @param value the LABEL value
         * @since 4.0
         */
        set_label(value: string): void;

        /**
         * Sets value to the LANG `self`
         * @param value the LANG value
         * @since 4.0
         */
        set_lang(value: string): void;

        /**
         * Sets value to the LANGUAGE `self`
         * @param value the LANGUAGE value
         * @since 4.0
         */
        set_language(value: string): void;

        /**
         * Sets value to the LOGO `self`
         * @param value the LOGO value
         * @since 4.0
         */
        set_logo(value: string): void;

        /**
         * Sets value to the MAILER `self`
         * @param value the MAILER value
         * @since 4.0
         */
        set_mailer(value: string): void;

        /**
         * Sets value to the MEMBER `self`
         * @param value the MEMBER value
         * @since 4.0
         */
        set_member(value: string): void;

        /**
         * Sets value to the N `self`
         * 
         * Note: this uses a copy of the structured type, not the one stored in
         * the `self`
         * @param value the N value
         * @since 4.0
         */
        set_n(value: VcardStructured): void;

        /**
         * Sets value to the NAME `self`
         * @param value the NAME value
         * @since 4.0
         */
        set_name(value: string): void;

        /**
         * Sets the value of the `self` of NICKNAME.
         * 
         * Note: this uses a copy of the string array, not the one
         * stored in the `value`
         * @param value the string array value
         * @since 4.0
         */
        set_nickname(value: VcardStrArray): void;

        /**
         * Sets value to the NOTE `self`
         * @param value the NOTE value
         * @since 4.0
         */
        set_note(value: string): void;

        /**
         * Sets the value of the `self` of ORG.
         * 
         * Note: this uses a copy of the string array, not the one stored
         * in the `value`
         * @param value the string array value
         * @since 4.0
         */
        set_org(value: VcardStrArray): void;

        /**
         * Sets value to the ORGDIRECTORY `self`
         * @param value the ORGDIRECTORY value
         * @since 4.0
         */
        set_orgdirectory(value: string): void;

        /**
         * Sets an {@link ICalGLib.VcardParameter} into the {@link ICalGLib.VcardProperty}. It behaves like set the copy of the {@link ICalGLib.VcardParameter}.
         * Upon completion the native part of {@link ICalGLib.VcardParameter} will be set to NULL.
         * @param parameter The parameter to be set into `prop`
         * @since 4.0
         */
        set_parameter(parameter: VcardParameter): void;

        /**
         * Sets the {@link ICalGLib.VcardProperty} with the parameter defined by the name and value.
         * @param name The name of the parameter
         * @param value The value of the parameter
         * @since 4.0
         */
        set_parameter_from_string(name: string, value: string): void;

        /**
         * Sets the parent {@link ICalGLib.VcardComponent} of the specified {@link ICalGLib.VcardProperty}.
         * @param component An {@link ICalGLib.VcardComponent}
         * @since 4.0
         */
        set_parent(component: VcardComponent | null): void;

        /**
         * Sets value to the PHOTO `self`
         * @param value the PHOTO value
         * @since 4.0
         */
        set_photo(value: string): void;

        /**
         * Sets value to the PRODID `self`
         * @param value the PRODID value
         * @since 4.0
         */
        set_prodid(value: string): void;

        /**
         * Sets value to the PRONOUNS `self`
         * @param value the PRONOUNS value
         * @since 4.0
         */
        set_pronouns(value: string): void;

        /**
         * Sets value to the RELATED `self`
         * @param value the RELATED value
         * @since 4.0
         */
        set_related(value: string): void;

        /**
         * Sets value to the REV `self`
         * @param value the REV value
         * @since 4.0
         */
        set_rev(value: VcardTime): void;

        /**
         * Sets value to the ROLE `self`
         * @param value the ROLE value
         * @since 4.0
         */
        set_role(value: string): void;

        /**
         * Sets value to the SOCIALPROFILE `self`
         * @param value the SOCIALPROFILE value
         * @since 4.0
         */
        set_socialprofile(value: string): void;

        /**
         * Sets value to the SORTSTRING `self`
         * @param value the SORTSTRING value
         * @since 4.0
         */
        set_sortstring(value: string): void;

        /**
         * Sets value to the SOUND `self`
         * @param value the SOUND value
         * @since 4.0
         */
        set_sound(value: string): void;

        /**
         * Sets value to the SOURCE `self`
         * @param value the SOURCE value
         * @since 4.0
         */
        set_source(value: string): void;

        /**
         * Sets value to the TEL `self`
         * @param value the TEL value
         * @since 4.0
         */
        set_tel(value: string): void;

        /**
         * Sets value to the TITLE `self`
         * @param value the TITLE value
         * @since 4.0
         */
        set_title(value: string): void;

        /**
         * Sets value to the TZ `self`
         * @param value the TZ value
         * @since 4.0
         */
        set_tz(value: VcardTz): void;

        /**
         * Sets value to the UID `self`
         * @param value the UID value
         * @since 4.0
         */
        set_uid(value: string): void;

        /**
         * Sets value to the URL `self`
         * @param value the URL value
         * @since 4.0
         */
        set_url(value: string): void;

        /**
         * Sets the {@link ICalGLib.VcardProperty} with the {@link ICalGLib.VcardValue}.
         * @param value The {@link ICalGLib.VcardValue} will be set as the property of `prop`
         * @since 4.0
         */
        set_value(value: VcardValue): void;

        /**
         * Sets the {@link ICalGLib.VcardProperty} with the {@link ICalGLib.VcardValue} constructed from string.
         * @param value The value used to construct the {@link ICalGLib.VcardValue}
         * @param kind The kind used to construct the {@link ICalGLib.VcardValue}
         * @since 4.0
         */
        set_value_from_string(value: string, kind: string): void;

        /**
         * Sets value to the VERSION `self`
         * @param value the VERSION value
         * @since 4.0
         */
        set_version(value: VcardPropertyVersion): void;

        /**
         * Sets value to the X `self`
         * @param value the X value
         * @since 4.0
         */
        set_x(value: string): void;

        /**
         * Sets the name of X property for the {@link ICalGLib.VcardProperty}.
         * @param name The name string
         * @since 4.0
         */
        set_x_name(name: string): void;

        /**
         * Sets value to the XLICERROR `self`
         * @param value the XLICERROR value
         * @since 4.0
         */
        set_xlicerror(value: string): void;

        /**
         * Sets value to the XML `self`
         * @param value the XML value
         * @since 4.0
         */
        set_xml(value: string): void;
    }


    namespace VcardStrArray {
        // Signal signatures
        interface SignalSignatures extends Object.SignalSignatures {
            "notify::always-destroy": (pspec: GObject.ParamSpec) => void;
            "notify::is-global-memory": (pspec: GObject.ParamSpec) => void;
            "notify::native": (pspec: GObject.ParamSpec) => void;
            "notify::native-destroy-func": (pspec: GObject.ParamSpec) => void;
            "notify::owner": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends Object.ConstructorProps {}
    }

    /**
     * This is the ICalVcardStrArray instance.
     * @gir-type Class
     */
    class VcardStrArray extends Object {
        static $gtype: GObject.GType<VcardStrArray>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: VcardStrArray.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<VcardStrArray.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        static ["new"](increment_size: number): VcardStrArray;

        // Signals
        /** @signal */
        connect<K extends keyof VcardStrArray.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, VcardStrArray.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof VcardStrArray.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, VcardStrArray.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof VcardStrArray.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<VcardStrArray.SignalSignatures[K]>): void;

        // Methods
        /**
         * Creates a deep copy of {@link ICalGLib.VcardStrArray} with the same properties as the `array`.
         * @returns The newly cloned {@link ICalGLib.VcardStrArray} with the same value as the `array`
         * @since 4.0
         */
        clone(): VcardStrArray;

        /**
         * Removes all the occurrences of the `value` in the `array`.
         * @param value The value to remove.
         * @since 4.0
         */
        remove(value: string): void;

        /**
         * Removes the element at the `position` from the array.
         * @param position The position in which the element will be removed from the array
         * @since 4.0
         */
        remove_element_at(position: bigint | number): void;

        /**
         * Gets the size of the array.
         * @returns The size of current array.
         * @since 4.0
         */
        size(): number;
    }


    namespace VcardStructured {
        // Signal signatures
        interface SignalSignatures extends Object.SignalSignatures {
            "notify::always-destroy": (pspec: GObject.ParamSpec) => void;
            "notify::is-global-memory": (pspec: GObject.ParamSpec) => void;
            "notify::native": (pspec: GObject.ParamSpec) => void;
            "notify::native-destroy-func": (pspec: GObject.ParamSpec) => void;
            "notify::owner": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends Object.ConstructorProps {}
    }

    /**
     * This is the ICalVcardStructured instance.
     * @gir-type Class
     */
    class VcardStructured extends Object {
        static $gtype: GObject.GType<VcardStructured>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: VcardStructured.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<VcardStructured.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        static ["new"](num_fields: number): VcardStructured;

        static new_from_string(str: string): VcardStructured;

        // Signals
        /** @signal */
        connect<K extends keyof VcardStructured.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, VcardStructured.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof VcardStructured.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, VcardStructured.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof VcardStructured.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<VcardStructured.SignalSignatures[K]>): void;

        // Methods
        /**
         * Converts the `self` into its string representation.
         * @param is_param whether the `self` corresponds to a parameter
         * @returns The string representation of the `self`.
         * @since 4.0
         */
        as_vcard_string(is_param: boolean): string;

        /**
         * Clones the `self`.
         * @returns A deep copy of `self`.
         * @since 4.0
         */
        clone(): VcardStructured;

        /**
         * Gets the `self` `position` field. Returns `null` when the item is not set or when the `position` is out of
         * bounds.
         * @param position the zero-based index of the field to retrieve
         * @returns a new {@link ICalGLib.VcardStrArray} at `position`
         * @since 4.0
         */
        get_field_at(position: number): VcardStrArray | null;

        /**
         * Gets the number of fields used by `self`.
         * @returns number of fields
         * @since 4.0
         */
        get_num_fields(): number;

        /**
         * Increments the reference count of `self`.
         * @since 4.0
         */
        ref(): void;

        /**
         * @param args 
         */
    // Conflicted with GObject.Object.ref
        ref(...args: never[]): any;

        /**
         * Sets the `self` `position` field to `field`. If `position` is beyond the current number of fields, the number
         * of fields is extended to accommodate it. Any existing field at `position` is freed before being replaced.
         * @param position the zero-based index of the field to set
         * @param field an {@link ICalGLib.VcardStrArray}
         * @since 4.0
         */
        set_field_at(position: number, field: VcardStrArray): void;

        /**
         * Sets how many fields the `self` will hold. If `num_fields` is smaller than the current number of fields,
         * the excess fields are freed.
         * @param num_fields number of fields
         * @since 4.0
         */
        set_num_fields(num_fields: number): void;
    }


    namespace VcardTime {
        // Signal signatures
        interface SignalSignatures extends Object.SignalSignatures {
            "notify::always-destroy": (pspec: GObject.ParamSpec) => void;
            "notify::is-global-memory": (pspec: GObject.ParamSpec) => void;
            "notify::native": (pspec: GObject.ParamSpec) => void;
            "notify::native-destroy-func": (pspec: GObject.ParamSpec) => void;
            "notify::owner": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends Object.ConstructorProps {}
    }

    /**
     * This is the ICalVcardTime instance.
     * @gir-type Class
     */
    class VcardTime extends Object {
        static $gtype: GObject.GType<VcardTime>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: VcardTime.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<VcardTime.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        static ["new"](): VcardTime;

        static new_current_utc_time(): VcardTime;

        static new_from_string(str: string, is_bare_time: boolean): VcardTime;

        static new_null_date(): VcardTime;

        static new_null_datetime(): VcardTime;

        static new_null_time(): VcardTime;

        static new_null_timestamp(): VcardTime;

        // Signals
        /** @signal */
        connect<K extends keyof VcardTime.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, VcardTime.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof VcardTime.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, VcardTime.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof VcardTime.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<VcardTime.SignalSignatures[K]>): void;

        // Static methods
        /**
         * Returns whether the `year` is a leap year.
         * @param year a year
         * @since 4.0
         */
        static is_leap_year(year: number): boolean;

        // Methods
        /**
         * Returns a string representation of the `self`.
         * @param flags bit-or of {@link ICalGLib.VcardTimeConvertFlags}
         * @returns The string representation
         * @since 4.0
         */
        as_vcard_string(flags: number): string;

        /**
         * Creates a new {@link ICalGLib.VcardTime}, copy of `self`.
         * @returns The newly created {@link ICalGLib.VcardTime}, copy of `self`.
         * @since 4.0
         */
        clone(): VcardTime;

        /**
         * Gets the year/month/date parts of the `timetype` in one call.
         * @since 4.0
         */
        get_date(): [number, number, number];

        /**
         * Gets the day of {@link ICalGLib.VcardTime}.
         * @returns The day.
         * @since 4.0
         */
        get_day(): number;

        /**
         * Gets the hour of {@link ICalGLib.VcardTime}.
         * @returns The hour.
         * @since 4.0
         */
        get_hour(): number;

        /**
         * Gets the minute of {@link ICalGLib.VcardTime}.
         * @returns The minute.
         * @since 4.0
         */
        get_minute(): number;

        /**
         * Gets the month of {@link ICalGLib.VcardTime}.
         * @returns The month.
         * @since 4.0
         */
        get_month(): number;

        /**
         * Gets the second of {@link ICalGLib.VcardTime}.
         * @returns The second.
         * @since 4.0
         */
        get_second(): number;

        /**
         * Gets the hour/minute/second parts of the `timetype` in one call.
         * @since 4.0
         */
        get_time(): [number, number, number];

        /**
         * Gets the UTC offset of {@link ICalGLib.VcardTime}.
         * @returns The UTC offset
         * @since 4.0
         */
        get_utc_offset(): number;

        /**
         * Gets the year of {@link ICalGLib.VcardTime}.
         * @returns The year.
         * @since 4.0
         */
        get_year(): number;

        /**
         * Returns whether `self` represents a date.
         * @returns Whether `self` represents a date.
         * @since 4.0
         */
        is_date(): boolean;

        /**
         * Returns whether `self` represents a datetime.
         * @returns Whether `self` represents a datetime.
         * @since 4.0
         */
        is_datetime(): boolean;

        /**
         * Returns true if the datetime is null.
         * @returns Whether `self` is null datetime.
         * @since 4.0
         */
        is_null_datetime(): boolean;

        /**
         * Returns whether `self` represents a time.
         * @returns Whether `self` represents a time.
         * @since 4.0
         */
        is_time(): boolean;

        /**
         * Returns whether `self` represents a timestamp.
         * @returns Whether `self` represents a timestamp.
         * @since 4.0
         */
        is_timestamp(): boolean;

        /**
         * Returns whether `self` is in UTC zone.
         * @returns Whether `self` is in UTC zone.
         * @since 4.0
         */
        is_utc(): boolean;

        /**
         * Returns whether `self` represents a valid time.
         * @returns Whether `self` represents a valid time.
         * @since 4.0
         */
        is_valid_time(): boolean;

        /**
         * Sets the year/month/date parts of the `timetype` in one call. This doesn't verify validity of the given
         * date.
         * @param year The 'year' part of the date
         * @param month The 'month' part of the date
         * @param day The 'day' part of the date
         * @since 4.0
         */
        set_date(year: number, month: number, day: number): void;

        /**
         * Sets the day of {@link ICalGLib.VcardTime}.
         * @param day The day
         * @since 4.0
         */
        set_day(day: number): void;

        /**
         * Sets the hour of {@link ICalGLib.VcardTime}.
         * @param hour The hour
         * @since 4.0
         */
        set_hour(hour: number): void;

        /**
         * Sets the minute of {@link ICalGLib.VcardTime}.
         * @param minute The minute
         * @since 4.0
         */
        set_minute(minute: number): void;

        /**
         * Sets the month of {@link ICalGLib.VcardTime}.
         * @param month The month
         * @since 4.0
         */
        set_month(month: number): void;

        /**
         * Sets the second of {@link ICalGLib.VcardTime}.
         * @param second The second
         * @since 4.0
         */
        set_second(second: number): void;

        /**
         * Sets the hour/minute/second parts of the `timetype` in one call. This doesn't verify validity of the given
         * time.
         * @param hour The 'hour' part of the time
         * @param minute The 'minute' part of the time
         * @param second The 'second' part of the time
         * @since 4.0
         */
        set_time(hour: number, minute: number, second: number): void;

        /**
         * Sets the UTC offset of {@link ICalGLib.VcardTime}.
         * @param utc_offset The UTC offset
         * @since 4.0
         */
        set_utc_offset(utc_offset: number): void;

        /**
         * Sets the year of {@link ICalGLib.VcardTime}.
         * @param year The year
         * @since 4.0
         */
        set_year(year: number): void;
    }


    namespace VcardTz {
        // Signal signatures
        interface SignalSignatures extends Object.SignalSignatures {
            "notify::always-destroy": (pspec: GObject.ParamSpec) => void;
            "notify::is-global-memory": (pspec: GObject.ParamSpec) => void;
            "notify::native": (pspec: GObject.ParamSpec) => void;
            "notify::native-destroy-func": (pspec: GObject.ParamSpec) => void;
            "notify::owner": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends Object.ConstructorProps {}
    }

    /**
     * This is the ICalVcardTz instance.
     * @gir-type Class
     */
    class VcardTz extends Object {
        static $gtype: GObject.GType<VcardTz>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: VcardTz.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<VcardTz.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        static new_tzid(tzid: string): VcardTz;

        static new_uri(uri: string): VcardTz;

        static new_utc_offset(utc_offset: number): VcardTz;

        // Signals
        /** @signal */
        connect<K extends keyof VcardTz.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, VcardTz.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof VcardTz.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, VcardTz.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof VcardTz.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<VcardTz.SignalSignatures[K]>): void;

        // Methods
        /**
         * Creates a new {@link ICalGLib.VcardTz}, copy of `self`.
         * @returns The newly created {@link ICalGLib.VcardTz}, copy of `self`.
         * @since 4.0
         */
        clone(): VcardTz;

        /**
         * Gets the timezone ID value of the `self`. It can return `null` when not set or when the `self` is not of
         * type timezone ID.
         * @returns a URI
         * @since 4.0
         */
        get_tzid(): string | null;

        /**
         * Gets the URI value of the `self`. It can return `null` when not set or when the `self` is not of type URI.
         * @returns a URI
         * @since 4.0
         */
        get_uri(): string | null;

        /**
         * Gets the UTC offset value of the `self`. It can return 0 when not set or when the `self` is not of UTC
         * offset type.
         * @returns a UTC offset
         * @since 4.0
         */
        get_utc_offset(): number;

        /**
         * Sets the URI value of the `self`.
         * @param tzid a URI
         * @since 4.0
         */
        set_tzid(tzid: string): void;

        /**
         * Sets the URI value of the `self`.
         * @param uri a URI
         * @since 4.0
         */
        set_uri(uri: string): void;

        /**
         * Sets the UTC offset value of the `self`.
         * @param utc_offset a UTC offset
         * @since 4.0
         */
        set_utc_offset(utc_offset: number): void;
    }


    namespace VcardValue {
        // Signal signatures
        interface SignalSignatures extends Object.SignalSignatures {
            "notify::always-destroy": (pspec: GObject.ParamSpec) => void;
            "notify::is-global-memory": (pspec: GObject.ParamSpec) => void;
            "notify::native": (pspec: GObject.ParamSpec) => void;
            "notify::native-destroy-func": (pspec: GObject.ParamSpec) => void;
            "notify::owner": (pspec: GObject.ParamSpec) => void;
        }

        // Constructor properties interface
        interface ConstructorProps extends Object.ConstructorProps {}
    }

    /**
     * This is the ICalVcardValue instance.
     * @gir-type Class
     */
    class VcardValue extends Object {
        static $gtype: GObject.GType<VcardValue>;

        /**
         * Compile-time signal type information.
         *
         * This instance property is generated only for TypeScript type checking.
         * It is not defined at runtime and should not be accessed in JS code.
         * @internal
         */
        $signals: VcardValue.SignalSignatures;

        // Constructors
        constructor(properties?: Partial<VcardValue.ConstructorProps>, ...args: any[]);

        _init(...args: any[]): void;

        static ["new"](kind: VcardValueKind): VcardValue;

        static new_boolean(value: boolean): VcardValue;

        static new_date(value: VcardTime): VcardValue;

        static new_dateandortime(value: VcardTime): VcardValue;

        static new_datetime(value: VcardTime): VcardValue;

        static new_float(value: number): VcardValue;

        static new_from_string(kind: VcardValueKind, str: string): VcardValue;

        static new_geo(value: VcardGeo): VcardValue;

        static new_gramgender(value: VcardPropertyGramgender): VcardValue;

        static new_integer(value: number): VcardValue;

        static new_kind(value: VcardPropertyKindenum): VcardValue;

        static new_languagetag(value: string): VcardValue;

        static new_structured(value: VcardStructured): VcardValue;

        static new_text(value: string): VcardValue;

        static new_textlist(value: VcardStrArray): VcardValue;

        static new_time(value: VcardTime): VcardValue;

        static new_timestamp(value: VcardTime): VcardValue;

        static new_tz(value: VcardTz): VcardValue;

        static new_uri(value: string): VcardValue;

        static new_utcoffset(value: number): VcardValue;

        static new_version(value: VcardPropertyVersion): VcardValue;

        static new_x(value: string): VcardValue;

        // Signals
        /** @signal */
        connect<K extends keyof VcardValue.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, VcardValue.SignalSignatures[K]>): number;

        /** @signal */
        connect_after<K extends keyof VcardValue.SignalSignatures>(signal: K, callback: GObject.SignalCallback<this, VcardValue.SignalSignatures[K]>): number;

        /** @signal */
        emit<K extends keyof VcardValue.SignalSignatures>(signal: K, ...args: GObject.GjsParameters<VcardValue.SignalSignatures[K]>): void;

        // Static methods
        /**
         * Converts a string to {@link ICalGLib.VcardValueKind}.
         * @param str A string
         * @since 4.0
         */
        static kind_from_string(str: string): VcardValueKind;

        /**
         * Checks whether the `kind` is a valid {@link ICalGLib.VcardValueKind}.
         * @param kind The {@link ICalGLib.VcardValueKind} to be checked
         * @since 4.0
         */
        static kind_is_valid(kind: VcardValueKind): boolean;

        /**
         * Converts an {@link ICalGLib.VcardValueKind} to an {@link ICalGLib.VcardPropertyKind}.
         * @param kind An {@link ICalGLib.VcardValueKind}
         * @since 4.0
         */
        static kind_to_property_kind(kind: VcardValueKind): VcardPropertyKind;

        /**
         * Converts the {@link ICalGLib.VcardValueKind} to a string.
         * @param kind A {@link ICalGLib.VcardValueKind}
         * @since 4.0
         */
        static kind_to_string(kind: VcardValueKind): string;

        // Methods
        /**
         * Converts the {@link ICalGLib.VcardValue} to a string.
         * @returns The string representation.
         * @since 4.0
         */
        as_vcard_string(): string;

        /**
         * Deeply clones an {@link ICalGLib.VcardValue}.
         * @returns The newly created {@link ICalGLib.VcardValue} with the same property as `value`.
         * @since 4.0
         */
        clone(): VcardValue;

        /**
         * Returns value of the BOOLEAN `self`
         * @returns the BOOLEAN value
         * @since 4.0
         */
        get_boolean(): boolean;

        /**
         * Returns value of the DATE `self`
         * @returns the DATE value
         * @since 4.0
         */
        get_date(): VcardTime;

        /**
         * Returns value of the DATEANDORTIME `self`
         * @returns the DATEANDORTIME value
         * @since 4.0
         */
        get_dateandortime(): VcardTime;

        /**
         * Returns value of the DATETIME `self`
         * @returns the DATETIME value
         * @since 4.0
         */
        get_datetime(): VcardTime;

        /**
         * Returns value of the FLOAT `self`
         * @returns the FLOAT value
         * @since 4.0
         */
        get_float(): number;

        /**
         * Returns value of the GEO `self`
         * @returns the GEO value
         * @since 4.0
         */
        get_geo(): VcardGeo;

        /**
         * Returns value of the GRAMGENDER `self`
         * @returns the GRAMGENDER value
         * @since 4.0
         */
        get_gramgender(): VcardPropertyGramgender;

        /**
         * Returns value of the INTEGER `self`
         * @returns the INTEGER value
         * @since 4.0
         */
        get_integer(): number;

        /**
         * Returns value of the KIND `self`
         * @returns the KIND value
         * @since 4.0
         */
        get_kind(): VcardPropertyKindenum;

        /**
         * Returns value of the LANGUAGETAG `self`
         * @returns the LANGUAGETAG value
         * @since 4.0
         */
        get_languagetag(): string;

        /**
         * Gets the parent {@link ICalGLib.VcardProperty} of the specified {@link ICalGLib.VcardValue}.
         * @returns The parent {@link ICalGLib.VcardProperty}
         * @since 4.0
         */
        get_parent(): VcardProperty | null;

        /**
         * Returns value of the STRUCTURED `self`
         * 
         * Note: this uses a copy of the structured type, not the one
         * stored in the `self`
         * @returns the STRUCTURED value
         * @since 4.0
         */
        get_structured(): VcardStructured;

        /**
         * Returns value of the TEXT `self`
         * @returns the TEXT value
         * @since 4.0
         */
        get_text(): string;

        /**
         * Gets the value of the `self` of TEXTLIST.
         * 
         * Note: this returns copy of the string array, not the one
         * stored in the `self`
         * @returns the {@link ICalGLib.VcardStrArray} value of the `self`
         * @since 4.0
         */
        get_textlist(): VcardStrArray;

        /**
         * Returns value of the TIME `self`
         * @returns the TIME value
         * @since 4.0
         */
        get_time(): VcardTime;

        /**
         * Returns value of the TIMESTAMP `self`
         * @returns the TIMESTAMP value
         * @since 4.0
         */
        get_timestamp(): VcardTime;

        /**
         * Returns value of the TZ `self`
         * @returns the TZ value
         * @since 4.0
         */
        get_tz(): VcardTz;

        /**
         * Returns value of the URI `self`
         * @returns the URI value
         * @since 4.0
         */
        get_uri(): string;

        /**
         * Returns value of the UTCOFFSET `self`
         * @returns the UTCOFFSET value
         * @since 4.0
         */
        get_utcoffset(): number;

        /**
         * Returns value of the VERSION `self`
         * @returns the VERSION value
         * @since 4.0
         */
        get_version(): VcardPropertyVersion;

        /**
         * Returns value of the X `self`
         * @returns the X value
         * @since 4.0
         */
        get_x(): string;

        /**
         * Checks if {@link ICalGLib.VcardValue} is valid.
         * @returns true if valid, false if not.
         * @since 4.0
         */
        is_valid(): boolean;

        /**
         * Gets the kind of {@link ICalGLib.VcardValue}.
         * @returns The kind of `value`.
         * @since 4.0
         */
        isa(): VcardValueKind;

        /**
         * Checks whether the native part of {@link ICalGLib.VcardValue} is an ical;s vcardvalue.
         * @returns true if yes, false if not.
         * @since 4.0
         */
        isa_value(): boolean;

        /**
         * Reset's the value's kind.
         * @since 4.0
         */
        reset_kind(): void;

        /**
         * Sets value to the BOOLEAN `self`
         * @param value the BOOLEAN value
         * @since 4.0
         */
        set_boolean(value: boolean): void;

        /**
         * Sets value to the DATE `self`
         * @param value the DATE value
         * @since 4.0
         */
        set_date(value: VcardTime): void;

        /**
         * Sets value to the DATEANDORTIME `self`
         * @param value the DATEANDORTIME value
         * @since 4.0
         */
        set_dateandortime(value: VcardTime): void;

        /**
         * Sets value to the DATETIME `self`
         * @param value the DATETIME value
         * @since 4.0
         */
        set_datetime(value: VcardTime): void;

        /**
         * Sets value to the FLOAT `self`
         * @param value the FLOAT value
         * @since 4.0
         */
        set_float(value: number): void;

        /**
         * Sets value to the GEO `self`
         * @param value the GEO value
         * @since 4.0
         */
        set_geo(value: VcardGeo): void;

        /**
         * Sets value to the GRAMGENDER `self`
         * @param value the GRAMGENDER value
         * @since 4.0
         */
        set_gramgender(value: VcardPropertyGramgender): void;

        /**
         * Sets value to the INTEGER `self`
         * @param value the INTEGER value
         * @since 4.0
         */
        set_integer(value: number): void;

        /**
         * Sets value to the KIND `self`
         * @param value the KIND value
         * @since 4.0
         */
        set_kind(value: VcardPropertyKindenum): void;

        /**
         * Sets value to the LANGUAGETAG `self`
         * @param value the LANGUAGETAG value
         * @since 4.0
         */
        set_languagetag(value: string): void;

        /**
         * Sets the parent property of a value.
         * @param property The parent {@link ICalGLib.VcardProperty}
         * @since 4.0
         */
        set_parent(property: VcardProperty | null): void;

        /**
         * Sets value to the STRUCTURED `self`
         * 
         * Note: this uses a copy of the structured type, not the one stored
         * in the `self`
         * @param value the STRUCTURED value
         * @since 4.0
         */
        set_structured(value: VcardStructured): void;

        /**
         * Sets value to the TEXT `self`
         * @param value the TEXT value
         * @since 4.0
         */
        set_text(value: string): void;

        /**
         * Sets the value of the `self` of TEXTLIST.
         * 
         * Note: this uses a copy of the string array, not the one
         * stored in the `value`
         * @param value the string array value
         * @since 4.0
         */
        set_textlist(value: VcardStrArray): void;

        /**
         * Sets value to the TIME `self`
         * @param value the TIME value
         * @since 4.0
         */
        set_time(value: VcardTime): void;

        /**
         * Sets value to the TIMESTAMP `self`
         * @param value the TIMESTAMP value
         * @since 4.0
         */
        set_timestamp(value: VcardTime): void;

        /**
         * Sets value to the TZ `self`
         * @param value the TZ value
         * @since 4.0
         */
        set_tz(value: VcardTz): void;

        /**
         * Sets value to the URI `self`
         * @param value the URI value
         * @since 4.0
         */
        set_uri(value: string): void;

        /**
         * Sets value to the UTCOFFSET `self`
         * @param value the UTCOFFSET value
         * @since 4.0
         */
        set_utcoffset(value: number): void;

        /**
         * Sets value to the VERSION `self`
         * @param value the VERSION value
         * @since 4.0
         */
        set_version(value: VcardPropertyVersion): void;

        /**
         * Sets value to the X `self`
         * @param value the X value
         * @since 4.0
         */
        set_x(value: string): void;
    }


    /**
     * @gir-type Alias
     */
    type ArrayClass = typeof Array;

    /**
     * @gir-type Alias
     */
    type AttachClass = typeof Attach;

    /**
     * @gir-type Alias
     */
    type CompIterClass = typeof CompIter;

    /**
     * @gir-type Alias
     */
    type ComponentClass = typeof Component;

    /**
     * @gir-type Alias
     */
    type DatetimeperiodClass = typeof Datetimeperiod;

    /**
     * @gir-type Alias
     */
    type DurationClass = typeof Duration;

    /**
     * @gir-type Alias
     */
    type EnumArrayClass = typeof EnumArray;

    /**
     * @gir-type Alias
     */
    type GeoClass = typeof Geo;

    /**
     * @gir-type Alias
     */
    type ObjectClass = typeof Object;

    /**
     * @gir-type Alias
     */
    type ParamIterClass = typeof ParamIter;

    /**
     * @gir-type Alias
     */
    type ParameterClass = typeof Parameter;

    /**
     * @gir-type Alias
     */
    type ParserClass = typeof Parser;

    /**
     * @gir-type Alias
     */
    type PeriodClass = typeof Period;

    /**
     * @gir-type Alias
     */
    type PropIterClass = typeof PropIter;

    /**
     * @gir-type Alias
     */
    type PropertyClass = typeof Property;

    /**
     * @gir-type Alias
     */
    type RecurIteratorClass = typeof RecurIterator;

    /**
     * @gir-type Alias
     */
    type RecurrenceClass = typeof Recurrence;

    /**
     * @gir-type Alias
     */
    type ReqstatClass = typeof Reqstat;

    /**
     * @gir-type Alias
     */
    type StrArrayClass = typeof StrArray;

    /**
     * @gir-type Alias
     */
    type TimeClass = typeof Time;

    /**
     * @gir-type Alias
     */
    type TimeSpanClass = typeof TimeSpan;

    /**
     * @gir-type Alias
     */
    type TimezoneClass = typeof Timezone;

    /**
     * @gir-type Alias
     */
    type TriggerClass = typeof Trigger;

    /**
     * @gir-type Alias
     */
    type ValueClass = typeof Value;

    /**
     * @gir-type Alias
     */
    type VcardComponentClass = typeof VcardComponent;

    /**
     * @gir-type Alias
     */
    type VcardEnumArrayClass = typeof VcardEnumArray;

    /**
     * @gir-type Alias
     */
    type VcardGeoClass = typeof VcardGeo;

    /**
     * @gir-type Alias
     */
    type VcardParameterClass = typeof VcardParameter;

    /**
     * @gir-type Alias
     */
    type VcardPropertyClass = typeof VcardProperty;

    /**
     * @gir-type Alias
     */
    type VcardStrArrayClass = typeof VcardStrArray;

    /**
     * @gir-type Alias
     */
    type VcardStructuredClass = typeof VcardStructured;

    /**
     * @gir-type Alias
     */
    type VcardTimeClass = typeof VcardTime;

    /**
     * @gir-type Alias
     */
    type VcardTzClass = typeof VcardTz;

    /**
     * @gir-type Alias
     */
    type VcardValueClass = typeof VcardValue;

    /**
     * @gir-type Struct
     */
    abstract class _Array {
        static $gtype: GObject.GType<_Array>;
    }


    /**
     * @gir-type Struct
     */
    abstract class _Attach {
        static $gtype: GObject.GType<_Attach>;
    }


    /**
     * @gir-type Struct
     */
    abstract class _CompIter {
        static $gtype: GObject.GType<_CompIter>;
    }


    /**
     * @gir-type Struct
     */
    abstract class _Component {
        static $gtype: GObject.GType<_Component>;
    }


    /**
     * @gir-type Struct
     */
    abstract class _Datetimeperiod {
        static $gtype: GObject.GType<_Datetimeperiod>;
    }


    /**
     * @gir-type Struct
     */
    abstract class _Duration {
        static $gtype: GObject.GType<_Duration>;
    }


    /**
     * @gir-type Struct
     */
    abstract class _EnumArray {
        static $gtype: GObject.GType<_EnumArray>;
    }


    /**
     * @gir-type Struct
     */
    abstract class _Geo {
        static $gtype: GObject.GType<_Geo>;
    }


    /**
     * @gir-type Struct
     */
    abstract class _ParamIter {
        static $gtype: GObject.GType<_ParamIter>;
    }


    /**
     * @gir-type Struct
     */
    abstract class _Parameter {
        static $gtype: GObject.GType<_Parameter>;
    }


    /**
     * @gir-type Struct
     */
    abstract class _Parser {
        static $gtype: GObject.GType<_Parser>;
    }


    /**
     * @gir-type Struct
     */
    abstract class _Period {
        static $gtype: GObject.GType<_Period>;
    }


    /**
     * @gir-type Struct
     */
    abstract class _PropIter {
        static $gtype: GObject.GType<_PropIter>;
    }


    /**
     * @gir-type Struct
     */
    abstract class _Property {
        static $gtype: GObject.GType<_Property>;
    }


    /**
     * @gir-type Struct
     */
    abstract class _RecurIterator {
        static $gtype: GObject.GType<_RecurIterator>;
    }


    /**
     * @gir-type Struct
     */
    abstract class _Recurrence {
        static $gtype: GObject.GType<_Recurrence>;
    }


    /**
     * @gir-type Struct
     */
    abstract class _Reqstat {
        static $gtype: GObject.GType<_Reqstat>;
    }


    /**
     * @gir-type Struct
     */
    abstract class _StrArray {
        static $gtype: GObject.GType<_StrArray>;
    }


    /**
     * @gir-type Struct
     */
    abstract class _Time {
        static $gtype: GObject.GType<_Time>;
    }


    /**
     * @gir-type Struct
     */
    abstract class _TimeSpan {
        static $gtype: GObject.GType<_TimeSpan>;
    }


    /**
     * @gir-type Struct
     */
    abstract class _Timezone {
        static $gtype: GObject.GType<_Timezone>;
    }


    /**
     * @gir-type Struct
     */
    abstract class _Trigger {
        static $gtype: GObject.GType<_Trigger>;
    }


    /**
     * @gir-type Struct
     */
    abstract class _Value {
        static $gtype: GObject.GType<_Value>;
    }


    /**
     * @gir-type Struct
     */
    abstract class _VcardComponent {
        static $gtype: GObject.GType<_VcardComponent>;
    }


    /**
     * @gir-type Struct
     */
    abstract class _VcardEnumArray {
        static $gtype: GObject.GType<_VcardEnumArray>;
    }


    /**
     * @gir-type Struct
     */
    abstract class _VcardGeo {
        static $gtype: GObject.GType<_VcardGeo>;
    }


    /**
     * @gir-type Struct
     */
    abstract class _VcardParameter {
        static $gtype: GObject.GType<_VcardParameter>;
    }


    /**
     * @gir-type Struct
     */
    abstract class _VcardProperty {
        static $gtype: GObject.GType<_VcardProperty>;
    }


    /**
     * @gir-type Struct
     */
    abstract class _VcardStrArray {
        static $gtype: GObject.GType<_VcardStrArray>;
    }


    /**
     * @gir-type Struct
     */
    abstract class _VcardStructured {
        static $gtype: GObject.GType<_VcardStructured>;
    }


    /**
     * @gir-type Struct
     */
    abstract class _VcardTime {
        static $gtype: GObject.GType<_VcardTime>;
    }


    /**
     * @gir-type Struct
     */
    abstract class _VcardTz {
        static $gtype: GObject.GType<_VcardTz>;
    }


    /**
     * @gir-type Struct
     */
    abstract class _VcardValue {
        static $gtype: GObject.GType<_VcardValue>;
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

export default ICalGLib;

}

declare module 'gi://ICalGLib' {
    import ICalGLib40 from 'gi://ICalGLib?version=4.0';
    export default ICalGLib40;
}
// END
