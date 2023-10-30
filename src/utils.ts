function isVueTemplate(url: string): boolean {
  if (/\.vue\?vue&type=template/.test(url)) {
    return true;
  } else {
    return false;
  }
}

function isScriptTemplate(url: string): boolean {
  if (/\.vue\?vue&type=script/.test(url)) {
    return true;
  } else {
    return false;
  }
}

export { isVueTemplate, isScriptTemplate };
