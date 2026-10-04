import { StyleSheet, Text, View } from 'react-native';

import { DashboardSummary } from '@/lib/api';
import { trendBarHeight } from '@/lib/analytics';

export function ProAnalytics({ summary }: { summary: DashboardSummary }) {
  const maximum = Math.max(...summary.monthly_trend.map((item) => Number(item.total)), 0);

  return <View style={styles.wrapper}>
    <View style={styles.card}>
      <Text style={styles.title}>Spending by category</Text>
      <Text style={styles.caption}>Confirmed expenses only</Text>
      {summary.category_breakdown.map((item) => <View key={item.category} style={styles.categoryRow}>
        <View><Text style={styles.label}>{item.category}</Text><Text style={styles.caption}>{item.expense_count} expense{item.expense_count === 1 ? '' : 's'}</Text></View>
        <Text style={styles.amount}>${Number(item.total).toFixed(2)}</Text>
      </View>)}
      {!summary.category_breakdown.length && <Text style={styles.caption}>No confirmed expenses yet.</Text>}
    </View>
    <View style={styles.card}>
      <Text style={styles.title}>Six-month trend</Text>
      <View style={styles.chart}>{summary.monthly_trend.map((item) => <View key={item.month} style={styles.barColumn}>
        <Text style={styles.barValue}>${Number(item.total).toFixed(0)}</Text>
        <View style={[styles.bar, { height: trendBarHeight(Number(item.total), maximum) }]} />
        <Text style={styles.month}>{item.month.slice(5)}</Text>
      </View>)}</View>
    </View>
  </View>;
}

const styles = StyleSheet.create({ wrapper: { gap: 14 }, card: { backgroundColor: '#FFF', borderRadius: 16, padding: 17, gap: 10 }, title: { color: '#17233B', fontSize: 18, fontWeight: '800' }, caption: { color: '#667085', fontSize: 12 }, categoryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#EEF1F5', paddingTop: 10 }, label: { color: '#25324B', fontWeight: '700' }, amount: { color: '#17233B', fontWeight: '900' }, chart: { height: 165, flexDirection: 'row', alignItems: 'flex-end', gap: 8 }, barColumn: { flex: 1, alignItems: 'center', gap: 5 }, barValue: { color: '#667085', fontSize: 9 }, bar: { width: '100%', maxWidth: 34, backgroundColor: '#1B6EF3', borderTopLeftRadius: 5, borderTopRightRadius: 5 }, month: { color: '#667085', fontSize: 10 } });
