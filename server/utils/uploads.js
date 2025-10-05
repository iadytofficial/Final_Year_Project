const fs = require('fs');
const path = require('path');
const multer = require('multer');
const sharp = require('sharp');
const NodeClam = require('clamscan');

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE_MB || '5', 10) * 1024 * 1024;
const ALLOWED_TYPES = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp').split(',');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const target = path.join(__dirname, '../../uploads');
    fs.mkdirSync(target, { recursive: true });
    cb(null, target);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    return cb(new Error('Invalid file type'));
  }
  cb(null, true);
}

const upload = multer({ storage, limits: { fileSize: MAX_FILE_SIZE }, fileFilter });

async function scanFile(filePath) {
  try {
    const clamscan = await new NodeClam().init();
    const { isInfected } = await clamscan.isInfected(filePath);
    if (isInfected) throw new Error('Virus detected');
  } catch (e) {
    // If clamscan not available in environment, skip scanning in development
    if (process.env.NODE_ENV === 'production') throw e;
  }
}

async function processImage(filePath, baseUrl) {
  const fileName = path.basename(filePath, path.extname(filePath));
  const dir = path.dirname(filePath);
  const sizes = [150, 300, 600];
  const outputs = {};
  for (const size of sizes) {
    const outPath = path.join(dir, `${fileName}-${size}.webp`);
    // compress to 80% quality or configured
    const quality = Math.round(parseFloat(process.env.IMAGE_COMPRESSION_QUALITY || '0.8') * 100);
    await sharp(filePath).resize(size, size, { fit: 'inside' }).webp({ quality }).toFile(outPath);
    outputs[size] = `${baseUrl}/${path.basename(outPath)}`;
  }
  return {
    thumb150: outputs[150],
    thumb300: outputs[300],
    thumb600: outputs[600],
  };
}

function uploadsBaseUrl(req) {
  const cdn = process.env.CDN_URL;
  if (cdn) return `${cdn}`;
  return `${req.protocol}://${req.get('host')}/uploads`;
}

module.exports = { upload, scanFile, processImage, uploadsBaseUrl };
