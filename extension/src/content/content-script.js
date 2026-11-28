
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["src/content/content-script.js"],
    });
  } catch (error) {
    console.error("Lotus could not start on this tab", error);
  }
});
