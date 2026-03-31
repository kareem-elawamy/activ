// app/api/coaches/[id]/route.js
import { NextResponse } from 'next/server';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import { coachesData } from '@/app/lib/coachesStore';

// مكان تخزين البيانات (مشترك مع route.js)

// GET - جلب مدرب واحد بالـ ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // في Production استخدمي database
    // const coach = await db.coaches.findById(id);
    
    const coach = coachesData.find(c => c.id === id);
    
    if (!coach) {
      return NextResponse.json(
        { error: 'Coach not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(coach);
  } catch (error) {
    console.error('Error fetching coach:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coach' },
      { status: 500 }
    );
  }
}

// PUT - تحديث مدرب
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const formData = await request.formData();
    
    // العثور على المدرب
    const coachIndex = coachesData.findIndex(c => c.id === id);
    
    if (coachIndex === -1) {
      return NextResponse.json(
        { error: 'Coach not found' },
        { status: 404 }
      );
    }

    const existingCoach = coachesData[coachIndex];
    
    // استخراج البيانات المحدثة
    const updatedData = {
      ...existingCoach,
      name: formData.get('name'),
      nameAr: formData.get('nameAr'),
      title: formData.get('title'),
      titleAr: formData.get('titleAr'),
      bio: formData.get('bio'),
      bioAr: formData.get('bioAr'),
      specialization: formData.get('specialization'),
      experience: formData.get('experience'),
      students: formData.get('students'),
      certifications: formData.get('certifications'),
      rating: formData.get('rating'),
      specializations: JSON.parse(formData.get('specializations') || '[]'),
      achievements: JSON.parse(formData.get('achievements') || '[]'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      updatedAt: new Date().toISOString(),
    };

    // معالجة رفع صورة جديدة
    const imageFile = formData.get('image');
    if (imageFile && imageFile.size > 0) {
      // حذف الصورة القديمة
      if (existingCoach.image) {
        try {
          const oldImagePath = path.join(process.cwd(), 'public', existingCoach.image);
          await unlink(oldImagePath);
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }

      // رفع الصورة الجديدة
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'coaches');
      try {
        await mkdir(uploadsDir, { recursive: true });
      } catch (error) {
        // المجلد موجود
      }

      const filename = `coach_${Date.now()}_${imageFile.name.replace(/\s/g, '_')}`;
      const filepath = path.join(uploadsDir, filename);
      await writeFile(filepath, buffer);

      updatedData.image = `/uploads/coaches/${filename}`;
    }

    // تحديث في الـ database (في Production)
    // await db.coaches.update(id, updatedData);
    
    // تحديث مؤقت في الذاكرة
    coachesData[coachIndex] = updatedData;

    return NextResponse.json({
      success: true,
      message: 'Coach updated successfully',
      data: updatedData,
    });
  } catch (error) {
    console.error('Error updating coach:', error);
    return NextResponse.json(
      { error: 'Failed to update coach' },
      { status: 500 }
    );
  }
}

// DELETE - حذف مدرب
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // العثور على المدرب
    const coachIndex = coachesData.findIndex(c => c.id === id);
    
    if (coachIndex === -1) {
      return NextResponse.json(
        { error: 'Coach not found' },
        { status: 404 }
      );
    }

    const coach = coachesData[coachIndex];

    // حذف الصورة من الـ server
    if (coach.image) {
      try {
        const imagePath = path.join(process.cwd(), 'public', coach.image);
        await unlink(imagePath);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    // حذف من الـ database (في Production)
    // await db.coaches.delete(id);
    
    // حذف من الذاكرة
    coachesData.splice(coachIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Coach deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting coach:', error);
    return NextResponse.json(
      { error: 'Failed to delete coach' },
      { status: 500 }
    );
  }
}
