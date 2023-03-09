/* global Feature, Scenario, locate */

const { initLabelStudio } = require('./helpers');

Feature('Image list via `valueList`');

const config = `
  <View>
    <Image name="img" valueList="$images"/>
    <RectangleLabels name="tag" toName="img">
      <Label value="Planet"></Label>
      <Label value="Moonwalker" background="blue"></Label>
    </RectangleLabels>
  </View>
`;

const data = {
  images: [
    'https://data.heartex.net/open-images/train_0/mini/0030019819f25b28.jpg',
    'https://data.heartex.net/open-images/train_0/mini/00155094b7acc33b.jpg',
    'https://data.heartex.net/open-images/train_0/mini/00133643bbf063a9.jpg',
    'https://data.heartex.net/open-images/train_0/mini/0061ec6e9576b520.jpg',
  ],
};

const result = [
  {
    'original_width': 768,
    'original_height': 576,
    'image_rotation': 0,
    'value': {
      'x': 7.814060788954878,
      'y': 42.05253910374108,
      'width': 11.226011120078905,
      'height': 10.491211550533542,
      'rotation': 0,
      'rectanglelabels': [
        'Planet',
      ],
    },
    'id': 'SBHuSbuOoI',
    'from_name': 'tag',
    'to_name': 'img',
    'type': 'rectanglelabels',
    'origin': 'manual',
    'item_index': 0,
  },
  {
    'original_width': 768,
    'original_height': 510,
    'image_rotation': 0,
    'value': {
      'x': 40.237685381355924,
      'y': 22.88135593220339,
      'width': 7.878707627118645,
      'height': 18.64406779661017,
      'rotation': 0,
      'rectanglelabels': [
        'Moonwalker',
      ],
    },
    'id': 'spPCrj0omt',
    'from_name': 'tag',
    'to_name': 'img',
    'type': 'rectanglelabels',
    'origin': 'manual',
    'item_index': 1,
  },
  {
    'original_width': 768,
    'original_height': 576,
    'image_rotation': 0,
    'value': {
      'x': 37.190330463635505,
      'y': 50.85521215886758,
      'width': 15.008743610438549,
      'height': 14.539802110423578,
      'rotation': 0,
      'rectanglelabels': [
        'Planet',
      ],
    },
    'id': '4SkI4GVN4u',
    'from_name': 'tag',
    'to_name': 'img',
    'type': 'rectanglelabels',
    'origin': 'manual',
    'item_index': 0,
  },
];

Before(async ({ LabelStudio }) => {
  LabelStudio.setFeatureFlags({
    feat_front_lsdv_4583_multi_image_segmentation_short: true,
  });
});

Scenario('Image list rendering', async ({ I, AtImageView }) => {
  const params = {
    config,
    data,
    annotations: [{ id: 1, result: [] }],
  };

  I.amOnPage('/');
  I.executeScript(initLabelStudio, params);

  await AtImageView.waitForImage();
  await AtImageView.lookForStage();

  I.seeElement(`img[src="${data.images[0]}"]`);
});

Scenario('Image list with page navigation', async ({ I, AtImageView }) => {
  const params = {
    config,
    data,
    annotations: [{ id: 1, result: [] }],
  };

  const prevPageButton = locate('.lsf-pagination__btn.lsf-pagination__btn_arrow-left');
  const nextPageButton = locate('.lsf-pagination__btn.lsf-pagination__btn_arrow-right');

  I.amOnPage('/');
  I.executeScript(initLabelStudio, params);

  await AtImageView.waitForImage();
  await AtImageView.lookForStage();

  I.say('Loading first image');
  I.seeElement(`img[src="${data.images[0]}"]`);

  I.say('Pagination is visible');
  I.seeElement('.lsf-pagination');

  I.say('The number of pages is correct');
  I.see('1 of 4');

  I.say('Clicking on the next page');
  I.click(nextPageButton);

  I.say('Loading second image');
  I.seeElement(`img[src="${data.images[1]}"]`);
  I.see('2 of 4');

  I.say('Clicking on the previous page');
  I.click(prevPageButton);
  I.seeElement(`img[src="${data.images[0]}"]`);
  I.see('1 of 4');
});

Scenario('Image list with hotkey navigation', async ({ I, AtImageView }) => {
  const params = {
    config,
    data,
    annotations: [{ id: 1, result: [] }],
  };

  I.amOnPage('/');
  I.executeScript(initLabelStudio, params);

  await AtImageView.waitForImage();
  await AtImageView.lookForStage();

  I.say('Loading first image');
  I.seeElement(`img[src="${data.images[0]}"]`);

  I.say('Pagination is visible');
  I.seeElement('.lsf-pagination');

  I.say('The number of pages is correct');
  I.see('1 of 4');

  I.say('Clicking on the next page');
  I.pressKey('Ctrl+d');

  I.say('Loading second image');
  I.seeElement(`img[src="${data.images[1]}"]`);
  I.see('2 of 4');

  I.say('Clicking on the previous page');
  I.pressKey('Ctrl+a');
  I.seeElement(`img[src="${data.images[0]}"]`);
  I.see('1 of 4');
});

Scenario('Image list exports correct data', async ({ I, LabelStudio, AtImageView }) => {
  LabelStudio.setFeatureFlags({
    feat_front_lsdv_4583_multi_image_segmentation_short: true,
  });

  const params = {
    config,
    data,
    annotations: [{ id: 1, result }],
  };

  I.amOnPage('/');
  I.executeScript(initLabelStudio, params);

  await AtImageView.waitForImage();
  await AtImageView.lookForStage();

  I.say('Attempting to go to the next image');
  I.pressKey('Ctrl+d');

  await AtImageView.waitForImage();
  await AtImageView.lookForStage();
  I.seeElement(`img[src="${data.images[1]}"]`);

  await LabelStudio.resultsNotChanged(result);
});

// TODO: temporarily disable, will be fixed in another ticket
// Scenario('Regions are not changes when duplicating an annotation', async ({ I, LabelStudio, AtImageView }) => {
//   const params = {
//     config,
//     data,
//     annotations: [{ id: 1, result }],
//   };
// 
//   I.amOnPage('/');
//   I.executeScript(initLabelStudio, params);
// 
//   await AtImageView.waitForImage();
//   await AtImageView.lookForStage();
// 
//   I.say('Attempting to duplicate an annotaion');
//   I.click('[aria-label="Copy Annotation"]');
// 
//   await AtImageView.waitForImage();
//   await AtImageView.lookForStage();
// 
//   I.say('Confirm that result is not changed');
//   await LabelStudio.resultsNotChanged(result);
// });
