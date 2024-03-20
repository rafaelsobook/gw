export function createGUIbtn(GUI, btnDetails){
    const {width,height,color,background,pt,btnName,label} = btnDetails
    var btn = GUI.Button.CreateSimpleButton(btnName, label);
    btn.width = width
    btn.height = height
    btn.color = color
    btn.background = background
    btn.paddingTop = pt
    return btn
}
export function createPanel(GUI, panelDet, isLeft, DynamicTexture) {
    const {width,height,background,pt,panelName} = panelDet
    const panel = new GUI.StackPanel(panelName)
    if(width)panel.width = width
    if(height)panel.height = height
    panel.horizontalAlignment = isLeft ? GUI.Control.HORIZONTAL_ALIGNMENT_LEFT : GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
    if(background) panel.background = background
    panel.paddingTop = pt
    panel.paddingBottom = pt

    DynamicTexture && DynamicTexture.addControl(panel)
    return panel;
}
export function createTextBlock(GUI, textDetails, parent){
    const {height, color, text} = textDetails
    const textBlock = new GUI.TextBlock();
    textBlock.text = text;
    textBlock.color = color
    textBlock.height = height
    parent && parent.addControl(textBlock);   
    return textBlock  
}
export function inputField(GUI, inputFieldDetails, AdvancedDynamicTexture){
    const {width,height,background, color,label} = inputFieldDetails
    const input = new GUI.InputText();
    input.width = width
    input.height = height
    // input.text = label
    input.placeholderText = label
    input.color = color
    input.background = background
    input.focusedBackground = background
    
    input.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER; // Set text alignment to center


    // Add input field to GUI
    AdvancedDynamicTexture.addControl(input);
    return input
}