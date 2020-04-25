//Bookmarks button before AddressBar
//Кнопка с выпадающими закладками перед строкой адреса

vivaldi.jdhooks.addStyle(`
#browser.horizontal-menu .jdbookmarkbutton {
    display: none;
}
`, "bookmarks-button.js")

vivaldi.jdhooks.hookModule("toolbars_Toolbar", (moduleInfo, exports) => {
    const React = vivaldi.jdhooks.require("React")
    const SettingsPaths = vivaldi.jdhooks.require("_SettingsPaths")
    const ShowMenu = vivaldi.jdhooks.require("_ShowMenu")
    const CommandManager = vivaldi.jdhooks.require("_CommandManager")

    class newClass extends exports {
        constructor(...e) { super(...e) }

        bookmarksOnClick(event) {
            //TODO: remove condition later
            let menu = CommandManager.getVerticalMenu ? CommandManager.getVerticalMenu() : CommandManager.getNamedMenu("vivaldi", true)
            let idx = menu.findIndex(i => i.labelEnglish == "Bookmarks")
            if (idx > -1) {
                const rect = event.target.getBoundingClientRect()
                const props = {
                    id: 0,
                    rect: {
                        x: parseInt(rect.left),
                        y: parseInt(rect.top),
                        width: parseInt(rect.width),
                        height: parseInt(rect.height)
                    },
                    menu: { items: menu[idx].items }
                }
                ShowMenu.show(props.id, [props], "bottom")
            }
        }

        render() {
            let ret = super.render()
            if (this.props.name == SettingsPaths.kToolbarsNavigation) {
                ret.props.children.push(
                    React.createElement(
                        "div", { className: "button-toolbar jdbookmarkbutton" },
                        React.createElement("button", {
                            tabIndex: -1,
                            className: "button-toolbar",
                            onClick: this.bookmarksOnClick.bind(this),
                            dangerouslySetInnerHTML: {
                                __html: vivaldi.jdhooks.require("_svg_panel_bookmarks")
                            }
                        })
                    )
                )
            }
            return ret
        }
    }
    return newClass
})
