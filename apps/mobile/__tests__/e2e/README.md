# End-to-End Tests

## Responsibility
End-to-End (E2E) tests verify complete user workflows and scenarios by testing the application as a real user would interact with it.

## Architectural Purpose
- **User Workflow Validation**: Ensure complete user journeys work correctly
- **System Integration**: Validate the entire system works together
- **Realistic Testing**: Test with production-like data and conditions
- **Regression Prevention**: Catch issues that affect user experience

## Developer Guidelines
- Test complete user scenarios and workflows
- Use realistic test data and conditions
- Focus on critical user journeys and business processes
- Keep tests stable and maintainable
- Run E2E tests as part of CI/CD pipeline for releases

## Examples
```typescript
// Example E2E test
describe('Photo Upload Workflow', () => {
  it('should allow user to upload and view photo', async () => {
    await device.reloadReactNative();
    
    await element(by.id('uploadButton')).tap();
    await element(by.id('photoPicker')).tap();
    await element(by.id('confirmUpload')).tap();
    
    await expect(element(by.id('photoList'))).toBeVisible();
  });
});
```

## Boundaries
- E2E tests focus on complete user workflows
- Test the application as a real user would
- Run less frequently than unit and integration tests
- Part of the overall test suite execution