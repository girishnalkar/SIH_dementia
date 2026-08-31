import 'package:flutter_test/flutter_test.dart';
import 'package:patient_app/main.dart';

void main() {
  testWidgets('Patient App smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const SmritiPatientApp());
    expect(find.textContaining('Smriti'), findsWidgets);
  });
}
