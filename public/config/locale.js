app

.config(["localStorageServiceProvider", function(localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix("gitlabAuditor");
}])

.config(["$translateProvider", function($translateProvider) {

    var zh_tw = {
        "Index": "首頁",
        "User Audit": "人員稽核",
        "Repo Audit": "專案稽核",
        "Show List": "顯示列表",
        "Language": "語系切換",
        "Config": "系統設置"
    };

    $translateProvider.translations("zh_tw", zh_tw);
    $translateProvider.translations("zh_TW", zh_tw);

    $translateProvider
    .registerAvailableLanguageKeys(["zh_tw"], {
        "zh*": "zh_tw"
    })
    .useStorage("localStorageService")
    .determinePreferredLanguage();

}])

;
