import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { useSettings } from '../../context/settingsContext';
import { COLORBLIND_PALETTES, ColorBlindType } from '../../constants/theme';

const COLORBLIND_OPTIONS: { type: ColorBlindType; label: string; description: string }[] = [
    {
      type: 'deuteranopia',
      label: 'Deuteranopia',
      description: 'Most common — red/green confusion',
    },
    {
      type: 'protanopia',
      label: 'Protanopia',
      description: 'Red appears very dark',
    },
    {
      type: 'tritanopia',
      label: 'Tritanopia',
      description: 'Blue/yellow confusion',
    },
];

export default function SettingsScreen() {
  const { settings, theme, toggleDarkMode, setColorBlindType, categoryColors } = useSettings();

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.container}
    >
      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
        Appearance
      </Text>

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>

        {/* Dark mode */}
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: theme.text }]}>Dark mode</Text>
            <Text style={[styles.rowSubtitle, { color: theme.textSecondary }]}>
              Switch to dark theme
            </Text>
          </View>
          <Switch
            value={settings.darkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor="#fff"
          />
        </View>

        <View style={[styles.separator, { backgroundColor: theme.border }]} />

      </View>

        {/* Colorblind mode */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary}]}>
          Colorblind mode
        </Text>

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>

        {/* Off option */}
        <TouchableOpacity
          style={styles.row}
          onPress={() => setColorBlindType(null)}
        >
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: theme.text }]}>Off</Text>
            <Text style={[styles.rowSubtitle, { color: theme.textSecondary }]}>
              Default colors
            </Text>
          </View>
          <View style={[
            styles.radio,
            { borderColor: theme.primary },
            settings.colorBlindType === null && { backgroundColor: theme.primary },
          ]} />
        </TouchableOpacity>

        <View style={[styles.separator, { backgroundColor: theme.border }]} />

        {/* Colorblind type options */}
        {COLORBLIND_OPTIONS.map((option, index) => (
          <View key={option.type}>
            <TouchableOpacity
              style={styles.row}
              onPress={() => setColorBlindType(option.type)}
            >
              <View style={styles.rowText}>
                <Text style={[styles.rowTitle, { color: theme.text }]}>{option.label}</Text>
                <Text style={[styles.rowSubtitle, { color: theme.textSecondary }]}>
                  {option.description}
                </Text>
                {/* Color preview dots */}
                <View style={styles.colorPreview}>
                  {Object.values(COLORBLIND_PALETTES[option.type]).map((color, i) => (
                    <View
                      key={i}
                      style={[styles.colorDot, { backgroundColor: color }]}
                    />
                  ))}
                </View>
              </View>
              <View style={[
                styles.radio,
                { borderColor: theme.primary },
                settings.colorBlindType === option.type && { backgroundColor: theme.primary },
              ]} />
            </TouchableOpacity>
            {index < COLORBLIND_OPTIONS.length - 1 && (
              <View style={[styles.separator, { backgroundColor: theme.border }]} />
            )}
          </View>
        ))}

      </View> 


    </ScrollView>
  );
}

const styles = StyleSheet.create({
    scroll: {
      flex: 1,
    },
    container: {
      padding: 20,
      gap: 12,
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 4,
    },
    card: {
      borderRadius: 16,
      borderWidth: 1,
      overflow: 'hidden',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      gap: 12,
    },
    rowText: {
      gap: 4,
      flex: 1,
    },
    rowTitle: {
      fontSize: 16,
      fontWeight: '600',
    },
    rowSubtitle: {
      fontSize: 13,
    },
    separator: {
      height: 1,
      marginHorizontal: 16,
    },
    radio: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
    },
    colorPreview: {
      flexDirection: 'row',
      gap: 6,
      marginTop: 8,
    },
    colorDot: {
      width: 16,
      height: 16,
      borderRadius: 8,
    },
});