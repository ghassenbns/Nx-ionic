/**
 *  This object is a sample of the current user config that we use in Concordia Front end.
 *  The commented parts have to go under review, so can be skipped for the moment.
 *  You can focus on these data:
 *  - profile
 *  - settings:
 *          - user_interface
 *          - localization
 *  - user_type
 *  */

let currentUserConfig = {
    //"_id": "613885db07830047493dc662", //<- this is the id of the configuration document in mongo
    "user_id": 12, //<-this is the actual user id
    "profile": {
        "first_name": "Lorenzo Super Admin",
        "last_name": "",
        "occupation": "",
        "email": "lorenzo.brutti@advanticsys.com",
        "website": "",
        "address": "",
        "phone": "",
        "social_twitter": "",
        "avatar_url": "images\/default-avatar.png",
        "banner_url": "images\/profiles\/generic\/default-banner.png"
    },
    "settings": {
        // "app": {
        //     "user_folder": "user_12_c20ad4d76fe97759aa27a0c99bff6710"
        // },
        "user_interface": {
            "theme": "light",
            "items_per_page": 100,
            "display_density": "normal",
            "language": "en_GB",
            "user_menu_position": "sidebar_navbar_menu",
            "notify_sound": "beetle-alarm",
            "logo": "images\/concordia_header.png",
            "home_background": "\/images\/home-bg.png"
        },
        "localization": {
            "timezone": 246,
            "date_time_format": "DD-MM-YYYY HH:mm:ss",
            "thousand_separator": "none",
            "decimal_separator": "dot",
            "timezone_short_name": "Europe\/Rome"
        },
        "notifications": {
            // "concordia_system": [
            //     "screen"
            // ],
            // "alert_trivial": [
            //     "screen"
            // ],
            // "alert_minor": [
            //     "screen"
            // ],
            // "alert_major": [
            //     "screen"
            // ],
            // "alert_critical": [
            //     "screen"
            // ]
        }
    },
    "extra": {
        // "custom_reports": [
        //     "analisis_diario_peru",
        //     "consumo_anual_peru",
        //     "consumo_mensual_details_peru",
        //     "consumo_mensual_peru",
        //     "consumo_nocturno_peru",
        //     "consumo_por_formato_peru",
        //     "exceso_demanda_peru",
        //     "factura_inteligente_peru",
        //     "informe_diario_peru",
        //     "informe_predictivo_peru",
        //     "informe_semanal_peru",
        //     "heat_meters_pdf",
        //     "heat_meters_spreadsheet"
        // ],
        // "invoice_templates": [],
        // "custom_meter_info": []
    },
    "actions": {
        // "all": {
        //     "can_read": true,
        //     "can_read_foreign": true,
        //     "can_write": true,
        //     "can_write_foreign": true,
        //     "can_delete": true,
        //     "can_delete_foreign": true,
        //     "can_share": true,
        //     "can_execute": true
        // },
        // "my_profile": {
        //     "can_read": true,
        //     "can_write": true,
        //     "can_read_foreign": false,
        //     "can_write_foreign": false,
        //     "can_delete": false,
        //     "can_delete_foreign": false,
        //     "can_share": false,
        //     "can_execute": false
        // },
        // "levels": {
        //     "new_user": true,
        //     "super_admin": true
        // }
    },
    "user_type": "super_admin"
}