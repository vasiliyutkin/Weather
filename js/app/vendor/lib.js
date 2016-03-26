define("vendor", [
	"jquery",
	"lodash",
	"flexslider",
	"perfectScrollbarJQuery"
], function ($, _, scrollbar, flexslider, perfectScrollbarJQuery) {
	return {
		"$": $,
		"_": _,
		"scrollbar": scrollbar,
		"flexslider": flexslider,
		"perfectScrollbarJQuery": perfectScrollbarJQuery
	};
} );