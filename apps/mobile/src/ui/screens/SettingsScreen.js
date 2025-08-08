"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SettingsScreen;
var react_1 = require("react");
var react_native_1 = require("react-native");
function SettingsScreen() {
    return (<react_native_1.SafeAreaView style={styles.container}>
      <react_native_1.View style={styles.content}>
        <react_native_1.Text style={styles.title}>Settings Screen</react_native_1.Text>
      </react_native_1.View>
    </react_native_1.SafeAreaView>);
}
var styles = react_native_1.StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
});
