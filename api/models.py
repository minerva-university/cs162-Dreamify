from . import db
from flask_login import UserMixin

class Parent(UserMixin, db.Model):
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.Text)
    last_name = db.Column(db.Text)
    password = db.Column(db.Text)
    email = db.Column(db.Text)
    
    # Relationship to Child
    children = db.relationship('Child', backref='parent', lazy=True)

class Child(db.Model):
    child_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    parent_id = db.Column(db.Integer, db.ForeignKey('parents.user_id'))
    eye_color = db.Column(db.Text)
    hair_type = db.Column(db.Text)
    hair_color = db.Column(db.Text)
    skin_tone = db.Column(db.Text)
    name = db.Column(db.Text)
    age_range = db.Column(db.Text)
    sex = db.Column(db.Text)
    sibling_relationship = db.Column(db.Text)
    fav_animals = db.Column(db.Text)
    fav_activities = db.Column(db.Text)
    fav_shows = db.Column(db.Text)
    
    # Relationship to Story
    stories = db.relationship('Story', backref='child', lazy=True)

class Story(db.Model):
    story_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    child_id = db.Column(db.Integer, db.ForeignKey('children.child_id'))
    topic = db.Column(db.Text)
    image_style = db.Column(db.Text)
    
    # Relationship to Chapter
    chapters = db.relationship('Chapter', backref='story', lazy=True)

class Chapter(db.Model):
    chapter_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    story_id = db.Column(db.Integer, db.ForeignKey('stories.story_id'))
    content = db.Column(db.Text)
    image = db.Column(db.Text)
    order = db.Column(db.Integer)