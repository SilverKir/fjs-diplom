import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';

// Multer configuration
export const multerConfig = {
  dest: process.env.UPLOAD_LOCATION ?? './uploads/images',
};

// Multer upload options
export const multerOptions = {
  // Enable file size limits
  limits: {
    fileSize:
      process.env.MAX_FILE_SIZE === undefined
        ? 10485760
        : +process.env.MAX_FILE_SIZE,
  },
  // Check the mimetypes to allow for upload
  fileFilter: (
    req: any,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      // Allow storage of file
      cb(null, true);
    } else {
      // Reject file
      cb(
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  }, // Storage properties
  storage: diskStorage({
    // Destination storage path details
    destination: (
      req: Express.Request,
      file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void,
    ) => {
      const uploadPath = multerConfig.dest;
      // Create folder if doesn't exist
      if (!existsSync(uploadPath)) {
        console.log(uploadPath);
        mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    }, // File modification details
    filename: (
      req: Express.Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void,
    ) => {
      // Calling the callback passing the random name generated with the original extension name
      cb(null, `${uuid()}${extname(file.originalname)}`);
    },
  }),
};
