export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/health/index',
    'pages/medication/index',
    'pages/medical/index',
    'pages/family/index',
    'pages/health/blood-pressure/index',
    'pages/health/blood-sugar/index',
    'pages/health/temperature/index',
    'pages/health/sleep/index',
    'pages/health/water/index',
    'pages/health/bowel/index',
    'pages/health/weekly-report/index',
    'pages/medication/add/index',
    'pages/medication/detail/index',
    'pages/medical/appointment/index',
    'pages/medical/checkup/index',
    'pages/medical/add-appointment/index',
    'pages/home/elder-mode/index',
    'pages/family/add-member/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#2E7D6B',
    navigationBarTitleText: '康护家园',
    navigationBarTextStyle: 'white',
    backgroundColor: '#F5F8F7'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#2E7D6B',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/health/index',
        text: '健康'
      },
      {
        pagePath: 'pages/medication/index',
        text: '用药'
      },
      {
        pagePath: 'pages/medical/index',
        text: '就医'
      },
      {
        pagePath: 'pages/family/index',
        text: '家属'
      }
    ]
  }
})
